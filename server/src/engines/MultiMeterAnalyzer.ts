/**
 * Multi-Meter Analyzer Engine
 * Analyzes facilities with multiple meters (hotels, retail chains, hospitals)
 * 
 * Large facilities often have multiple meters for:
 * - Different buildings or wings
 * - Separate HVAC systems
 * - Dedicated equipment (kitchens, laundry, data centers)
 * - Tenant sub-metering
 * 
 * This engine identifies:
 * - Meter allocation inefficiencies
 * - Cross-meter tariff inconsistencies
 * - Aggregation opportunities for volume discounts
 * - Load balancing opportunities
 * 
 * @module MultiMeterAnalyzer
 * @category AI Engines
 */

export interface MeterData {
  meterId: string;
  meterNumber: string;
  location: string;
  meterType: 'main' | 'sub' | 'dedicated';
  supplier: string;
  tariffType: string;
  tariffRate: number;
  standingCharge: number;
  monthlyConsumption: number;
  monthlyCharge: number;
  contractEndDate?: Date;
}

export interface AggregationOpportunity {
  type: 'volume_discount' | 'consolidated_tariff' | 'single_supplier' | 'demand_aggregation';
  description: string;
  affectedMeters: string[];
  currentTotalCost: number;
  projectedCost: number;
  annualSavings: number;
  complexity: 'low' | 'medium' | 'high';
  implementation: string[];
  confidence: number;
}

export interface TariffInconsistency {
  meterId1: string;
  meterId2: string;
  location1: string;
  location2: string;
  supplier1: string;
  supplier2: string;
  rate1: number;
  rate2: number;
  rateDifference: number;
  potentialSavings: number;
}

export interface MultiMeterAnalysisResult {
  totalMeters: number;
  totalConsumption: number;
  totalCost: number;
  annualizedCost: number;
  averageRatePerKwh: number;
  suppliers: string[];
  tariffTypes: string[];
  inconsistencies: TariffInconsistency[];
  aggregationOpportunities: AggregationOpportunity[];
  totalPotentialSavings: number;
  recommendations: string[];
  confidence: number;
}

export class MultiMeterAnalyzer {
  private readonly volumeDiscounts = [
    { threshold: 500000, discount: 0.02 },
    { threshold: 1000000, discount: 0.04 },
    { threshold: 2000000, discount: 0.06 },
    { threshold: 5000000, discount: 0.08 },
  ];

  async analyzeMultiMeterFacility(meters: MeterData[]): Promise<MultiMeterAnalysisResult> {
    console.log(`🔍 Analyzing facility with ${meters.length} meters...`);

    if (meters.length === 0) {
      return this.emptyResult();
    }

    const totalConsumption = meters.reduce((sum, m) => sum + m.monthlyConsumption, 0);
    const totalCost = meters.reduce((sum, m) => sum + m.monthlyCharge, 0);
    const annualizedCost = totalCost * 12;
    const averageRatePerKwh = totalConsumption > 0 ? totalCost / totalConsumption : 0;

    const suppliers = [...new Set(meters.map(m => m.supplier))];
    const tariffTypes = [...new Set(meters.map(m => m.tariffType))];

    const inconsistencies = this.findTariffInconsistencies(meters);
    const aggregationOpportunities = this.identifyAggregationOpportunities(meters, totalConsumption);
    const totalPotentialSavings = aggregationOpportunities.reduce((sum, opp) => sum + opp.annualSavings, 0);

    const recommendations = this.generateRecommendations(meters, inconsistencies, aggregationOpportunities, suppliers);
    const confidence = this.calculateConfidence(meters, inconsistencies.length);

    return {
      totalMeters: meters.length,
      totalConsumption,
      totalCost,
      annualizedCost,
      averageRatePerKwh: Math.round(averageRatePerKwh * 10000) / 10000,
      suppliers,
      tariffTypes,
      inconsistencies,
      aggregationOpportunities,
      totalPotentialSavings: Math.round(totalPotentialSavings * 100) / 100,
      recommendations,
      confidence,
    };
  }

  private findTariffInconsistencies(meters: MeterData[]): TariffInconsistency[] {
    const inconsistencies: TariffInconsistency[] = [];

    for (let i = 0; i < meters.length; i++) {
      for (let j = i + 1; j < meters.length; j++) {
        const meter1 = meters[i];
        const meter2 = meters[j];

        const consumptionRatio = Math.max(meter1.monthlyConsumption, meter2.monthlyConsumption) /
                                  Math.min(meter1.monthlyConsumption, meter2.monthlyConsumption);

        if (consumptionRatio > 2) continue;

        const rateDifference = Math.abs((meter1.tariffRate - meter2.tariffRate) / meter1.tariffRate) * 100;

        if (rateDifference > 5) {
          const higherRate = Math.max(meter1.tariffRate, meter2.tariffRate);
          const lowerRate = Math.min(meter1.tariffRate, meter2.tariffRate);
          const higherConsumption = meter1.tariffRate > meter2.tariffRate 
            ? meter1.monthlyConsumption 
            : meter2.monthlyConsumption;

          const potentialSavings = (higherRate - lowerRate) * higherConsumption * 12;

          if (potentialSavings > 100) {
            inconsistencies.push({
              meterId1: meter1.meterId,
              meterId2: meter2.meterId,
              location1: meter1.location,
              location2: meter2.location,
              supplier1: meter1.supplier,
              supplier2: meter2.supplier,
              rate1: meter1.tariffRate,
              rate2: meter2.tariffRate,
              rateDifference,
              potentialSavings: Math.round(potentialSavings * 100) / 100,
            });
          }
        }
      }
    }

    return inconsistencies.sort((a, b) => b.potentialSavings - a.potentialSavings);
  }

  private identifyAggregationOpportunities(meters: MeterData[], totalConsumption: number): AggregationOpportunity[] {
    const opportunities: AggregationOpportunity[] = [];

    const annualConsumption = totalConsumption * 12;
    const volumeDiscount = this.getVolumeDiscount(annualConsumption);
    
    if (volumeDiscount > 0) {
      const currentTotalCost = meters.reduce((sum, m) => sum + m.monthlyCharge, 0) * 12;
      const projectedCost = currentTotalCost * (1 - volumeDiscount);
      const annualSavings = currentTotalCost - projectedCost;

      opportunities.push({
        type: 'volume_discount',
        description: `Aggregate ${meters.length} meters for ${volumeDiscount * 100}% volume discount`,
        affectedMeters: meters.map(m => m.meterId),
        currentTotalCost,
        projectedCost,
        annualSavings: Math.round(annualSavings * 100) / 100,
        complexity: meters.length > 10 ? 'high' : 'medium',
        implementation: [
          'Contact energy broker to negotiate aggregated contract',
          'Consolidate all meters under single account',
          'Request portfolio pricing',
        ],
        confidence: 0.85,
      });
    }

    const suppliers = [...new Set(meters.map(m => m.supplier))];
    if (suppliers.length > 1) {
      const currentTotalCost = meters.reduce((sum, m) => sum + m.monthlyCharge, 0) * 12;
      const estimatedSavings = currentTotalCost * 0.05;

      if (estimatedSavings > 500) {
        opportunities.push({
          type: 'single_supplier',
          description: `Consolidate all ${meters.length} meters with single supplier`,
          affectedMeters: meters.map(m => m.meterId),
          currentTotalCost,
          projectedCost: currentTotalCost - estimatedSavings,
          annualSavings: Math.round(estimatedSavings * 100) / 100,
          complexity: 'medium',
          implementation: [
            'Negotiate with supplier for multi-meter portfolio pricing',
            'Align contract end dates',
            'Request 5-10% loyalty discount',
          ],
          confidence: 0.75,
        });
      }
    }

    return opportunities.sort((a, b) => b.annualSavings - a.annualSavings);
  }

  private getVolumeDiscount(annualKwh: number): number {
    for (let i = this.volumeDiscounts.length - 1; i >= 0; i--) {
      const tier = this.volumeDiscounts[i];
      if (annualKwh >= tier.threshold) {
        return tier.discount;
      }
    }
    return 0;
  }

  private generateRecommendations(
    meters: MeterData[],
    inconsistencies: TariffInconsistency[],
    opportunities: AggregationOpportunity[],
    suppliers: string[]
  ): string[] {
    const recommendations: string[] = [];

    if (meters.length === 1) {
      recommendations.push('✅ Single meter facility - no multi-meter optimization needed');
      return recommendations;
    }

    if (inconsistencies.length > 0) {
      const top3 = inconsistencies.slice(0, 3);
      top3.forEach((inc, index) => {
        recommendations.push(
          `Priority ${index + 1}: Align meter ${inc.meterId1} with meter ${inc.meterId2} tariff - saves €${inc.potentialSavings.toLocaleString()}/year`
        );
      });
    }

    if (opportunities.length > 0) {
      opportunities.slice(0, 2).forEach(opp => {
        recommendations.push(
          `🔗 ${opp.description} - saves €${opp.annualSavings.toLocaleString()}/year`
        );
      });
    }

    return recommendations;
  }

  private calculateConfidence(meters: MeterData[], inconsistencyCount: number): number {
    let confidence = 0.70;
    if (meters.length >= 5) confidence += 0.10;
    if (meters.length >= 10) confidence += 0.05;
    if (inconsistencyCount > 0) confidence += 0.10;
    return Math.min(confidence, 0.95);
  }

  private emptyResult(): MultiMeterAnalysisResult {
    return {
      totalMeters: 0,
      totalConsumption: 0,
      totalCost: 0,
      annualizedCost: 0,
      averageRatePerKwh: 0,
      suppliers: [],
      tariffTypes: [],
      inconsistencies: [],
      aggregationOpportunities: [],
      totalPotentialSavings: 0,
      recommendations: ['No meter data available'],
      confidence: 0,
    };
  }

  generateReport(result: MultiMeterAnalysisResult, facilityName: string): string {
    let report = `\n═══════════════════════════════════════════════════════════\n`;
    report += `  MULTI-METER ANALYSIS REPORT\n`;
    report += `  Facility: ${facilityName}\n`;
    report += `═══════════════════════════════════════════════════════════\n\n`;
    report += `Total Meters: ${result.totalMeters}\n`;
    report += `Annual Cost: €${result.annualizedCost.toLocaleString()}\n`;
    report += `Total Potential Savings: €${result.totalPotentialSavings.toLocaleString()}/year\n\n`;
    report += `RECOMMENDATIONS:\n`;
    result.recommendations.forEach((rec, i) => report += `${i + 1}. ${rec}\n`);
    return report;
  }
}

export const multiMeterAnalyzer = new MultiMeterAnalyzer();
