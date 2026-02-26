/**
 * Foxlite Energy Services - Helper Functions
 * 
 * Reusable utilities for forensic audit calculations and document generation
 */

const foxliteHelpers = {
  
  // Financial Calculations
  calculations: {
    
    // Calculate blended rate from total charges and consumption
    blendedRate: function(totalCharges, totalKwh) {
      if (totalKwh === 0) return 0;
      return parseFloat((totalCharges / totalKwh).toFixed(4));
    },
    
    // Calculate excess consumption based on percentage differential
    excessConsumption: function(totalConsumption, excessPercentage) {
      const normal = totalConsumption / (1 + (excessPercentage / 100));
      const excess = totalConsumption - normal;
      return {
        total: totalConsumption,
        normal: Math.round(normal),
        excess: Math.round(excess)
      };
    },
    
    // Simple interest calculation (Courts Act 1981 Section 22)
    simpleInterest: function(principal, rate = 0.08, months) {
      return parseFloat((principal * rate * (months / 12)).toFixed(2));
    },
    
    // Series sum for interest calculations (1+2+3+...+n)
    seriesSum: function(n) {
      return (n * (n + 1)) / 2;
    }
  },
  
  // Invoice Processing
  invoiceProcessing: {
    
    // Cross-check charge line rates against net total
    crossCheckRate: function(netTotal, otherCharges, consumption) {
      const residual = netTotal - otherCharges.reduce((sum, charge) => sum + charge, 0);
      return parseFloat((residual / consumption).toFixed(4));
    },
    
    // Process reversal lines in billing chains
    processReversals: function(lines) {
      let netConsumption = 0;
      lines.forEach(line => {
        netConsumption += line.consumption * (line.isReversal ? -1 : 1);
      });
      return netConsumption;
    }
  },
  
  // Data Classification
  dataClassification: {
    CONFIRMED: "CONFIRMED",
    CALCULATED: "CALCULATED", 
    ESTIMATED: "ESTIMATED",
    UNKNOWN: "UNKNOWN",
    
    // Classify data confidence level
    classify: function(source, hasCalculation, hasAssumptions) {
      if (source === "verified_document") return this.CONFIRMED;
      if (hasCalculation && !hasAssumptions) return this.CALCULATED;
      if (hasAssumptions) return this.ESTIMATED;
      return this.UNKNOWN;
    }
  },
  
  // Deadline Calculations
  deadlines: {
    
    // Add business days to date
    addBusinessDays: function(date, days) {
      const result = new Date(date);
      let addedDays = 0;
      
      while (addedDays < days) {
        result.setDate(result.getDate() + 1);
        // Skip weekends (0 = Sunday, 6 = Saturday)
        if (result.getDay() !== 0 && result.getDay() !== 6) {
          addedDays++;
        }
      }
      return result;
    },
    
    // Standard deadline calculations
    cru: function(startDate) {
      return this.addBusinessDays(startDate, 14);
    },
    
    gdpr: function(startDate) {
      const result = new Date(startDate);
      result.setDate(result.getDate() + 30);
      return result;
    },
    
    esbn: function(startDate) {
      return this.addBusinessDays(startDate, 15);
    }
  }
};

module.exports = foxliteHelpers;