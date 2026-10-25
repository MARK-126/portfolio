/**
 * Window event fired by `GlitchText` when its signal drops, so the hero's `ParticleField` can
 * flood with static at the same moment. `detail` is the drop's duration in milliseconds.
 */
export const SIGNAL_DROP = 'signal-drop'

export type SignalDropEvent = CustomEvent<number>
