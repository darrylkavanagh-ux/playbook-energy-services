/**
 * CCL Exemption Checker Engine
 * Validates Climate Change Levy (CCL) exemptions for eligible facilities
 * 
 * Irish energy bills may include CCL charges that certain facilities are exempt from:
 * - Healthcare facilities (nursing homes, hospitals)
 * - Educational institutions
 * - Charitable organizations
 * - Facilities with CHP (Combined Heat & Power) systems
 * - Renewable energy users
 * 
 * @module CCLExemptionChecker
 * @category AI Engines
 */

export interface CCLExemption {
  exemptionType: 'healthcare' | 'education' | 'charity' | 'chp' | 'renewable' | 'other';
  description: string;
  eligibilityCriteria: string[];
  potentialSavings: number; // € per year
  documentationRequired: string[];
}

export interface CCLAuditResult {
  isEligible: boolean;
  currentCCLCharges: number; // € per year
  exemptions: CCLExemption[];
  potentialRecovery: number; // € (historical overcharges)
  annualSavings: number; // € per year going forward
  confidence: number; // 0-1
  recommendations: string[];
  evidenceRequired: string[];
  claimProcess: {
    step: number;
    action: string;
    deadline?: string;
  }[];
}

export interface FacilityData {
  type: 'nursing_home' | 'hospital' | 'school' | 'university' | 'charity' | 'commercial' | 'other';
  registrationNumber?: string; // HIQA, CRU, Charity number
  hasChp: boolean;
  renewablePercentage: number; // % of energy from renewables
  certifications: string[]; // e.g., 'ISO50001', 'HIQA_REGISTERED'
  annualEnergySpend: number; // €
}

export interface BillCCLData {
  billDate: Date;
  cclCharge: number; // €
  totalKwh: number;
  cclRate: number; // € per kWh
  hasExemptionApplied: boolean;
}

/**
 * Climate Change Levy Exemption Checker
 * Identifies CCL exemption eligibility and calculates potential savings
 */
export class CCLExemptionChecker {
  /**
   * CCL rates (€ per kWh) - updated annually
   */
  private readonly cclRates = {
    electricity: 0.00775, // €/kWh
    gas: 0.00406, // €/kWh
    lpg: 0.02175, // €/kWh
  };

  /**
   * Check CCL exemption eligibility and calculate savings
   */
  async checkExemptions(
    facility: FacilityData,
    bills: BillCCLData[],
    historicalMonths: number = 72 // 6 years default
  ): Promise<CCLAuditResult> {
    console.log(`🔍 Checking CCL exemptions for ${facility.type} facility...`);

    const exemptions = this.identifyEligibleExemptions(facility);
    const currentCharges = this.calculateCurrentCCLCharges(bills);
    const potentialRecovery = this.calculateHistoricalRecovery(bills, historicalMonths);
    const annualSavings = this.calculateAnnualSavings(facility, currentCharges);

    const recommendations = this.generateRecommendations(exemptions, facility);
    const evidenceRequired = this.getRequiredEvidence(exemptions);
    const claimProcess = this.generateClaimProcess(exemptions);

    const isEligible = exemptions.length > 0;
    const confidence = this.calculateConfidence(facility, exemptions);

    return {
      isEligible,
      currentCCLCharges: currentCharges,
      exemptions,
      potentialRecovery,
      annualSavings,
      confidence,
      recommendations,
      evidenceRequired,
      claimProcess,
    };
  }

  /**
   * Identify eligible CCL exemptions based on facility characteristics
   */
  private identifyEligibleExemptions(facility: FacilityData): CCLExemption[] {
    const exemptions: CCLExemption[] = [];

    // Healthcare exemption
    if (facility.type === 'nursing_home' || facility.type === 'hospital') {
      exemptions.push({
        exemptionType: 'healthcare',
        description: 'Healthcare facilities are exempt from CCL on energy used for medical purposes',
        eligibilityCriteria: [
          'Registered with HIQA (Health Information and Quality Authority)',
          'Energy used primarily for patient care',
          'Valid healthcare facility registration',
        ],
        potentialSavings: facility.annualEnergySpend * 0.015, // ~1.5% of energy spend
        documentationRequired: [
          'HIQA registration certificate',
          'Facility license',
          'Energy consumption breakdown (medical vs. non-medical)',
        ],
      });
    }

    // Education exemption
    if (facility.type === 'school' || facility.type === 'university') {
      exemptions.push({
        exemptionType: 'education',
        description: 'Educational institutions are exempt from CCL',
        eligibilityCriteria: [
          'Registered educational institution',
          'Non-profit or state-funded',
          'Primary use is education',
        ],
        potentialSavings: facility.annualEnergySpend * 0.018, // ~1.8% of energy spend
        documentationRequired: [
          'Department of Education registration',
          'Charity or non-profit status',
          'Latest audited accounts',
        ],
      });
    }

    // Charity exemption
    if (facility.type === 'charity') {
      exemptions.push({
        exemptionType: 'charity',
        description: 'Registered charities are exempt from CCL',
        eligibilityCriteria: [
          'Registered with Irish Charities Regulator',
          'Non-profit status',
          'CHY number or RCN number',
        ],
        potentialSavings: facility.annualEnergySpend * 0.016, // ~1.6% of energy spend
        documentationRequired: [
          'Charity registration certificate (CHY/RCN)',
          'Constitution or trust deed',
          'Latest annual report',
        ],
      });
    }

    // CHP (Combined Heat and Power) exemption
    if (facility.hasChp) {
      exemptions.push({
        exemptionType: 'chp',
        description: 'Energy generated by qualifying CHP systems is exempt from CCL',
        eligibilityCriteria: [
          'CHP system meets efficiency standards (>20% electricity, >70% total efficiency)',
          'System registered with CRU',
          'Separate metering for CHP-generated energy',
        ],
        potentialSavings: facility.annualEnergySpend * 0.30 * 0.015, // 30% of energy × CCL rate
        documentationRequired: [
          'CHP system specification and efficiency certificate',
          'CRU registration',
          'Separate meter readings for CHP output',
        ],
      });
    }

    // Renewable energy exemption
    if (facility.renewablePercentage >= 10) {
      const savingsPercentage = facility.renewablePercentage / 100;
      exemptions.push({
        exemptionType: 'renewable',
        description: 'Energy from renewable sources is exempt from CCL',
        eligibilityCriteria: [
          'Renewable energy certificates (REGOs)',
          'On-site generation or Power Purchase Agreement (PPA)',
          'Percentage of renewable energy > 10%',
        ],
        potentialSavings: facility.annualEnergySpend * savingsPercentage * 0.015,
        documentationRequired: [
          'Renewable Energy Guarantee of Origin (REGO) certificates',
          'PPA or on-site generation documentation',
          'Annual renewable energy report',
        ],
      });
    }

    return exemptions;
  }

  /**
   * Calculate total current CCL charges from bills
   */
  private calculateCurrentCCLCharges(bills: BillCCLData[]): number {
    if (bills.length === 0) return 0;

    const totalCCL = bills.reduce((sum, bill) => sum + bill.cclCharge, 0);
    
    // Annualize if we have less than 12 months of data
    const monthsCovered = bills.length;
    const annualizedCCL = monthsCovered < 12 
      ? (totalCCL / monthsCovered) * 12 
      : totalCCL;

    return Math.round(annualizedCCL * 100) / 100;
  }

  /**
   * Calculate historical CCL overcharges that can be recovered
   */
  private calculateHistoricalRecovery(bills: BillCCLData[], historicalMonths: number): number {
    if (bills.length === 0) return 0;

    // Only count bills where exemption was NOT applied
    const overchargedBills = bills.filter(bill => !bill.hasExemptionApplied);
    const totalOvercharged = overchargedBills.reduce((sum, bill) => sum + bill.cclCharge, 0);

    // Extrapolate to full historical period
    const monthsCovered = bills.length;
    const recoveryPeriod = Math.min(historicalMonths, 72); // Max 6 years recovery
    
    const estimatedRecovery = monthsCovered > 0
      ? (totalOvercharged / monthsCovered) * recoveryPeriod
      : 0;

    return Math.round(estimatedRecovery * 100) / 100;
  }

  /**
   * Calculate annual savings going forward
   */
  private calculateAnnualSavings(facility: FacilityData, currentCharges: number): number {
    // Annual savings = current CCL charges (which would be eliminated)
    return Math.round(currentCharges * 100) / 100;
  }

  /**
   * Calculate confidence score for exemption eligibility
   */
  private calculateConfidence(facility: FacilityData, exemptions: CCLExemption[]): number {
    if (exemptions.length === 0) return 0;

    let confidence = 0.5; // Base confidence

    // Increase confidence based on facility characteristics
    if (facility.registrationNumber) {
      confidence += 0.2; // Has official registration
    }

    if (facility.certifications.length > 0) {
      confidence += 0.1; // Has certifications
    }

    // Higher confidence for well-established exemptions
    const hasHealthcare = exemptions.some(e => e.exemptionType === 'healthcare');
    const hasEducation = exemptions.some(e => e.exemptionType === 'education');
    
    if (hasHealthcare || hasEducation) {
      confidence += 0.15; // Well-established exemption categories
    }

    return Math.min(confidence, 0.95); // Cap at 95%
  }

  /**
   * Generate recommendations for claiming exemptions
   */
  private generateRecommendations(exemptions: CCLExemption[], facility: FacilityData): string[] {
    const recommendations: string[] = [];

    if (exemptions.length === 0) {
      recommendations.push('No CCL exemptions identified for this facility type');
      recommendations.push('Consider renewable energy investment to qualify for future exemptions');
      return recommendations;
    }

    // Sort by potential savings (highest first)
    const sortedExemptions = [...exemptions].sort((a, b) => b.potentialSavings - a.potentialSavings);

    sortedExemptions.forEach((exemption, index) => {
      recommendations.push(
        `Priority ${index + 1}: Apply for ${exemption.exemptionType} exemption (potential €${exemption.potentialSavings.toLocaleString()}/year savings)`
      );
    });

    recommendations.push('Gather all required documentation before submitting exemption applications');
    recommendations.push('File historical recovery claim for past 6 years of overcharges');
    recommendations.push('Set up separate metering for exempt energy usage to simplify future audits');

    if (!facility.hasChp && facility.annualEnergySpend > 50000) {
      recommendations.push('Consider CHP installation - payback period typically 5-8 years with CCL savings');
    }

    if (facility.renewablePercentage < 20) {
      recommendations.push('Increase renewable energy percentage to maximize CCL exemptions');
    }

    return recommendations;
  }

  /**
   * Get list of required evidence documents
   */
  private getRequiredEvidence(exemptions: CCLExemption[]): string[] {
    const allDocs = new Set<string>();

    exemptions.forEach(exemption => {
      exemption.documentationRequired.forEach(doc => allDocs.add(doc));
    });

    // Add universal requirements
    allDocs.add('Last 72 months of energy bills');
    allDocs.add('Facility ownership or lease documentation');
    allDocs.add('Energy supplier account details');

    return Array.from(allDocs).sort();
  }

  /**
   * Generate step-by-step claim process
   */
  private generateClaimProcess(exemptions: CCLExemption[]): { step: number; action: string; deadline?: string }[] {
    const process: { step: number; action: string; deadline?: string }[] = [];

    if (exemptions.length === 0) {
      return [
        { step: 1, action: 'No exemptions available - monitor for eligibility changes' },
      ];
    }

    process.push({
      step: 1,
      action: 'Gather all required documentation (see evidence list)',
      deadline: 'Within 2 weeks',
    });

    process.push({
      step: 2,
      action: 'Register facility exemptions with energy supplier(s)',
      deadline: 'Within 4 weeks',
    });

    process.push({
      step: 3,
      action: 'Submit CCL exemption certificate to supplier(s)',
      deadline: 'Within 6 weeks',
    });

    process.push({
      step: 4,
      action: 'File historical recovery claim with energy supplier(s)',
      deadline: 'Within 8 weeks',
    });

    process.push({
      step: 5,
      action: 'Request confirmation of exemption application to future bills',
      deadline: 'Within 10 weeks',
    });

    process.push({
      step: 6,
      action: 'Monitor next 3 bills to verify CCL charges are removed',
      deadline: 'Months 3-6',
    });

    process.push({
      step: 7,
      action: 'Process recovery payment (typically 8-12 weeks after claim)',
      deadline: 'Months 4-6',
    });

    return process;
  }

  /**
   * Batch check multiple facilities
   */
  async batchCheckExemptions(
    facilities: { facility: FacilityData; bills: BillCCLData[] }[]
  ): Promise<Map<string, CCLAuditResult>> {
    const results = new Map<string, CCLAuditResult>();

    for (const { facility, bills } of facilities) {
      const facilityKey = facility.registrationNumber || `${facility.type}_${Date.now()}`;
      const result = await this.checkExemptions(facility, bills);
      results.set(facilityKey, result);
    }

    return results;
  }

  /**
   * Generate CCL exemption report
   */
  generateReport(result: CCLAuditResult, facilityName: string): string {
    let report = `\n═══════════════════════════════════════════════════════════\n`;
    report += `  CCL EXEMPTION AUDIT REPORT\n`;
    report += `  Facility: ${facilityName}\n`;
    report += `  Generated: ${new Date().toLocaleDateString('en-IE')}\n`;
    report += `═══════════════════════════════════════════════════════════\n\n`;

    report += `EXEMPTION ELIGIBILITY: ${result.isEligible ? '✅ ELIGIBLE' : '❌ NOT ELIGIBLE'}\n`;
    report += `Confidence Level: ${(result.confidence * 100).toFixed(1)}%\n\n`;

    if (result.isEligible) {
      report += `FINANCIAL SUMMARY:\n`;
      report += `─────────────────────────────────────────────────────────\n`;
      report += `Current Annual CCL Charges:    €${result.currentCCLCharges.toLocaleString('en-IE', { minimumFractionDigits: 2 })}\n`;
      report += `Potential Historical Recovery: €${result.potentialRecovery.toLocaleString('en-IE', { minimumFractionDigits: 2 })}\n`;
      report += `Annual Savings (Going Forward): €${result.annualSavings.toLocaleString('en-IE', { minimumFractionDigits: 2 })}\n`;
      report += `Total Benefit (Year 1):        €${(result.potentialRecovery + result.annualSavings).toLocaleString('en-IE', { minimumFractionDigits: 2 })}\n\n`;

      report += `ELIGIBLE EXEMPTIONS (${result.exemptions.length}):\n`;
      report += `─────────────────────────────────────────────────────────\n`;
      result.exemptions.forEach((exemption, index) => {
        report += `\n${index + 1}. ${exemption.exemptionType.toUpperCase()} EXEMPTION\n`;
        report += `   ${exemption.description}\n`;
        report += `   Potential Savings: €${exemption.potentialSavings.toLocaleString('en-IE', { minimumFractionDigits: 2 })}/year\n`;
      });

      report += `\n\nRECOMMENDATIONS:\n`;
      report += `─────────────────────────────────────────────────────────\n`;
      result.recommendations.forEach((rec, index) => {
        report += `${index + 1}. ${rec}\n`;
      });

      report += `\n\nREQUIRED EVIDENCE:\n`;
      report += `─────────────────────────────────────────────────────────\n`;
      result.evidenceRequired.forEach((doc, index) => {
        report += `☐ ${doc}\n`;
      });

      report += `\n\nCLAIM PROCESS:\n`;
      report += `─────────────────────────────────────────────────────────\n`;
      result.claimProcess.forEach(step => {
        const deadline = step.deadline ? ` (Deadline: ${step.deadline})` : '';
        report += `Step ${step.step}: ${step.action}${deadline}\n`;
      });
    } else {
      report += `\nNo CCL exemptions identified for this facility.\n`;
      report += `\nRECOMMENDATIONS:\n`;
      report += `─────────────────────────────────────────────────────────\n`;
      result.recommendations.forEach((rec, index) => {
        report += `${index + 1}. ${rec}\n`;
      });
    }

    report += `\n═══════════════════════════════════════════════════════════\n`;
    report += `Report generated by FOXLITE Energy Services - CCL Exemption Engine\n`;
    report += `═══════════════════════════════════════════════════════════\n`;

    return report;
  }
}

// Export singleton instance
export const cclExemptionChecker = new CCLExemptionChecker();
