/**
 * ENGINE 2: VAT RATE AUDITOR
 * Detects VAT rate errors on commercial energy bills
 */

import { BillData } from './OCRExtractionEngine';

export interface VATAuditResult {
  total_bills_audited: number;
  bills_with_errors: number;
  total_overcharge: number;
  errors: VATError[];
}

export interface VATError {
  bill_id?: string;
  bill_date?: Date;
  bill_number?: string;
  applied_rate: number;
  correct_rate: number;
  subtotal: number;
  overcharge: number;
  claim_type: string;
  description: string;
}

export interface FacilityData {
  type: string;
  hiqa_registered?: boolean;
  vat_exemption_registered?: boolean;
  care_facility?: boolean;
  residential_care?: boolean;
}

export class VATRateAuditor {
  
  // Irish VAT rates for energy
  private readonly VAT_RATES = {
    NURSING_HOME_REDUCED: 0.09,     // 9% for registered nursing homes
    COMMERCIAL_STANDARD: 0.135,      // 13.5% for commercial customers
    RESIDENTIAL_STANDARD: 0.135,     // 13.5% for residential
    HOSPITALITY_REDUCED: 0.09,       // 9% for qualifying hospitality
  };
  
  /**
   * Audit VAT rates across multiple bills for a facility
   */
  async auditVAT(bills: BillData[], facilityData: FacilityData): Promise<VATAuditResult> {
    const errors: VATError[] = [];
    let totalOvercharge = 0;
    
    for (const bill of bills) {
      const error = this.auditSingleBill(bill, facilityData);
      if (error) {
        errors.push(error);
        totalOvercharge += error.overcharge;
      }
    }
    
    return {
      total_bills_audited: bills.length,
      bills_with_errors: errors.length,
      total_overcharge: totalOvercharge,
      errors
    };
  }
  
  /**
   * Audit a single bill for VAT errors
   */
  private auditSingleBill(bill: BillData, facilityData: FacilityData): VATError | null {
    // Determine correct VAT rate for this facility
    const correctRate = this.determineCorrectVATRate(facilityData);
    
    // Get applied VAT rate from bill
    const appliedRate = this.getAppliedVATRate(bill);
    
    if (appliedRate === null || correctRate === null) {
      console.warn('Unable to determine VAT rates for bill');
      return null;
    }
    
    // Allow 0.1% rounding tolerance
    const difference = Math.abs(appliedRate - correctRate);
    if (difference < 0.001) {
      return null; // No error
    }
    
    // Calculate overcharge
    const subtotal = bill.subtotal_before_vat || this.calculateSubtotal(bill);
    const overcharge = subtotal * (appliedRate - correctRate);
    
    // Only report if customer was overcharged
    if (overcharge <= 0) {
      return null;
    }
    
    return {
      bill_date: bill.bill_date,
      bill_number: bill.bill_number,
      applied_rate: appliedRate,
      correct_rate: correctRate,
      subtotal: subtotal,
      overcharge: overcharge,
      claim_type: 'VAT_RATE_ERROR',
      description: this.generateErrorDescription(appliedRate, correctRate, facilityData)
    };
  }
  
  /**
   * Determine correct VAT rate based on facility type
   */
  private determineCorrectVATRate(facilityData: FacilityData): number | null {
    const { type, hiqa_registered, care_facility, residential_care } = facilityData;
    
    // Nursing homes with HIQA registration qualify for 9% VAT
    if (type === 'nursing_home' && hiqa_registered) {
      return this.VAT_RATES.NURSING_HOME_REDUCED;
    }
    
    // Residential care facilities may also qualify
    if (care_facility && residential_care) {
      return this.VAT_RATES.NURSING_HOME_REDUCED;
    }
    
    // Hotels and hospitality (tourism services) - 9% VAT
    if (type === 'hotel' || type === 'guest_house' || type === 'bnb') {
      return this.VAT_RATES.HOSPITALITY_REDUCED;
    }
    
    // Standard commercial rate for everything else
    return this.VAT_RATES.COMMERCIAL_STANDARD;
  }
  
  /**
   * Extract applied VAT rate from bill
   */
  private getAppliedVATRate(bill: BillData): number | null {
    // Method 1: Direct VAT rate field
    if (bill.vat_rate !== undefined && bill.vat_rate !== null) {
      return bill.vat_rate;
    }
    
    // Method 2: Calculate from VAT amount and subtotal
    if (bill.vat_amount && bill.subtotal_before_vat) {
      return bill.vat_amount / bill.subtotal_before_vat;
    }
    
    // Method 3: Calculate from total and subtotal
    if (bill.total_amount && bill.subtotal_before_vat) {
      const vatAmount = bill.total_amount - bill.subtotal_before_vat;
      return vatAmount / bill.subtotal_before_vat;
    }
    
    return null;
  }
  
  /**
   * Calculate subtotal if not provided
   */
  private calculateSubtotal(bill: BillData): number {
    let subtotal = 0;
    
    if (bill.unit_charges) subtotal += bill.unit_charges;
    if (bill.standing_charges) subtotal += bill.standing_charges;
    if (bill.network_charges) subtotal += bill.network_charges;
    if (bill.capacity_charges) subtotal += bill.capacity_charges;
    if (bill.pso_levy) subtotal += bill.pso_levy;
    if (bill.ccl_carbon_tax) subtotal += bill.ccl_carbon_tax;
    if (bill.reactive_power_charge) subtotal += bill.reactive_power_charge;
    if (bill.other_charges) subtotal += bill.other_charges;
    
    return subtotal;
  }
  
  /**
   * Generate human-readable error description
   */
  private generateErrorDescription(appliedRate: number, correctRate: number, facilityData: FacilityData): string {
    const appliedPercent = (appliedRate * 100).toFixed(1);
    const correctPercent = (correctRate * 100).toFixed(1);
    
    let description = `Incorrect VAT rate applied. Bill charged ${appliedPercent}% but correct rate is ${correctPercent}%. `;
    
    if (facilityData.type === 'nursing_home' && facilityData.hiqa_registered) {
      description += 'Nursing homes registered with HIQA qualify for reduced 9% VAT rate on energy.';
    } else if (facilityData.type === 'hotel') {
      description += 'Hotels qualify for reduced 9% VAT rate on energy as part of tourism services.';
    }
    
    return description;
  }
  
  /**
   * Generate claim submission documentation
   */
  generateClaimDocumentation(auditResult: VATAuditResult, facilityData: FacilityData): {
    summary: string;
    evidence: string[];
    amount: number;
  } {
    const totalOvercharge = auditResult.total_overcharge;
    const billCount = auditResult.bills_with_errors;
    
    const summary = `VAT Rate Error Claim: ${billCount} bills charged incorrect VAT rate. ` +
                   `Total overcharge: €${totalOvercharge.toFixed(2)}`;
    
    const evidence = [
      `Facility Type: ${facilityData.type}`,
      facilityData.hiqa_registered ? 'HIQA Registered: Yes' : '',
      `Number of bills with errors: ${billCount}`,
      `Period covered: ${auditResult.errors[0]?.bill_date} to ${auditResult.errors[billCount-1]?.bill_date}`,
      `Incorrect rate applied: ${(auditResult.errors[0]?.applied_rate * 100).toFixed(1)}%`,
      `Correct rate: ${(auditResult.errors[0]?.correct_rate * 100).toFixed(1)}%`,
    ].filter(Boolean);
    
    return {
      summary,
      evidence,
      amount: totalOvercharge
    };
  }
  
  /**
   * Validate facility eligibility for reduced VAT rate
   */
  async validateFacilityEligibility(facilityData: FacilityData): Promise<{
    eligible: boolean;
    rate: number;
    reason: string;
  }> {
    const correctRate = this.determineCorrectVATRate(facilityData);
    const isReduced = correctRate === this.VAT_RATES.NURSING_HOME_REDUCED || 
                     correctRate === this.VAT_RATES.HOSPITALITY_REDUCED;
    
    let reason = '';
    if (facilityData.type === 'nursing_home' && facilityData.hiqa_registered) {
      reason = 'HIQA registered nursing home - qualifies for 9% VAT';
    } else if (facilityData.type === 'hotel') {
      reason = 'Hotel/hospitality - qualifies for 9% VAT';
    } else {
      reason = 'Commercial facility - standard 13.5% VAT applies';
    }
    
    return {
      eligible: isReduced,
      rate: correctRate || this.VAT_RATES.COMMERCIAL_STANDARD,
      reason
    };
  }
}

export default VATRateAuditor;
