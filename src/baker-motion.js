export const BAKER_CARD_DURATION = 4.2;

// One period travels exactly one card and gap. A long resistance phase winds
// into a strong pull, with a smaller forward pulse at the end of the glide.
const SAMPLES = 512;
const speed = phase => .14 + 2.8 * Math.sin(Math.PI * phase) ** 4
  + .3 * Math.exp(25 * (Math.cos(2 * Math.PI * (phase - .83)) - 1));
const velocities = Array.from({ length: SAMPLES + 1 }, (_, i) => speed(i / SAMPLES));
const distances = [0];
for (let i = 1; i <= SAMPLES; i++) {
  distances[i] = distances[i - 1] + (velocities[i - 1] + velocities[i]) / (2 * SAMPLES);
}
const total = distances[SAMPLES];

export function bakerPullProgress(phase) {
  const sample = Math.max(0, Math.min(1, phase)) * SAMPLES;
  const i = Math.min(SAMPLES - 1, Math.floor(sample));
  const t = sample - i;
  // Hermite interpolation preserves continuous velocity between samples and
  // across the loop; the velocity stays positive even during the rebound.
  return ((2 * t ** 3 - 3 * t ** 2 + 1) * distances[i]
    + (t ** 3 - 2 * t ** 2 + t) * velocities[i] / SAMPLES
    + (-2 * t ** 3 + 3 * t ** 2) * distances[i + 1]
    + (t ** 3 - t ** 2) * velocities[i + 1] / SAMPLES) / total;
}
