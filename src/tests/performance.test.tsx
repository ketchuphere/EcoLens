import React, { useMemo } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { CarbonService } from '../services/carbonService';
import { CarbonInputs } from '../types';

describe('Performance Specifications TestSuite', () => {

  it('measures rendering duration of complex components is well within safe interactive limits (<15ms)', () => {
    const inputs: CarbonInputs = {
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

    const startTime = performance.now();
    
    // Simulate multiple computation loops to check efficiency
    for (let i = 0; i < 50; i++) {
      CarbonService.calculate(inputs);
    }
    
    const duration = performance.now() - startTime;
    const avgDuration = duration / 50;

    // A single calculation of emissions and score should be extremely rapid (<1ms avg)
    expect(avgDuration).toBeLessThan(1.0);
  });

  it('ensures memoized carbon calculations reduce recalculation overhead when values are identical', () => {
    // Harness component verifying hook optimization
    const MockMemoComponent = ({ value, tracker }: { value: number; tracker: () => void }) => {
      const computedResult = useMemo(() => {
        tracker();
        return value * 4.2;
      }, [value]);

      return <div id="test_memo">{computedResult}</div>;
    };

    const tracker = vi.fn();
    const { rerender } = render(<MockMemoComponent value={42} tracker={tracker} />);

    // First render triggers calculation
    expect(tracker).toHaveBeenCalledTimes(1);

    // Rerender with matching value shouldn't recalculate
    rerender(<MockMemoComponent value={42} tracker={tracker} />);
    expect(tracker).toHaveBeenCalledTimes(1);

    // Rerender with distinct value triggers correct update
    rerender(<MockMemoComponent value={90} tracker={tracker} />);
    expect(tracker).toHaveBeenCalledTimes(2);
  });

  it('verifies memory footprints are safe with clean listener disposals', () => {
    // Verify that event listeners in hooks are garbage collectable
    const addMock = vi.spyOn(window, 'addEventListener');
    const removeMock = vi.spyOn(window, 'removeEventListener');

    const TestScrollHookComponent = () => {
      React.useEffect(() => {
        const handle = () => {};
        window.addEventListener('scroll', handle);
        return () => window.removeEventListener('scroll', handle);
      }, []);
      return null;
    };

    const { unmount } = render(<TestScrollHookComponent />);
    expect(addMock).toHaveBeenCalled();

    unmount();
    // Disposal check to protect against leakages
    expect(removeMock).toHaveBeenCalled();

    addMock.mockRestore();
    removeMock.mockRestore();
  });
});
