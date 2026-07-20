type SiteTrendProps = {
  label: string;
  values: Array<number | null>;
  tone: "teal" | "amber" | "coral";
};

export function SiteTrend({ label, values, tone }: SiteTrendProps) {
  const numericValues = values.filter((value): value is number => value !== null);
  if (numericValues.length < 2) return <div className="site-trend empty" aria-label={`${label} : projection indisponible`}>Projection suspendue</div>;

  const minimum = Math.min(...numericValues);
  const maximum = Math.max(...numericValues);
  const span = Math.max(1, maximum - minimum);
  const points = values.map((value, index) => {
    const x = 4 + index * (112 / Math.max(1, values.length - 1));
    const y = value === null ? 32 : 31 - ((value - minimum) / span) * 24;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  return (
    <svg className={`site-trend ${tone}`} viewBox="0 0 120 38" role="img" aria-label={`${label} : tendance des sept prochains dîners`} preserveAspectRatio="none">
      <path className="trend-guide" d="M4 31H116" />
      <polyline points={points} />
      <circle cx="4" cy={points.split(" ")[0]?.split(",")[1] ?? "31"} r="2.4" />
      <circle cx="116" cy={points.split(" ").at(-1)?.split(",")[1] ?? "31"} r="2.4" />
    </svg>
  );
}
