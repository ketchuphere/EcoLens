import { FootprintRecord, FamilyMember } from '../types';
import { exportToCSV, generateExecutiveReportText } from '../utils/reports';

/**
 * Report service to coordinate data exportation and audit summary compiles.
 */
export const ReportService = {
  /**
   * Translates active tracking rows into CSV format payload.
   */
  exportCSV: (records: FootprintRecord[]): string => {
    try {
      return exportToCSV(records);
    } catch (e) {
      console.error('[ReportService] Error creating export dataset', e);
      return '';
    }
  },

  /**
   * Compiles executive diagnostics performance summary text.
   */
  generateExecutiveReport: (records: FootprintRecord[], family: FamilyMember[]): string => {
    try {
      return generateExecutiveReportText(records, family);
    } catch (e) {
      console.error('[ReportService] Error preparing formatted text executive draft', e);
      return 'Diagnostics compilation failed.';
    }
  }
};
