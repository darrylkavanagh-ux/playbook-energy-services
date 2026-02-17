/**
 * ENGINE 5: ESTIMATED BILLING DETECTOR
 * Identifies bills based on estimated meter readings
 */

import { BillData } from './OCRExtractionEngine';

export interface EstimatedBillingResult {
  total_bills: number;
  estimated_bills: number;
  estimated_percentage: number;
  potential_overcharge: number;
  findings: EstimatedBillingFinding[];
}

export interface EstimatedBillingFinding {
  bill_id?: string;
  bill_date?: Date;
  bill_number?: string;
  estimated: boolean;
  consumption_kwh: number;
  billed_amount: number;
  estimated_overcharge: number;
  months_since_actual_reading: number;
  recommendation: string;
}

export class EstimatedBillingDetector {
  
  /**
   * Analyze bills for estimated reading issues
   */
  async detectEstimatedBilling(bills: BillData[]): Promise<EstimatedBillingResult> {
    const estimatedBills = bills.filter(bill => bill.estimated === true);
    const estimatedPercentage = (estimatedBills.length / bills.length) * 100;
    
    const findings: EstimatedBillingFinding[] = [];
    let totalPotentialOvercharge = 0;
    
    // Track consecutive estimated bills
    let consecutiveEstimated = 0;
    let lastActualReading: BillData | null = null;
    
    for (let i = 0; i < bills.length; i++) {
      const bill = bills[i];
      
      if (bill.estimated) {
        consecutiveEstimated++;
        
        // Calculate potential overcharge (conservative 5% estimate)
        const estimatedOvercharge = (bill.total_amount || 0) * 0.05;
        totalPotentialOvercharge += estimatedOvercharge;
        
        findings.push({
          bill_date: bill.bill_date,
          bill_number: bill.bill_number,
          estimated: true,
          consumption_kwh: bill.total_kwh || 0,
          billed_amount: bill.total_amount || 0,
          estimated_overcharge: estimatedOvercharge,
          months_since_actual_reading: consecutiveEstimated,
          recommendation: this.getRecommendation(consecutiveEstimated)
        });
      } else {
        // Reset counter on actual reading
        consecutiveEstimated = 0;
        lastActualReading = bill;
      }
    }
    
    return {
      total_bills: bills.length,
      estimated_bills: estimatedBills.length,
      estimated_percentage: estimatedPercentage,
      potential_overcharge: totalPotentialOvercharge,
      findings
    };
  }
  
  /**
   * Get recommendation based on consecutive estimated bills
   */
  private getRecommendation(consecutiveMonths: number): string {
    if (consecutiveMonths >= 6) {
      return 'URGENT: 6+ months of estimated bills. Demand actual meter reading and reconciliation immediately.';
    } else if (consecutiveMonths >= 3) {
      return 'HIGH PRIORITY: Request actual meter reading. Supplier must provide within 10 working days.';
    } else if (consecutiveMonths >= 2) {
      return 'MODERATE: Monitor closely. Request actual reading if continues.';
    } else {
      return 'LOW: Single estimated bill. Monitor next billing cycle.';
    }
  }
  
  /**
   * Calculate true-up adjustment when actual reading is taken
   */
  calculateTrueUpAdjustment(
    estimatedBills: BillData[],
    actualBill: BillData
  ): {
    total_estimated_cost: number;
    actual_cost: number;
    adjustment_required: number;
    customer_owes: boolean;
  } {
    const totalEstimatedCost = estimatedBills.reduce(
      (sum, bill) => sum + (bill.total_amount || 0),
      0
    );
    
    const actualCost = actualBill.total_amount || 0;
    const adjustment = actualCost - totalEstimatedCost;
    
    return {
      total_estimated_cost: totalEstimatedCost,
      actual_cost: actualCost,
      adjustment_required: Math.abs(adjustment),
      customer_owes: adjustment > 0
    };
  }
  
  /**
   * Validate if supplier issued credit correctly
   */
  validateCreditIssued(
    adjustmentRequired: number,
    creditAmount: number
  ): {
    correct: boolean;
    discrepancy: number;
  } {
    const discrepancy = Math.abs(adjustmentRequired - creditAmount);
    const correct = discrepancy < 1; // Allow €1 rounding
    
    return {
      correct,
      discrepancy
    };
  }
}

export default EstimatedBillingDetector;
