/**
 * Foxlite Energy Services - Professional Letterhead Template
 * 
 * Generates consistent letterhead formatting for all correspondence
 * Includes Foxlite Consulting logo placement and contact details
 */

const foxliteLetterhead = {
  // Company Details
  companyName: "FOXLITE ENERGY SERVICES",
  tagline: "Professional Energy Consulting",
  
  // Contact Information
  director: "MANAGING DIRECTOR — IDENTITY VERIFICATION REQUIRED",
  title: "Group Managing Director", 
  email: "foxliteconsulting@gmail.com",
  
  // Logo Configuration
  logo: {
    position: "top-left",
    description: "Foxlite Consulting logo (fox with top hat and cane, standing beside ornate lamppost)",
    placement: "header"
  },
  
  // Standard Header Template
  generateHeader: function(date = new Date().toLocaleDateString('en-GB')) {
    return `# FOXLITE ENERGY SERVICES

**${this.director}**  
${this.title}  
Email: ${this.email}  
Date: ${date}

---`;
  },
  
  // Standard Footer Template
  generateFooter: function() {
    return `---

**${this.companyName}** | ${this.tagline}`;
  },
  
  // Signature Block
  generateSignature: function() {
    return `Yours faithfully,

**${this.director}**  
Director, Foxlite Energy Services`;
  }
};

module.exports = foxliteLetterhead;