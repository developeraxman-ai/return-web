export function MetricCard({
  label,
  value,
  detail
}: {
  label: string;
  value: string | number;
  detail?: string;
}) {
  return (
    <div className="card">
      <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-2 text-3xl font-black text-zinc-50">{value}</div>
      {detail ? <div className="mt-2 text-sm text-zinc-400">{detail}</div> : null}
    </div>
  );
}
