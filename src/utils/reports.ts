import { FootprintRecord, FamilyMember } from '../types';

export function exportToCSV(records: FootprintRecord[]): string {
  if (records.length === 0) return '';
  
  const headers = [
    'Date',
    'Is Daily Log',
    'Transport (kg CO2)',
    'Energy (kg CO2)',
    'Food (kg CO2)',
    'Lifestyle (kg CO2)',
    'Total Emissions (kg CO2)',
    'Vehicle Type',
    'Electricity (kWh)'
  ];

  const rows = records.map(r => [
    r.date,
    r.isDaily ? 'Yes' : 'No',
    r.transport,
    r.energy,
    r.food,
    r.lifestyle,
    r.total,
    r.inputs.vehicleType,
    r.inputs.electricityKwh
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

export function generateExecutiveReportText(
  records: FootprintRecord[],
  familyMembers: FamilyMember[]
): string {
  if (records.length === 0) return 'No records to compile.';

  const latest = records[0];
  const totalEmissions = latest.total;
  const categories = [
    { name: 'Transport', val: latest.transport },
    { name: 'Energy', val: latest.energy },
    { name: 'Food', val: latest.food },
    { name: 'Lifestyle', val: latest.lifestyle }
  ];
  categories.sort((a, b) => b.val - a.val);
  const topContributor = categories[0];

  let monthlyComparison = 'Single record entered.';
  let reductionPercentage = '0%';
  if (records.length > 1) {
    const previous = records[1];
    const diff = previous.total - latest.total;
    const pct = ((diff / previous.total) * 100).toFixed(1);
    if (diff > 0) {
      monthlyComparison = `Reduced by ${diff.toFixed(1)} kg CO2 compared to previous entry (${previous.date}).`;
      reductionPercentage = `${pct}% reduction`;
    } else {
      monthlyComparison = `Increased by ${Math.abs(diff).toFixed(1)} kg CO2 compared to previous entry (${previous.date}).`;
      reductionPercentage = `${pct}% increase`;
    }
  }

  let familySec = '';
  if (familyMembers.length > 0) {
    familySec = '\n--- FAMILY MEMBERS LOG ---\n' + 
      familyMembers.map(f => `${f.name}: Total ${f.total.toFixed(1)} kg CO2 (T: ${f.transport}, E: ${f.energy}, F: ${f.food}, L: ${f.lifestyle})`).join('\n');
  }

  return `
========================================
     ECOLENS ENVIRONMENTAL AUDIT REPORT
========================================
Generated: ${new Date().toLocaleDateString()}
Report Focus Period: ${latest.date}

=== CORE PERFORMANCE FIGURES ===
Total Footprint:        ${totalEmissions.toFixed(1)} kg CO2
Top Footprint Category: ${topContributor.name} (${topContributor.val.toFixed(1)} kg CO2)
Monthly Comparison:     ${monthlyComparison}
Rate of Change:         ${reductionPercentage}

=== BREAKDOWN INSIGHTS ===
- Transportation: ${latest.transport.toFixed(1)} kg CO2
- Electrical/Gas Energy: ${latest.energy.toFixed(1)} kg CO2
- Food Choices & Meals: ${latest.food.toFixed(1)} kg CO2
- Consumer Lifestyle & Waste: ${latest.lifestyle.toFixed(1)} kg CO2
${familySec}

=== SYSTEM REASONING & ACTIONS REQUIRED ===
- Focus heavily on reducing ${topContributor.name.toLowerCase()} emissions.
- Consult the EcoLens Recommendations Engine to execute targeted reduction challenges.
- Log inputs consecutively next month to sustain active tracking.

========================================
          THANK YOU FOR TRACKING
        EcoLens - Decarbonizing Daily
========================================
`;
}
