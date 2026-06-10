type AnimatedDividerProps = {
  label?: string;
};

export default function AnimatedDivider({ label }: AnimatedDividerProps) {
  return (
    <div className="animated-divider" aria-hidden="true">
      <svg viewBox="0 0 980 56" preserveAspectRatio="none">
        <path className="divider-wave" d="M0 35 C120 4 210 50 340 24 S560 12 690 31 860 52 980 18" />
        <path className="divider-wave secondary" d="M0 44 C180 22 230 38 360 40 S560 4 720 24 860 40 980 28" />
      </svg>
      <span className="divider-line" />
      <span className="divider-dot" />
      {label ? <span className="divider-label">{label}</span> : null}
    </div>
  );
}
