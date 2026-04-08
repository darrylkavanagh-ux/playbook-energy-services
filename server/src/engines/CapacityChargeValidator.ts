/**
 * Capacity Charge Validator Engine
 * Validates capacity/demand charges on energy bills
 * 
 * Capacity charges (also called demand charges or maximum demand charges) are based on
 * the highest rate of electricity usage (kW) during a billing period, not total consumption (kWh).
 * Common errors include:
 * - Incorrect capacity tier classification
 * - Outdated maximum demand values
 * - Charges applied when facility doesn't have capacity tariff
 * - Incorrect $/kW rate
 * - Failure to credit power factor improvements
 * 
 * @module CapacityChargeValidator
 * @category AI Engines
 */

export interface CapacityCharge {
  month: string;
  capacityKw: number; // Maximum demand in kW
  chargeRate: number; // € per kW
  totalCharge: number; // €
  powerFactor: number; // 0-1 (e.g., 0.95)
  tier: 'small' | 'medium' | 'large' | 'industrial';
}

export interface ExpectedCapacity {
  tier: 'small' | 'medium' | 'large' | 'industrial';
  expectedRate: number; // € per kW
  expectedMaxDemand: number; // kW
  confidence: number; // 0-1
}

export interface CapacityError {
  type: 'incorrect_rate' | 'wrong_tier' | 'outdated_demand' | 'unauthorized_charge' | 'power_factor_penalty' | 'meter_fault';
  description: string;
  billMonth: string;
  billedAmount: number; // €
  correctAmount: number; // €
  overcharge: number; // €
  evidence: string[];
  confidence: number; // 0-1
}

export interface CapacityValidationResult {
  hasErrors: boolean;
  totalOvercharge: number; // €
  annualizedOvercharge: number; // €
  errors: CapacityError[];
  currentTier: 'small' | 'medium' | 'large' | 'industrial';
  recommendedTier: 'small' | 'medium' | 'large' | 'industrial';
  averagePowerFactor: number;
  recommendations: string[];
  confidence: number;
}

export interface FacilityProfile {
  facilityType: string;
  squareMeters: number;
  operatingHours: { weekday: number; weekend: number };
  hasHvac: boolean;
  hasIndustrialEquipment: boolean;
  hasKitchen: boolean;
  occupancy: number; // Number of people
}

/**
 * Capacity Charge Validator
 * Validates capacity/demand charges and identifies overcharges
 */
export class CapacityChargeValidator {
  /**
   * Standard capacity charge rates by tier (€ per kW per month)
   * Rates are typical for Irish commercial energy market
   */
  private readonly capacityRates = {
    small: {
      threshold: 50, // kW
      rate: 4.50, // € per kW
      description: 'Small commercial (< 50kW)',
    },
    medium: {
      threshold: 200, // kW
      rate: 3.80, // € per kW
      description: 'Medium commercial (50-200kW)',
    },
    large: {
      threshold: 500, // kW
      rate: 3.20, // € per kW
      description: 'Large commercial (200-500kW)',
    },
    industrial: {
      threshold: Infinity,
      rate: 2.70, // € per kW
      description: 'Industrial (> 500kW)',
    },
  };

  /**
   * Power factor penalty thresholds
   * Most suppliers charge penalties if power factor < 0.95
   */
  private readonly powerFactorThreshold = 0.95;
  private readonly powerFactorPenalty = 0.10; // 10% penalty per 0.01 below threshold

  /**
   * Validate capacity charges across multiple bills
   */
  async validateCapacityCharges(
    charges: CapacityCharge[],
    facilityProfile: FacilityProfile
  ): Promise<CapacityValidationResult> {
    console.log(`🔍 Validating capacity charges for ${facilityProfile.facilityType}...`);

    if (charges.length === 0) {
      return this.emptyResult();
    }

    const errors: CapacityError[] = [];
    const expectedCapacity = this.determineExpectedCapacity(facilityProfile, charges);

    // Check each bill for errors
    for (const charge of charges) {
      const billErrors = await this.validateSingleCharge(charge, expectedCapacity, facilityProfile);
      errors.push(...billErrors);
    }

    const totalOvercharge = errors.reduce((sum, error) => sum + error.overcharge, 0);
    const monthsCovered = charges.length;
    const annualizedOvercharge = monthsCovered > 0 ? (totalOvercharge / monthsCovered) * 12 : 0;

    const currentTier = this.determineCurrentTier(charges);
    const recommendedTier = expectedCapacity.tier;
    const averagePowerFactor = this.calculateAveragePowerFactor(charges);

    const recommendations = this.generateRecommendations(
      errors,
      currentTier,
      recommendedTier,
      averagePowerFactor,
      facilityProfile
    );

    const confidence = this.calculateConfidence(charges, errors, facilityProfile);

    return {
      hasErrors: errors.length > 0,
      totalOvercharge: Math.round(totalOvercharge * 100) / 100,
      annualizedOvercharge: Math.round(annualizedOvercharge * 100) / 100,
      errors,
      currentTier,
      recommendedTier,
      averagePowerFactor,
      recommendations,
      confidence,
    };
  }

  /**
   * Validate a single capacity charge
   */
  private async validateSingleCharge(
    charge: CapacityCharge,
    expected: ExpectedCapacity,
    facility: FacilityProfile
  ): Promise<CapacityError[]> {
    const errors: CapacityError[] = [];

    // Check 1: Incorrect capacity rate
    const expectedRateForTier = this.capacityRates[charge.tier].rate;
    if (Math.abs(charge.chargeRate - expectedRateForTier) > 0.10) {
      const correctAmount = charge.capacityKw * expectedRateForTier;
      const billedAmount = charge.totalCharge;
      const overcharge = billedAmount - correctAmount;

      if (overcharge > 0.01) {
        errors.push({
          type: 'incorrect_rate',
          description: `Capacity rate ${charge.chargeRate.toFixed(2)} €/kW exceeds standard rate ${expectedRateForTier.toFixed(2)} €/kW for ${charge.tier} tier`,
          billMonth: charge.month,
          billedAmount,
          correctAmount,
          overcharge,
          evidence: [
            `Billed rate: €${charge.chargeRate.toFixed(2)}/kW`,
            `Standard rate for ${charge.tier} tier: €${expectedRateForTier.toFixed(2)}/kW`,
            `Capacity: ${charge.capacityKw} kW`,
          ],
          confidence: 0.85,
        });
      }
    }

    // Check 2: Wrong tier classification
    const correctTier = this.determineTierFromCapacity(charge.capacityKw);
    if (correctTier !== charge.tier) {
      const correctRate = this.capacityRates[correctTier].rate;
      const correctAmount = charge.capacityKw * correctRate;
      const billedAmount = charge.totalCharge;
      const overcharge = billedAmount - correctAmount;

      if (overcharge > 0.01) {
        errors.push({
          type: 'wrong_tier',
          description: `Facility charged at ${charge.tier} tier (€${charge.chargeRate}/kW) but should be ${correctTier} tier (€${correctRate}/kW) based on ${charge.capacityKw} kW demand`,
          billMonth: charge.month,
          billedAmount,
          correctAmount,
          overcharge,
          evidence: [
            `Billed tier: ${charge.tier}`,
            `Correct tier: ${correctTier}`,
            `Capacity: ${charge.capacityKw} kW`,
            `${correctTier} tier threshold: ${this.capacityRates[correctTier].threshold} kW`,
          ],
          confidence: 0.90,
        });
      }
    }

    // Check 3: Unrealistic capacity value (meter fault or estimation error)
    const expectedMaxDemand = expected.expectedMaxDemand;
    const deviation = Math.abs(charge.capacityKw - expectedMaxDemand) / expectedMaxDemand;
    
    if (deviation > 0.30) { // More than 30% deviation
      const correctAmount = expectedMaxDemand * charge.chargeRate;
      const billedAmount = charge.totalCharge;
      const overcharge = billedAmount - correctAmount;

      if (overcharge > 0.01) {
        errors.push({
          type: 'outdated_demand',
          description: `Billed capacity ${charge.capacityKw} kW is ${(deviation * 100).toFixed(0)}% higher than expected ${expectedMaxDemand.toFixed(0)} kW for facility type`,
          billMonth: charge.month,
          billedAmount,
          correctAmount,
          overcharge,
          evidence: [
            `Billed capacity: ${charge.capacityKw} kW`,
            `Expected capacity: ${expectedMaxDemand.toFixed(0)} kW`,
            `Facility type: ${facility.facilityType}`,
            `Deviation: ${(deviation * 100).toFixed(1)}%`,
          ],
          confidence: 0.70,
        });
      }
    }

    // Check 4: Power factor penalty
    if (charge.powerFactor < this.powerFactorThreshold) {
      const pfDeficit = this.powerFactorThreshold - charge.powerFactor;
      const penaltyPercent = pfDeficit * this.powerFactorPenalty;
      const penaltyAmount = charge.totalCharge * penaltyPercent;

      // This is NOT an overcharge by supplier, but an avoidable cost
      // We flag it as a recommendation opportunity
      if (penaltyAmount > 5) {
        errors.push({
          type: 'power_factor_penalty',
          description: `Low power factor ${charge.powerFactor.toFixed(3)} incurs ${(penaltyPercent * 100).toFixed(1)}% penalty (€${penaltyAmount.toFixed(2)}). Power factor correction equipment recommended.`,
          billMonth: charge.month,
          billedAmount: charge.totalCharge,
          correctAmount: charge.totalCharge - penaltyAmount,
          overcharge: penaltyAmount,
          evidence: [
            `Power factor: ${charge.powerFactor.toFixed(3)}`,
            `Target: ${this.powerFactorThreshold}`,
            `Penalty: €${penaltyAmount.toFixed(2)}`,
          ],
          confidence: 0.95,
        });
      }
    }

    return errors;
  }

  /**
   * Determine expected capacity based on facility profile
   */
  private determineExpectedCapacity(
    facility: FacilityProfile,
    historicalCharges: CapacityCharge[]
  ): ExpectedCapacity {
    // Base calculation on facility characteristics
    let expectedKw = 0;

    // Base load from square meters (typical: 25-40 W/m²)
    expectedKw += (facility.squareMeters * 0.035); // 35 W/m² average

    // HVAC load (if present)
    if (facility.hasHvac) {
      expectedKw += (facility.squareMeters * 0.020); // Additional 20 W/m²
    }

    // Kitchen equipment
    if (facility.hasKitchen) {
      expectedKw += 15; // Typical commercial kitchen base load
    }

    // Industrial equipment
    if (facility.hasIndustrialEquipment) {
      expectedKw += 50; // Conservative industrial load
    }

    // Occupancy factor
    expectedKw += (facility.occupancy * 0.15); // 150W per person

    // Apply diversity factor (not all loads peak simultaneously)
    const diversityFactor = 0.75;
    expectedKw *= diversityFactor;

    // Compare with historical data if available
    if (historicalCharges.length > 0) {
      const historicalAvg = historicalCharges.reduce((sum, c) => sum + c.capacityKw, 0) / historicalCharges.length;
      // Blend calculation with historical (60% historical, 40% calculated)
      expectedKw = (historicalAvg * 0.6) + (expectedKw * 0.4);
    }

    const tier = this.determineTierFromCapacity(expectedKw);
    const expectedRate = this.capacityRates[tier].rate;

    return {
      tier,
      expectedRate,
      expectedMaxDemand: Math.round(expectedKw * 10) / 10, // Round to 1 decimal
      confidence: historicalCharges.length >= 12 ? 0.85 : 0.65,
    };
  }

  /**
   * Determine capacity tier from kW value
   */
  private determineTierFromCapacity(capacityKw: number): 'small' | 'medium' | 'large' | 'industrial' {
    if (capacityKw < this.capacityRates.small.threshold) return 'small';
    if (capacityKw < this.capacityRates.medium.threshold) return 'medium';
    if (capacityKw < this.capacityRates.large.threshold) return 'large';
    return 'industrial';
  }

  /**
   * Determine current tier from charges
   */
  private determineCurrentTier(charges: CapacityCharge[]): 'small' | 'medium' | 'large' | 'industrial' {
    if (charges.length === 0) return 'small';
    
    // Use most recent charge's tier
    return charges[charges.length - 1].tier;
  }

  /**
   * Calculate average power factor
   */
  private calculateAveragePowerFactor(charges: CapacityCharge[]): number {
    if (charges.length === 0) return 1.0;
    
    const total = charges.reduce((sum, c) => sum + c.powerFactor, 0);
    return Math.round((total / charges.length) * 1000) / 1000; // Round to 3 decimals
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    errors: CapacityError[],
    currentTier: string,
    recommendedTier: string,
    avgPowerFactor: number,
    facility: FacilityProfile
  ): string[] {
    const recommendations: string[] = [];

    if (errors.length === 0) {
      recommendations.push('✅ No capacity charge errors detected');
      return recommendations;
    }

    // Tier recommendations
    if (currentTier !== recommendedTier) {
      recommendations.push(
        `🔄 Request reclassification from ${currentTier} to ${recommendedTier} tier to reduce capacity rate`
      );
    }

    // Power factor recommendations
    if (avgPowerFactor < this.powerFactorThreshold) {
      const pfErrors = errors.filter(e => e.type === 'power_factor_penalty');
      const annualPfCost = pfErrors.reduce((sum, e) => sum + e.overcharge, 0) * 12 / errors.length;
      
      recommendations.push(
        `⚡ Install power factor correction equipment (payback ~2-3 years, saves €${annualPfCost.toFixed(0)}/year)`
      );
    }

    // Meter accuracy
    const meterErrors = errors.filter(e => e.type === 'outdated_demand' || e.type === 'meter_fault');
    if (meterErrors.length > 0) {
      recommendations.push(
        `📊 Request meter accuracy test - detected ${meterErrors.length} anomalous capacity readings`
      );
    }

    // Rate errors
    const rateErrors = errors.filter(e => e.type === 'incorrect_rate');
    if (rateErrors.length > 0) {
      const totalRateOvercharge = rateErrors.reduce((sum, e) => sum + e.overcharge, 0);
      recommendations.push(
        `💰 Challenge capacity rate with supplier (overcharged €${totalRateOvercharge.toFixed(2)} due to incorrect rates)`
      );
    }

    // Load management
    if (facility.hasIndustrialEquipment) {
      recommendations.push(
        `🔧 Implement load shedding to reduce peak demand and lower capacity tier`
      );
    }

    // Historical recovery
    const totalOvercharge = errors.reduce((sum, e) => sum + e.overcharge, 0);
    if (totalOvercharge > 100) {
      recommendations.push(
        `📝 File claim for historical overcharges (€${totalOvercharge.toFixed(2)} identified in analyzed period)`
      );
    }

    return recommendations;
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(
    charges: CapacityCharge[],
    errors: CapacityError[],
    facility: FacilityProfile
  ): number {
    let confidence = 0.70; // Base confidence

    // More data = higher confidence
    if (charges.length >= 12) confidence += 0.10;
    if (charges.length >= 24) confidence += 0.05;

    // Consistent errors = higher confidence
    if (errors.length > 0) {
      const avgErrorConfidence = errors.reduce((sum, e) => sum + e.confidence, 0) / errors.length;
      confidence += (avgErrorConfidence - 0.70) * 0.5;
    }

    // Complete facility data = higher confidence
    if (facility.squareMeters > 0 && facility.occupancy > 0) {
      confidence += 0.05;
    }

    return Math.min(confidence, 0.95);
  }

  /**
   * Return empty result
   */
  private emptyResult(): CapacityValidationResult {
    return {
      hasErrors: false,
      totalOvercharge: 0,
      annualizedOvercharge: 0,
      errors: [],
      currentTier: 'small',
      recommendedTier: 'small',
      averagePowerFactor: 1.0,
      recommendations: ['No capacity charges to validate'],
      confidence: 0,
    };
  }

  /**
   * Generate validation report
   */
  generateReport(result: CapacityValidationResult, facilityName: string): string {
    let report = `\n═══════════════════════════════════════════════════════════\n`;
    report += `  CAPACITY CHARGE VALIDATION REPORT\n`;
    report += `  Facility: ${facilityName}\n`;
    report += `  Generated: ${new Date().toLocaleDateString('en-IE')}\n`;
    report += `═══════════════════════════════════════════════════════════\n\n`;

    report += `VALIDATION RESULT: ${result.hasErrors ? '⚠️  ERRORS FOUND' : '✅ NO ERRORS'}\n`;
    report += `Confidence Level: ${(result.confidence * 100).toFixed(1)}%\n\n`;

    if (result.hasErrors) {
      report += `FINANCIAL IMPACT:\n`;
      report += `─────────────────────────────────────────────────────────\n`;
      report += `Total Overcharge (Period):     €${result.totalOvercharge.toLocaleString('en-IE', { minimumFractionDigits: 2 })}\n`;
      report += `Annualized Overcharge:         €${result.annualizedOvercharge.toLocaleString('en-IE', { minimumFractionDigits: 2 })}\n\n`;

      report += `ERRORS DETECTED (${result.errors.length}):\n`;
      report += `─────────────────────────────────────────────────────────\n`;
      result.errors.forEach((error, index) => {
        report += `\n${index + 1}. ${error.type.toUpperCase().replace(/_/g, ' ')}\n`;
        report += `   Month: ${error.billMonth}\n`;
        report += `   ${error.description}\n`;
        report += `   Billed: €${error.billedAmount.toFixed(2)} | Correct: €${error.correctAmount.toFixed(2)} | Overcharge: €${error.overcharge.toFixed(2)}\n`;
        report += `   Confidence: ${(error.confidence * 100).toFixed(0)}%\n`;
      });
    }

    report += `\n\nCURRENT STATUS:\n`;
    report += `─────────────────────────────────────────────────────────\n`;
    report += `Current Tier: ${result.currentTier}\n`;
    report += `Recommended Tier: ${result.recommendedTier}\n`;
    report += `Average Power Factor: ${result.averagePowerFactor.toFixed(3)}\n`;

    report += `\n\nRECOMMENDATIONS:\n`;
    report += `─────────────────────────────────────────────────────────\n`;
    result.recommendations.forEach((rec, index) => {
      report += `${index + 1}. ${rec}\n`;
    });

    report += `\n═══════════════════════════════════════════════════════════\n`;
    report += `Report generated by CLIENT Energy Services - Capacity Charge Validator\n`;
    report += `═══════════════════════════════════════════════════════════\n`;

    return report;
  }
}

// Export singleton instance
export const capacityChargeValidator = new CapacityChargeValidator();
