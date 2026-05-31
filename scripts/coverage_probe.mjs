import { V10ComplianceGate } from '../server/src/services/V10ComplianceGate.ts';
import { FractalPatternMatcher } from '../server/src/engines/FractalPatternMatcher.ts';
import calibrationService from '../server/src/services/SignalCalibrationService.ts';
import { OutcomeTracker } from '../server/src/services/OutcomeTracker.ts';

const gate = new V10ComplianceGate();
const all = gate.evaluateAll();
console.log(`V10Gate: ${all.length} features`);

const snap = calibrationService.getSnapshot();
console.log(`Calibration: bins=${snap.confidence_bins.length}`);

const matcher = new FractalPatternMatcher();
console.log(`FractalMatcher: loaded`);

const tracker = new OutcomeTracker();
const stats = tracker.getStats();
console.log(`OutcomeTracker: outcomes=${stats.total_signals}`);

console.log('probe done');
