/**
 * ENGINE 1: OCR EXTRACTION ENGINE
 * Extracts data from Irish energy bills (multiple supplier formats)
 */

import Tesseract from 'tesseract.js';
import * as pdfParseModule from 'pdf-parse';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pdfParse = (pdfParseModule as any).default || pdfParseModule;
import fs from 'fs/promises';
import path from 'path';

export interface BillData {
  // Identification
  account_number?: string;
  mprn?: string; // Meter Point Reference Number (electricity)
  gprn?: string; // Gas Point Reference Number (gas)
  bill_number?: string;
  bill_date?: Date;
  period_start?: Date;
  period_end?: Date;
  
  // Supplier info
  supplier_name?: string;
  tariff_name?: string;
  contract_end_date?: Date;
  
  // Consumption
  total_kwh?: number;
  day_kwh?: number;
  night_kwh?: number;
  peak_kwh?: number;
  off_peak_kwh?: number;
  estimated?: boolean;
  meter_reading_current?: number;
  meter_reading_previous?: number;
  
  // Charges breakdown
  unit_charges?: number;
  day_unit_cost?: number;
  night_unit_cost?: number;
  standing_charges?: number;
  network_charges?: number;
  tuos?: number; // Transmission charges
  duos?: number; // Distribution charges
  capacity_charges?: number;
  
  // Levies and taxes
  pso_levy?: number;
  ccl_carbon_tax?: number;
  reactive_power_charge?: number;
  other_charges?: number;
  
  // Tax
  subtotal_before_vat?: number;
  vat_rate?: number;
  vat_amount?: number;
  total_amount?: number;
  
  // Metadata
  confidence_score?: number;
  extraction_method?: 'tesseract' | 'pdf-parse' | 'hybrid';
  raw_text?: string;
}

export class OCRExtractionEngine {
  
  /**
   * Main extraction method - determines file type and extracts data
   */
  async extractBillData(filePath: string): Promise<BillData> {
    try {
      const fileExtension = path.extname(filePath).toLowerCase();
      
      let rawText: string;
      let extractionMethod: 'tesseract' | 'pdf-parse' | 'hybrid';
      
      // Step 1: Extract text based on file type
      if (fileExtension === '.pdf') {
        // Try PDF parsing first (faster and more accurate for digital PDFs)
        try {
          rawText = await this.extractTextFromPDF(filePath);
          extractionMethod = 'pdf-parse';
        } catch (error) {
          // Fallback to OCR for scanned PDFs
          console.log('PDF parsing failed, using OCR fallback');
          rawText = await this.extractTextFromImage(filePath);
          extractionMethod = 'tesseract';
        }
      } else if (['.jpg', '.jpeg', '.png', '.tiff'].includes(fileExtension)) {
        rawText = await this.extractTextFromImage(filePath);
        extractionMethod = 'tesseract';
      } else {
        throw new Error(`Unsupported file type: ${fileExtension}`);
      }
      
      // Step 2: Identify supplier from text
      const supplier = this.identifySupplier(rawText);
      console.log(`✅ Identified supplier: ${supplier}`);
      
      // Step 3: Extract structured data using supplier-specific patterns
      const billData = await this.extractStructuredData(rawText, supplier);
      billData.extraction_method = extractionMethod;
      billData.raw_text = rawText;
      
      // Step 4: Calculate confidence score
      billData.confidence_score = this.calculateConfidenceScore(billData);
      
      return billData;
      
    } catch (error) {
      console.error('OCR Extraction Error:', error);
      throw new Error(`Failed to extract bill data: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Extract text from PDF using pdf-parse
   */
  private async extractTextFromPDF(filePath: string): Promise<string> {
    const dataBuffer = await fs.readFile(filePath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text;
  }
  
  /**
   * Extract text from image using Tesseract OCR
   */
  private async extractTextFromImage(filePath: string): Promise<string> {
    const { data: { text } } = await Tesseract.recognize(filePath, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      }
    });
    return text;
  }
  
  /**
   * Identify supplier from bill text
   */
  private identifySupplier(text: string): string {
    const textLower = text.toLowerCase();
    
    const suppliers = {
      'Electric Ireland': ['electric ireland', 'esbnetworks', 'esb networks'],
      'Bord Gáis Energy': ['bord gáis', 'bord gais', 'bordgaisenergy'],
      'SSE Airtricity': ['sse airtricity', 'airtricity', 'sse'],
      'Energia': ['energia', 'viridian'],
      'Prepay Power': ['prepay power', 'prepaypower'],
      'Flogas': ['flogas'],
      'Panda Power': ['panda power', 'pandapower'],
      'Pinergy': ['pinergy']
    };
    
    for (const [supplier, keywords] of Object.entries(suppliers)) {
      if (keywords.some(keyword => textLower.includes(keyword))) {
        return supplier;
      }
    }
    
    return 'UNKNOWN';
  }
  
  /**
   * Extract structured data using supplier-specific regex patterns
   */
  private async extractStructuredData(text: string, supplier: string): Promise<BillData> {
    const billData: BillData = { supplier_name: supplier };
    
    // Generic patterns (work for most suppliers)
    const patterns = {
      // Identification
      account_number: /Account\s*Number[:|\s]\s*(\d+)/i,
      bill_number: /Bill\s*Number[:|\s]\s*([\w\d-]+)/i,
      mprn: /MPRN[:|\s]\s*(\d{11})/i,
      gprn: /GPRN[:|\s]\s*(\d{7})/i,
      
      // Dates
      bill_date: /Bill\s*Date[:|\s]\s*(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i,
      period_start: /Period[:|\s]\s*(\d{2}[\/\-]\d{2}[\/\-]\d{4})\s*(?:to|-)/i,
      period_end: /(?:to|-)\s*(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i,
      
      // Consumption
      total_kwh: /Total\s*(?:Units|kWh)[:|\s]\s*([\d,]+)\s*kWh/i,
      day_kwh: /Day\s*(?:Units|kWh)[:|\s]\s*([\d,]+)\s*kWh/i,
      night_kwh: /Night\s*(?:Units|kWh)[:|\s]\s*([\d,]+)\s*kWh/i,
      
      // Meter readings
      meter_reading_current: /Current\s*Reading[:|\s]\s*([\d,]+)/i,
      meter_reading_previous: /Previous\s*Reading[:|\s]\s*([\d,]+)/i,
      
      // Charges
      unit_charges: /Unit\s*Charges[:|\s]\s*€\s*([\d,.]+)/i,
      standing_charges: /Standing\s*Charge[:|\s]\s*€\s*([\d,.]+)/i,
      network_charges: /Network\s*Charges[:|\s]\s*€\s*([\d,.]+)/i,
      pso_levy: /PSO\s*Levy[:|\s]\s*€\s*([\d,.]+)/i,
      ccl_carbon_tax: /(?:Carbon\s*Tax|CCL)[:|\s]\s*€\s*([\d,.]+)/i,
      
      // Tax
      subtotal_before_vat: /(?:Subtotal|Sub\s*Total)[:|\s]\s*€\s*([\d,.]+)/i,
      vat_rate: /VAT\s*@\s*([\d.]+)%/i,
      vat_amount: /VAT\s*Amount[:|\s]\s*€\s*([\d,.]+)/i,
      total_amount: /Total\s*(?:Amount\s*)?Due[:|\s]\s*€\s*([\d,.]+)/i,
    };
    
    // Apply patterns
    for (const [field, pattern] of Object.entries(patterns)) {
      const match = text.match(pattern);
      if (match && match[1]) {
        let value: any = match[1];
        
        // Clean and convert values
        if (field.includes('kwh') || field.includes('amount') || field.includes('charges') || 
            field.includes('levy') || field.includes('reading')) {
          value = parseFloat(value.replace(/,/g, ''));
        } else if (field.includes('date')) {
          value = this.parseDate(value);
        } else if (field === 'vat_rate') {
          value = parseFloat(value) / 100; // Convert percentage to decimal
        }
        
        (billData as Record<string, unknown>)[field] = value;
      }
    }
    
    // Check if estimated reading
    billData.estimated = /estimated/i.test(text);
    
    // Supplier-specific extraction
    if (supplier === 'Electric Ireland') {
      this.extractElectricIrelandSpecific(text, billData);
    } else if (supplier === 'Bord Gáis Energy') {
      this.extractBordGaisSpecific(text, billData);
    } else if (supplier === 'SSE Airtricity') {
      this.extractSSESpecific(text, billData);
    }
    
    return billData;
  }
  
  /**
   * Electric Ireland specific extraction
   */
  private extractElectricIrelandSpecific(text: string, billData: BillData): void {
    // Electric Ireland often uses "Day/Night" terminology
    const dayNightPattern = /Day\/Night\s*Tariff/i;
    if (dayNightPattern.test(text)) {
      billData.tariff_name = 'Day/Night';
    }
    
    // Extract TUOS/DUOS if present
    const tuosMatch = text.match(/TUOS[:|\s]\s*€\s*([\d,.]+)/i);
    if (tuosMatch) {
      billData.tuos = parseFloat(tuosMatch[1].replace(/,/g, ''));
    }
    
    const duosMatch = text.match(/DUOS[:|\s]\s*€\s*([\d,.]+)/i);
    if (duosMatch) {
      billData.duos = parseFloat(duosMatch[1].replace(/,/g, ''));
    }
  }
  
  /**
   * Bord Gáis Energy specific extraction
   */
  private extractBordGaisSpecific(text: string, billData: BillData): void {
    // Bord Gáis often has "Discount" lines
    const discountMatch = text.match(/Discount[:|\s]\s*-?€\s*([\d,.]+)/i);
    if (discountMatch) {
      const discount = parseFloat(discountMatch[1].replace(/,/g, ''));
      billData.other_charges = (billData.other_charges || 0) - discount;
    }
  }
  
  /**
   * SSE Airtricity specific extraction
   */
  private extractSSESpecific(text: string, billData: BillData): void {
    // SSE uses "Peak/Off-Peak" terminology
    const peakPattern = /Peak\s*Units[:|\s]\s*([\d,]+)\s*kWh/i;
    const offPeakPattern = /Off-Peak\s*Units[:|\s]\s*([\d,]+)\s*kWh/i;
    
    const peakMatch = text.match(peakPattern);
    const offPeakMatch = text.match(offPeakPattern);
    
    if (peakMatch) {
      billData.peak_kwh = parseFloat(peakMatch[1].replace(/,/g, ''));
    }
    if (offPeakMatch) {
      billData.off_peak_kwh = parseFloat(offPeakMatch[1].replace(/,/g, ''));
    }
  }
  
  /**
   * Parse date string to Date object
   */
  private parseDate(dateStr: string): Date {
    // Handle DD/MM/YYYY or DD-MM-YYYY format
    const parts = dateStr.split(/[\/\-]/);
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1; // Month is 0-indexed
      const year = parseInt(parts[2]);
      return new Date(year, month, day);
    }
    return new Date(dateStr);
  }
  
  /**
   * Calculate confidence score based on how much data was extracted
   */
  private calculateConfidenceScore(billData: BillData): number {
    const criticalFields = [
      'supplier_name', 'bill_date', 'total_kwh', 'total_amount', 'vat_rate'
    ];
    
    const importantFields = [
      'account_number', 'mprn', 'period_start', 'period_end', 
      'unit_charges', 'standing_charges', 'vat_amount'
    ];
    
    let score = 0;
    let maxScore = 0;
    
    // Critical fields worth 10 points each
    criticalFields.forEach(field => {
      maxScore += 10;
      if ((billData as Record<string, unknown>)[field] !== undefined && (billData as Record<string, unknown>)[field] !== null) {
        score += 10;
      }
    });
    
    // Important fields worth 5 points each
    importantFields.forEach(field => {
      maxScore += 5;
      if ((billData as Record<string, unknown>)[field] !== undefined && (billData as Record<string, unknown>)[field] !== null) {
        score += 5;
      }
    });
    
    return Math.round((score / maxScore) * 100);
  }
}

export default OCRExtractionEngine;
