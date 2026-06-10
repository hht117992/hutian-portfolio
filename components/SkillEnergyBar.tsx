type SkillEnergyBarProps = {
  energy: number;
};

export default function SkillEnergyBar({ energy }: SkillEnergyBarProps) {
  return (
    <div className="skill-energy" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <span className={index < energy ? "is-active" : ""} key={index} />
      ))}
    </div>
  );
}
