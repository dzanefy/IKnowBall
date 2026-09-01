import ClubBadge from "@/components/ClubBadge";

type ClubCardProps = {
  name: string;
  crest?: string;
  align?: "left" | "right";
  badgeSize?: "small" | "large";
  form?: FormResult[];
};

export type FormResult = "W" | "D" | "L";
export type FormEntry = {
  fixtureId: number;
  date: string;
  result: FormResult;
};

export default function ClubCard({
  name,
  crest,
  align = "left",
  badgeSize = "small",
  form,
}: ClubCardProps) {
  return (
    <div
      className={`flex min-w-0 items-center gap-3 ${
        align === "right" ? "flex-row-reverse text-right" : ""
      }`}
    >
      <ClubBadge name={name} crest={crest} size={badgeSize} />

      <div className="min-w-0">
        <span className="block break-words font-semibold">{name}</span>

        {form && form.length > 0 && (
          <div
            className={`mt-2 flex gap-1 ${
              align === "right" ? "justify-end" : "justify-start"
            }`}
            aria-label={`${name} recent form`}
          >
            {form.map((result, index) => (
              <span
                key={`${result}-${index}`}
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                  result === "W"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : result === "D"
                      ? "bg-violet-500/20 text-violet-300"
                      : "bg-rose-500/20 text-rose-300"
                }`}
              >
                {result}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
