function factorial(value: number) {
  let result = 1;

  for (let number = 2; number <= value; number += 1) {
    result *= number;
  }

  return result;
}

export function poissonProbability(
  goals: number,
  expectedGoals: number
) {
  return (
    Math.exp(-expectedGoals) *
    Math.pow(expectedGoals, goals) /
    factorial(goals)
  );
}


export type ScorelineProbability = {
  homeGoals: number;
  awayGoals: number;
  probability: number;
};

export function calculateScorelines(
  homeExpectedGoals: number,
  awayExpectedGoals: number,
  maxGoals = 5
): ScorelineProbability[] {
  const scorelines: ScorelineProbability[] = [];

  for (let homeGoals = 0; homeGoals <= maxGoals; homeGoals += 1) {
    for (let awayGoals = 0; awayGoals <= maxGoals; awayGoals += 1) {
      const homeProbability = poissonProbability(
        homeGoals,
        homeExpectedGoals
      );

      const awayProbability = poissonProbability(
        awayGoals,
        awayExpectedGoals
      );

      scorelines.push({
        homeGoals,
        awayGoals,
        probability: homeProbability * awayProbability,
      });
    }
  }

  return scorelines.sort(
    (first, second) => second.probability - first.probability
  );
}

export function summarizeForecast(
  scorelines: ScorelineProbability[]
) {
  let homeWin = 0;
  let draw = 0;
  let awayWin = 0;

  for (const scoreline of scorelines) {
    if (scoreline.homeGoals > scoreline.awayGoals) {
      homeWin += scoreline.probability;
    } else if (scoreline.homeGoals === scoreline.awayGoals) {
      draw += scoreline.probability;
    } else {
      awayWin += scoreline.probability;
    }
  }

  const total = homeWin + draw + awayWin;

return {
  mostLikelyScore: scorelines[0],
  homeWin: homeWin / total,
  draw: draw / total,
  awayWin: awayWin / total,
};
}

export type HistoricalFixture = {
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
};

function average(values: number[]) {
  if (values.length === 0) return 1;

  return values.reduce((total, value) => total + value, 0) / values.length;
}

export function calculateExpectedGoals(
  homeTeam: string,
  awayTeam: string,
  fixtures: HistoricalFixture[]
) {
  const finishedFixtures = fixtures.filter(
    (fixture) =>
      fixture.status === "FINISHED" &&
      fixture.homeScore !== null &&
      fixture.awayScore !== null
  );

  const homeTeamGames = finishedFixtures
    .filter(
      (fixture) =>
        fixture.homeTeam === homeTeam || fixture.awayTeam === homeTeam
    )
    .slice(-5);

  const awayTeamGames = finishedFixtures
    .filter(
      (fixture) =>
        fixture.homeTeam === awayTeam || fixture.awayTeam === awayTeam
    )
    .slice(-5);

  const homeScored = homeTeamGames.map((fixture) =>
    fixture.homeTeam === homeTeam
      ? fixture.homeScore!
      : fixture.awayScore!
  );

  const homeConceded = homeTeamGames.map((fixture) =>
    fixture.homeTeam === homeTeam
      ? fixture.awayScore!
      : fixture.homeScore!
  );

  const awayScored = awayTeamGames.map((fixture) =>
    fixture.homeTeam === awayTeam
      ? fixture.homeScore!
      : fixture.awayScore!
  );

  const awayConceded = awayTeamGames.map((fixture) =>
    fixture.homeTeam === awayTeam
      ? fixture.awayScore!
      : fixture.homeScore!
  );

  return {
    homeExpectedGoals: Math.max(
      0.1,
      (average(homeScored) + average(awayConceded)) / 2 + 0.25
    ),
    awayExpectedGoals: Math.max(
      0.1,
      (average(awayScored) + average(homeConceded)) / 2
    ),
  };
}

export function createForecast(
  homeTeam: string,
  awayTeam: string,
  fixtures: HistoricalFixture[]
) {
  const expectedGoals = calculateExpectedGoals(
    homeTeam,
    awayTeam,
    fixtures
  );

  const scorelines = calculateScorelines(
    expectedGoals.homeExpectedGoals,
    expectedGoals.awayExpectedGoals
  );

  return {
    ...expectedGoals,
    ...summarizeForecast(scorelines),
    modelVersion: "baseline-v1",
    generatedAt: new Date().toISOString(),
  };
}