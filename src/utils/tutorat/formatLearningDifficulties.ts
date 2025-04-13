export function formatLearningDifficulties(
  hasLearningDifficulty: string = "Non",
  difficultiesList?: (string | null | undefined)[] | null,
  otherDifficulty?: unknown
): string {
  if (hasLearningDifficulty === "Non") {
    return "Aucune";
  }

  const cleanedList = Array.isArray(difficultiesList)
    ? difficultiesList.filter(
        (item): item is string =>
          typeof item === "string" && item.toLowerCase() !== "autre(s)"
      )
    : [];

  if (typeof otherDifficulty === "string" && otherDifficulty.trim()) {
    cleanedList.push(otherDifficulty.trim());
  }

  return cleanedList.join(", ");
}
