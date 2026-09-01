import Link from "next/link";
import AppHeader from "@/components/AppHeader";

const sections = [
  {
    title: "What iKnowBall does",
    text: "iKnowBall turns football data into simple, explainable match forecasts. It helps you compare fixtures, recent form and possible outcomes in one place.",
  },
  {
    title: "What we take into account",
    text: "The baseline considers recent completed results, goals scored, goals conceded, whether a team is playing at home or away, and a small home-advantage adjustment.",
  },
  {
    title: "How to read the forecast",
    text: "The predicted score is the single most likely exact scoreline. The home, draw and away percentages combine many possible scorelines into three overall outcomes.",
  },
  {
    title: "What the percentages mean",
    text: "A percentage is a probability, not a promise. If a team has a 44% chance of winning, that is the strongest outcome in the model, but the match can still finish differently.",
  },
  {
    title: "Why forecasts change",
    text: "When new matches finish, the latest results become part of the historical data. Future forecasts can therefore change as the season progresses.",
  },
  {
    title: "A useful limitation",
    text: "Football is unpredictable. The current baseline does not yet include every possible factor, such as confirmed lineups, injuries, tactics or late team news.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <AppHeader />

      <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-lime-400">
            The iKnowBall approach
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">
            How it works
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            A clear guide to our forecasts, the statistics behind them and how
            to interpret the numbers.
          </p>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {sections.map((section, index) => (
              <section
                key={section.title}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <p className="text-sm font-semibold text-teal-300">
                  0{index + 1}
                </p>
                <h2 className="mt-4 text-2xl font-semibold">
                  {section.title}
                </h2>
                <p className="mt-3 leading-7 text-slate-400">
                  {section.text}
                </p>
              </section>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-lime-400/20 bg-lime-400/5 p-6">
            <h2 className="text-2xl font-semibold">Keep it in perspective</h2>
            <p className="mt-3 leading-7 text-slate-400">
              Our forecasts are designed to support football discussion and
              comparison. They are not betting advice and cannot predict every
              moment of a match.
            </p>
          </div>

          <Link
            href="/"
            className="mt-8 inline-flex text-sm font-semibold text-lime-400 transition hover:text-lime-300"
          >
            ← Back to fixtures
          </Link>
        </div>
      </main>
    </>
  );
}
