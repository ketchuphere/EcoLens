import React, { useState } from 'react';
import { EcoChallenge, SEVEN_DAY_CHALLENGE } from '../data/sustainability';
import { FootprintRecord, FamilyMember } from '../types';
import { generateExecutiveReportText, exportToCSV } from '../utils/reports';
import { Sparkles, Calendar, CheckSquare, FileText, Download, Printer, ShieldCheck, HeartPulse } from 'lucide-react';

interface EcoChallengesAndReportsProps {
  records: FootprintRecord[];
  familyMembers: FamilyMember[];
  completedChallengeDays: number[];
  onToggleChallengeDay: (day: number, pts: number) => void;
}

export const EcoChallengesAndReports: React.FC<EcoChallengesAndReportsProps> = ({
  records,
  familyMembers,
  completedChallengeDays,
  onToggleChallengeDay
}) => {
  const [activeReportOpen, setActiveReportOpen] = useState(false);

  const handleDownloadCSV = () => {
    const csvContent = exportToCSV(records);
    if (!csvContent) return;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ecolens_carbon_footprint_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadReportText = () => {
    const text = generateExecutiveReportText(records, familyMembers);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ecolens_environmental_audit_${new Date().toISOString().split('T')[0]}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const latestRecord = records[0];
  const auditText = generateExecutiveReportText(records, familyMembers);

  return (
    <div className="space-y-8" id="challenges_reports_container">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: 7-Day Eco Challenge */}
        <div className="lg:col-span-7 bg-white border border-stone-200/85 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="pb-4 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-900">7-Day Guided Green Challenge</h2>
              <p className="text-xs text-stone-500 font-medium">Earn point multipliers by declaring standard climate actions on consecutive days</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 text-amber-500">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {SEVEN_DAY_CHALLENGE.map((challenge) => {
              const checked = completedChallengeDays.includes(challenge.day);
              
              return (
                <div
                  key={challenge.day}
                  onClick={() => onToggleChallengeDay(challenge.day, checked ? -20 : 20)}
                  className={`border rounded-xl p-4 flex items-start gap-4 transition-all cursor-pointer relative select-none ${
                    checked
                      ? 'border-emerald-200 bg-emerald-50/30'
                      : 'border-stone-205 hover:border-stone-300 hover:bg-stone-50/50'
                  }`}
                >
                  <div className="pt-0.5">
                    <div className={`w-5.5 h-5.5 rounded-full border flex items-center justify-center transition-all ${
                      checked
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-stone-300 bg-white'
                    }`}>
                      {checked ? (
                        <CheckSquare className="w-4.5 h-4.5 fill-current" />
                      ) : (
                        <span className="text-[10px] font-bold text-stone-500">{challenge.day}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1 pr-12">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold text-stone-400 capitalize">Day {challenge.day}</span>
                      <span className={`text-[9px] font-bold py-0.5 px-1.5 rounded-full ${
                        challenge.difficulty === 'Easy' 
                          ? 'bg-emerald-50 text-emerald-800' 
                          : 'bg-amber-50 text-amber-800'
                      }`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                    <p className={`text-xs font-bold ${checked ? 'text-emerald-900' : 'text-stone-800'}`}>
                      {challenge.title}
                    </p>
                    <p className="text-[11px] text-stone-500 font-medium leading-normal font-sans">
                      {challenge.description}
                    </p>
                  </div>

                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-right">
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 py-1 px-2.5 border border-emerald-100 rounded-full">
                      +{challenge.co2Savings} kg
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Environmental Audit Report */}
        <div className="lg:col-span-5 bg-white border border-stone-200/85 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="pb-4 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-stone-900">Environmental Reports</h2>
                <p className="text-xs text-stone-500 font-medium">Download dynamic carbon statements and audit reports</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-600">
                <FileText className="w-5 h-5" />
              </div>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed font-sans">
              EcoLens aggregates local calculations, streaks, and family totals to generate a structured carbon audit file. Select a file type below to trigger downoad:
            </p>

            <div className="space-y-3 pt-2">
              {/* CSV button */}
              <button
                onClick={handleDownloadCSV}
                disabled={records.length === 0}
                className={`w-full flex items-center justify-between text-left py-3 px-4 rounded-xl border transition-all ${
                  records.length > 0
                    ? 'border-stone-200 bg-stone-50 hover:bg-stone-100 cursor-pointer text-stone-800'
                    : 'border-stone-100 bg-stone-50/40 opacity-50 cursor-not-allowed text-stone-400'
                }`}
              >
                <div className="flex items-center gap-2.5 text-xs font-bold">
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>Download Footprint History (CSV)</span>
                </div>
                <span className="text-[9px] font-bold text-stone-400 uppercase font-mono">.csv file</span>
              </button>

              {/* TXT Report button */}
              <button
                onClick={handleDownloadReportText}
                disabled={records.length === 0}
                className={`w-full flex items-center justify-between text-left py-3 px-4 rounded-xl border transition-all ${
                  records.length > 0
                    ? 'border-stone-200 bg-stone-50 hover:bg-stone-100 cursor-pointer text-stone-800'
                    : 'border-stone-100 bg-stone-50/40 opacity-50 cursor-not-allowed text-stone-400'
                }`}
              >
                <div className="flex items-center gap-2.5 text-xs font-bold">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Download Environmental Audit (TXT)</span>
                </div>
                <span className="text-[9px] font-bold text-stone-400 uppercase font-mono">.txt file</span>
              </button>

              {/* Print report preview button */}
              <button
                onClick={() => setActiveReportOpen(true)}
                disabled={records.length === 0}
                className={`w-full flex items-center justify-between text-left py-3 px-4 rounded-xl border transition-all ${
                  records.length > 0
                    ? 'border-indigo-100 bg-indigo-50 hover:bg-indigo-100/60 cursor-pointer text-indigo-900 font-bold'
                    : 'border-stone-100 bg-stone-50/40 opacity-50 cursor-not-allowed text-stone-400'
                }`}
              >
                <div className="flex items-center gap-2.5 text-xs font-bold">
                  <Printer className="w-4 h-4" />
                  <span>Open Executive Print Report</span>
                </div>
                <span className="text-[9px] font-bold text-indigo-400 uppercase font-mono">PRINT-MODE</span>
              </button>
            </div>
          </div>

          <div className="bg-emerald-800 text-white p-4 rounded-xl space-y-1.5 mt-4">
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 uppercase tracking-widest leading-none">
              <ShieldCheck className="w-4 h-4 fill-emerald-600 text-white shrink-0" />
              <span>CO₂ offset rating</span>
            </div>
            <p className="text-[11px] font-semibold leading-normal font-sans">
              You registered {completedChallengeDays.length} of 7 green challenge goals! High-density consistency helps lower overall household utility bills.
            </p>
          </div>
        </div>
      </div>

      {/* Printable Report Modal Dialog Overlay */}
      {activeReportOpen && (
        <div className="fixed inset-0 bg-stone-900/60 flex items-center justify-center p-4 z-50 animate-fade-in no-print">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 overflow-hidden flex flex-col max-h-[85vh] shadow-2xl">
            <div className="bg-stone-905 p-4 border-b border-stone-200 flex justify-between items-center text-stone-900">
              <h3 className="font-extrabold text-sm tracking-wide">Executive environmental Audit statement</h3>
              <button
                onClick={() => setActiveReportOpen(false)}
                className="text-stone-500 hover:text-stone-900 font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto bg-stone-50 font-mono text-[10px] whitespace-pre-wrap leading-relaxed text-stone-700 h-full">
              {auditText}
            </div>

            <div className="p-4 bg-white border-t border-stone-100 flex justify-end gap-3 no-print">
              <button
                onClick={handlePrint}
                className="py-2 px-4 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
              <button
                onClick={() => setActiveReportOpen(false)}
                className="py-2 px-4 text-xs font-bold bg-stone-200 hover:bg-stone-305 text-stone-700 rounded-lg cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
