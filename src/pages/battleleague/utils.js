export const getBattleLeaguePoints = (resultCount, index, isFinished) => {
  if (!isFinished || resultCount <= 0) {
    return 0;
  }
  const peopleBeaten = Math.max(resultCount - 1 - index, 0);
  return peopleBeaten + 1 + (index === 0 ? 1 : 0);
};

export const getFilteredBattleLeagueBattles = ({
  battles,
  whitelist,
  overrides,
  pointSystem,
}) => {
  if (!battles) {
    return [];
  }

  const dnfPlayerIndexes = new Set();
  const generatedKuskiNameMap = new Map();
  const realKuskiIndexByName = new Map();

  battles.forEach(battle => {
    (battle.BattleData?.Results || []).forEach(result => {
      if (
        result.KuskiData?.Kuski &&
        result.KuskiIndex &&
        !realKuskiIndexByName.has(result.KuskiData.Kuski)
      ) {
        realKuskiIndexByName.set(result.KuskiData.Kuski, result.KuskiIndex);
      }
    });
  });

  return battles.map(battle => {
    if (!battle.BattleData?.Results) {
      return battle;
    }

    let filteredResults = battle.BattleData.Results;

    if (whitelist.length > 0) {
      filteredResults = filteredResults.filter(result =>
        whitelist.includes(result.KuskiIndex),
      );
    }

    const battleOverrides = Array.isArray(
      overrides?.[String(battle.BattleLeagueBattleIndex)],
    )
      ? overrides[String(battle.BattleLeagueBattleIndex)]
      : [];

    battleOverrides.forEach(override => {
      if (override?.Time === undefined) {
        return;
      }

      const existing = filteredResults.find(
        result =>
          result.KuskiIndex === override.KuskiIndex ||
          result.KuskiData?.Kuski === override.Kuski,
      );
      const shouldGenerateKuskiIndex = !override.KuskiIndex;
      const existingGeneratedKuskiIndex = generatedKuskiNameMap.get(
        override.Kuski,
      );
      const knownRealKuskiIndex = realKuskiIndexByName.get(override.Kuski);
      const generatedKuskiIndex = shouldGenerateKuskiIndex
        ? existingGeneratedKuskiIndex ||
          knownRealKuskiIndex ||
          Number(
            `${battle.BattleLeagueBattleIndex}${generatedKuskiNameMap.size + 1}`,
          )
        : null;
      const resolvedKuskiIndex = shouldGenerateKuskiIndex
        ? generatedKuskiIndex
        : override.KuskiIndex;

      if (shouldGenerateKuskiIndex && generatedKuskiIndex) {
        generatedKuskiNameMap.set(override.Kuski, generatedKuskiIndex);
      }

      if (existing) {
        filteredResults = filteredResults.map(result =>
          result.KuskiIndex === override.KuskiIndex ||
          result.KuskiData?.Kuski === override.Kuski
            ? {
                ...result,
                Time: override.DNF ? 0 : override.Time,
                Apples: override.DNF ? 0 : result.Apples,
                DNF: override.DNF,
              }
            : result,
        );
      } else {
        filteredResults = [
          ...filteredResults,
          {
            KuskiIndex: resolvedKuskiIndex,
            Time: override.DNF ? 0 : override.Time,
            Apples: 0,
            DNF: override.DNF,
            KuskiData: {
              KuskiIndex: resolvedKuskiIndex,
              Kuski: override.Kuski,
            },
          },
        ];
      }
    });

    if (pointSystem === 3) {
      filteredResults = filteredResults.map(result => {
        const isDnfResult = Boolean(result.DNF) || Number(result.Time) === 0;

        if (dnfPlayerIndexes.has(result.KuskiIndex)) {
          return {
            ...result,
            DNF: true,
            Time: 0,
            Apples: 0,
          };
        }

        if (isDnfResult) {
          dnfPlayerIndexes.add(result.KuskiIndex);
          return { ...result, DNF: true, Time: 0, Apples: 0 };
        }

        return result;
      });
    }

    return {
      ...battle,
      BattleData: {
        ...battle.BattleData,
        Results: filteredResults,
      },
    };
  });
};
