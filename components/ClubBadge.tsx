import Image from "next/image";

type ClubBadgeProps = {
  name: string;
  crest?: string;
  size?: "small" | "large";
};

function getInitials(name: string) {
  return name
    .replace(/\b(fc|afc)\b/gi, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export default function ClubBadge({
  name,
  crest,
  size = "small",
}: ClubBadgeProps) {
  const dimensions = size === "large" ? 64 : 32;

  return crest ? (
    <Image
      src={crest}
      alt={`${name} crest`}
      width={dimensions}
      height={dimensions}
      className="shrink-0 object-contain"
    />
  ) : (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-slate-700 font-bold text-slate-200 ${
        size === "large" ? "h-16 w-16 text-lg" : "h-8 w-8 text-xs"
      }`}
      aria-label={`${name} badge placeholder`}
    >
      {getInitials(name)}
    </span>
  );
}