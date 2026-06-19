import { FootprintRecord, FamilyMember } from '../types';
import { exportToCSV, generateExecutiveReportText } from '../utils/reports';
import { EcoLensErrorHandler } from '../utils/errorHandler';

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
      EcoLensErrorHandler.handleError(e, 'Error creating export dataset');
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
      EcoLensErrorHandler.handleError(e, 'Error preparing formatted text executive draft');
      return 'Diagnostics compilation failed.';
    }
  }
};
