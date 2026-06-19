import { FootprintRecord, FamilyMember } from '../types';

export function exportToCSV(records: FootprintRecord[]): string {
  if (records.length === 0) return '';
  
  const headers = [
    'Date',
    'Log Type',
    'Transport (kg CO2)',
    'Energy (kg CO2)',
    'Food (kg CO2)',
    'Lifestyle (kg CO2)',
    'Total Emissions (kg CO2)',
    'Transport Contribution %',
    'Energy Contribution %',
    'Food Contribution %',
    'Lifestyle Contribution %',
    'Vehicle Type',
    'Car Distance (km)',
    'Bus Distance (km)',
    'Metro Distance (km)',
    'Train Distance (km)',
    'Flight Distance (km)',
    'Electricity (kWh)',
    'LPG Raw (kg)',
    'AC Usage Hours/Day',
    'Active Solar Panels',
    'Solar Generation (kWh)',
    'Diet Type Tag',
    'Monthly Meat Meals',
    'Food Waste Level',
    'Shopping Intensity',
    'Recycling Active',
    'Weekly Waste Bags Count'
  ];

  function escapeCSVField(val: unknown): string {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  const rows = records.map(r => {
    const total = r.total || 0.001; // Avoid division by zero
    const transportPct = ((r.transport / total) * 100).toFixed(1) + '%';
    const energyPct = ((r.energy / total) * 100).toFixed(1) + '%';
    const foodPct = ((r.food / total) * 100).toFixed(1) + '%';
    const lifestylePct = ((r.lifestyle / total) * 100).toFixed(1) + '%';

    return [
      r.date,
      r.isDaily ? 'Daily Log' : 'Monthly Log',
      r.transport.toFixed(2),
      r.energy.toFixed(2),
      r.food.toFixed(2),
      r.lifestyle.toFixed(2),
      r.total.toFixed(2),
      transportPct,
      energyPct,
      foodPct,
      lifestylePct,
      r.inputs.vehicleType,
      r.inputs.distanceCar,
      r.inputs.distanceBus,
      r.inputs.distanceMetro,
      r.inputs.distanceTrain,
      r.inputs.distanceFlight,
      r.inputs.electricityKwh,
      r.inputs.lpgKg,
      r.inputs.acHours,
      r.inputs.hasSolar ? 'Yes' : 'No',
      r.inputs.solarGenerationKwh,
      r.inputs.dietType,
      r.inputs.meatMealsPerMonth,
      r.inputs.foodWasteLevel,
      r.inputs.shoppingLevel,
      r.inputs.recyclesActive ? 'Yes' : 'No',
      r.inputs.wasteBagsCount
    ].map(escapeCSVField);
  });

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
