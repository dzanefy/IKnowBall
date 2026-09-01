type StatusBadgeProps = {
  status: string;
};

const statusStyles: Record<string, string> = {
  Upcoming: "border-orange-400/30 bg-orange-400/10 text-orange-300",
  Live: "border-teal-400/30 bg-teal-400/10 text-teal-300",
  Finished: "border-lime-400/30 bg-lime-400/10 text-lime-300",
  Postponed: "border-yellow-400/30 bg-yellow-400/10 text-yellow-300",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const label =
    status === "TIMED" || status === "SCHEDULED"
      ? "Upcoming"
      : status === "IN_PLAY"
        ? "Live"
        : status === "FINISHED"
          ? "Finished"
          : status === "POSTPONED"
            ? "Postponed"
            : status.replaceAll("_", " ");

  const style =
    statusStyles[label] ?? "border-slate-700 bg-slate-800 text-slate-300";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase ${style}`}
    >
      ● {label}
    </span>
  );
}