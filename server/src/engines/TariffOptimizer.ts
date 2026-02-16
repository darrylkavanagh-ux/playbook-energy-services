/**
 * ENGINE 3: TARIFF OPTIMIZER
 * Finds optimal tariff based on usage patterns
 */

import { BillData } from './OCRExtractionEngine';

export interface TariffOption {
  supplier: string;
  tariff_name: string;
  tariff_type: string;
  estimated_annual_cost: number;
  unit_rate?: number;
  day_rate?: number;
  night_rate?: number;
  standing_charge_daily: number;
  contract_length_months?: number;
}

export interface UsagePattern {
  annual_consumption_kwh: number;
  day_percentage: number;
  night_percentage: number;
  peak_percentage: number;
  off_peak_percentage: number;
  profile_type: 'flat' | 'day_heavy' | 'night_heavy' | 'time_of_use';
  seasonal_variation: number;
}

export interface TariffComparison {
  current_supplier: string;
  current_tariff: string;
  current_annual_cost: number;
  optimal_tariff: TariffOption;
  annual_savings: number;
  percentage_savings: number;
  all_options: TariffOption[];
}

export class TariffOptimizer {
  
  private tariffDatabase: TariffOption[] = [];
  
  constructor(tariffDatabase?: TariffOption[]) {
    this.tariffDatabase = tariffDatabase || this.getDefaultTariffs();
  }
  
  /**
   * Analyze usage pattern from bills
   */
  analyzeUsagePattern(bills: BillData[]): UsagePattern {
    const totalConsumption = bills.reduce((sum, bill) => sum + (bill.total_kwh || 0), 0);
    const annualConsumption = (totalConsumption / bills.length) * 12;
    
    // Calculate day/night split
    let totalDayKwh = 0;
    let totalNightKwh = 0;
    let totalPeakKwh = 0;
    let totalOffPeakKwh = 0;
    
    bills.forEach(bill => {
      totalDayKwh += bill.day_kwh || 0;
      totalNightKwh += bill.night_kwh || 0;
      totalPeakKwh += bill.peak_kwh || 0;
      totalOffPeakKwh += bill.off_peak_kwh || 0;
    });
    
    const totalSplit = totalDayKwh + totalNightKwh;
    const dayPercentage = totalSplit > 0 ? totalDayKwh / totalSplit : 0.5;
    const nightPercentage = totalSplit > 0 ? totalNightKwh / totalSplit : 0.5;
    
    const totalPeakSplit = totalPeakKwh + totalOffPeakKwh;
    const peakPercentage = totalPeakSplit > 0 ? totalPeakKwh / totalPeakSplit : 0.5;
    const offPeakPercentage = totalPeakSplit > 0 ? totalOffPeakKwh / totalPeakSplit : 0.5;
    
    // Determine profile type
    let profileType: 'flat' | 'day_heavy' | 'night_heavy' | 'time_of_use' = 'flat';
    if (nightPercentage > 0.6) {
      profileType = 'night_heavy';
    } else if (dayPercentage > 0.6) {
      profileType = 'day_heavy';
    } else if (totalPeakSplit > totalSplit * 0.8) {
      profileType = 'time_of_use';
    }
    
    // Calculate seasonal variation
    const monthlyConsumption = bills.map(bill => bill.total_kwh || 0);
    const maxMonthly = Math.max(...monthlyConsumption);
    const minMonthly = Math.min(...monthlyConsumption.filter(c => c > 0));
    const seasonalVariation = maxMonthly / (minMonthly || 1);
    
    return {
      annual_consumption_kwh: annualConsumption,
      day_percentage: dayPercentage,
      night_percentage: nightPercentage,
      peak_percentage: peakPercentage,
      off_peak_percentage: offPeakPercentage,
      profile_type: profileType,
      seasonal_variation: seasonalVariation
    };
  }
  
  /**
   * Find optimal tariff for usage pattern
   */
  findOptimalTariff(usagePattern: UsagePattern, currentBills: BillData[]): TariffComparison {
    const currentAnnualCost = currentBills.reduce((sum, bill) => sum + (bill.total_amount || 0), 0);
    const currentSupplier = currentBills[0]?.supplier_name || 'Unknown';
    const currentTariff = currentBills[0]?.tariff_name || 'Unknown';
    
    // Calculate estimated cost for each tariff
    const allOptions: TariffOption[] = this.tariffDatabase.map(tariff => ({
      ...tariff,
      estimated_annual_cost: this.calculateAnnualCost(usagePattern, tariff)
    }));
    
    // Sort by cost (cheapest first)
    allOptions.sort((a, b) => a.estimated_annual_cost - b.estimated_annual_cost);
    
    const optimalTariff = allOptions[0];
    const annualSavings = currentAnnualCost - optimalTariff.estimated_annual_cost;
    const percentageSavings = (annualSavings / currentAnnualCost) * 100;
    
    return {
      current_supplier: currentSupplier,
      current_tariff: currentTariff,
      current_annual_cost: currentAnnualCost,
      optimal_tariff: optimalTariff,
      annual_savings: annualSavings,
      percentage_savings: percentageSavings,
      all_options: allOptions.slice(0, 5) // Top 5 options
    };
  }
  
  /**
   * Calculate annual cost for a tariff given usage pattern
   */
  private calculateAnnualCost(usage: UsagePattern, tariff: TariffOption): number {
    let annualCost = 0;
    
    // Standing charge (daily × 365)
    annualCost += tariff.standing_charge_daily * 365;
    
    // Unit charges
    if (tariff.tariff_type === 'day_night' && tariff.day_rate && tariff.night_rate) {
      const dayConsumption = usage.annual_consumption_kwh * usage.day_percentage;
      const nightConsumption = usage.annual_consumption_kwh * usage.night_percentage;
      annualCost += (dayConsumption * tariff.day_rate) + (nightConsumption * tariff.night_rate);
    } else if (tariff.unit_rate) {
      annualCost += usage.annual_consumption_kwh * tariff.unit_rate;
    }
    
    // Add estimated network charges (approx 25% of unit charges)
    annualCost *= 1.25;
    
    // Add VAT (13.5%)
    annualCost *= 1.135;
    
    return Math.round(annualCost * 100) / 100;
  }
  
  /**
   * Get default Irish energy tariffs (for demo/testing)
   */
  private getDefaultTariffs(): TariffOption[] {
    return [
      {
        supplier: 'Electric Ireland',
        tariff_name: '24 Hour',
        tariff_type: 'flat',
        unit_rate: 0.42,
        standing_charge_daily: 1.20,
        estimated_annual_cost: 0
      },
      {
        supplier: 'Electric Ireland',
        tariff_name: 'Day/Night',
        tariff_type: 'day_night',
        day_rate: 0.45,
        night_rate: 0.22,
        standing_charge_daily: 1.35,
        estimated_annual_cost: 0
      },
      {
        supplier: 'Bord Gáis Energy',
        tariff_name: 'Standard Business',
        tariff_type: 'flat',
        unit_rate: 0.40,
        standing_charge_daily: 1.10,
        estimated_annual_cost: 0
      },
      {
        supplier: 'SSE Airtricity',
        tariff_name: 'Business Saver',
        tariff_type: 'flat',
        unit_rate: 0.41,
        standing_charge_daily: 1.15,
        contract_length_months: 12,
        estimated_annual_cost: 0
      },
      {
        supplier: 'Energia',
        tariff_name: 'Fixed Price 12',
        tariff_type: 'flat',
        unit_rate: 0.39,
        standing_charge_daily: 1.25,
        contract_length_months: 12,
        estimated_annual_cost: 0
      },
      {
        supplier: 'Prepay Power',
        tariff_name: 'Prepay Business',
        tariff_type: 'flat',
        unit_rate: 0.43,
        standing_charge_daily: 0.95,
        estimated_annual_cost: 0
      }
    ];
  }
  
  /**
   * Load tariffs from database
   */
  async loadTariffsFromDatabase(db: any, activeOnly = true): Promise<void> {
    try {
      const query = `
        SELECT 
          supplier, tariff_name, tariff_type, connection_type,
          unit_rate, day_rate, night_rate, standing_charge_daily,
          capacity_charge_per_kva, contract_length_months,
          valid_from, valid_to
        FROM tariff_database
        WHERE ${activeOnly ? 'active = true AND ' : ''}
        (valid_to IS NULL OR valid_to > CURRENT_DATE)
        ORDER BY supplier, tariff_name
      `;
      
      const result = await db.query(query);
      this.tariffDatabase = result.rows.map(row => ({
        supplier: row.supplier,
        tariff_name: row.tariff_name,
        tariff_type: row.tariff_type,
        unit_rate: parseFloat(row.unit_rate) || undefined,
        day_rate: parseFloat(row.day_rate) || undefined,
        night_rate: parseFloat(row.night_rate) || undefined,
        standing_charge_daily: parseFloat(row.standing_charge_daily),
        contract_length_months: row.contract_length_months,
        estimated_annual_cost: 0
      }));
      
      console.log(`✅ Loaded ${this.tariffDatabase.length} tariffs from database`);
    } catch (error) {
      console.error('Failed to load tariffs from database:', error);
      this.tariffDatabase = this.getDefaultTariffs();
    }
  }
}

export default TariffOptimizer;
