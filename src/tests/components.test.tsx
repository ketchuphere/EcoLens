import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WhatIfSimulator } from '../components/calculator/WhatIfSimulator';
import { CarbonInputs } from '../types';

describe('React Component: WhatIfSimulator', () => {
  const mockInputs: CarbonInputs = {
    vehicleType: 'petrol_car',
    distanceCar: 400,
    distanceBus: 100,
    distanceMetro: 50,
    distanceTrain: 0,
    flightsCount: 0,
    distanceFlight: 0,
    electricityKwh: 200,
    lpgKg: 10,
    acHours: 2,
    hasSolar: false,
    solarGenerationKwh: 0,
    dietType: 'meat_moderate',
    meatMealsPerMonth: 15,
    foodWasteLevel: 'medium',
    shoppingLevel: 'moderate',
    recyclesActive: false,
    wasteBagsCount: 3
  };

  it('renders the interactive What-If reduction simulator component cleanly', () => {
    render(<WhatIfSimulator currentInputs={mockInputs} />);

    // Check title presence
    expect(screen.getByText('What-If Reduction Simulator')).toBeInTheDocument();
    expect(screen.getByText('Cut Car Commute distance')).toBeInTheDocument();
    expect(screen.getByText('Transition Diet patterns')).toBeInTheDocument();
    expect(screen.getByText('Simulation Metrics')).toBeInTheDocument();
  });

  it('allows clicking diet transition buttons and updates outputs', () => {
    render(<WhatIfSimulator currentInputs={mockInputs} />);

    const veganBtn = screen.getByText('100% Vegan Plan');
    expect(veganBtn).toBeInTheDocument();

    // Click to transit diet plan
    fireEvent.click(veganBtn);

    // Verify it is highlighted
    expect(veganBtn.className).toContain('bg-emerald-600');
  });

  it('coordinates solar installations checkbox toggles successfully', () => {
    render(<WhatIfSimulator currentInputs={mockInputs} />);

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(2);
    const solarCheckbox = checkboxes[1];

    // Trigger toggle action
    expect(solarCheckbox).not.toBeChecked();
    fireEvent.click(solarCheckbox);
    expect(solarCheckbox).toBeChecked();
  });

  it('coordinates waste-halved toggles successfully', () => {
    render(<WhatIfSimulator currentInputs={mockInputs} />);

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(2);
    const wasteCheckbox = checkboxes[0];
    
    // Initialised as checked in simulator
    expect(wasteCheckbox).toBeChecked();
    fireEvent.click(wasteCheckbox);
    expect(wasteCheckbox).not.toBeChecked();
  });
});
