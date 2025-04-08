const subjectsMap: Record<string, number> = {
  Français: 33161,
  Anglais: 33160,
  Géographie: 33158,
  "Histoire - Primaire à secondaire 4": 33154,
  "Philosophie - Philosophie et rationalité": 33153,
  "Mathématiques - Primaire et Secondaire 1 à 3": 33152,
  "Mathématiques SN (Fort) - Secondaire 4 et 5": 33151,
  "Mathématiques TS (Moyen) - Secondaire 4 et 5": 33150,
  "Mathématiques CST (Faible) - Secondaire 4 et 5": 33149,
  "Mathématiques - Calcul différentiel": 33148,
  "Mathématiques - Calcul intégral": 33147,
  "Mathématiques - Algèbre linéaire et géométrie vectorielle": 33146,
  "Chimie - Secondaire 5": 33145,
  "Chimie - Chimie organique": 33144,
  "Chimie - Chimie des solutions": 33143,
  "Chimie - Chimie générale, la matière": 33142,
  "Physique - Secondaire 5": 33141,
  "Physique - Ondes et physique moderne": 33140,
  "Physique - Électricité et magnétisme": 33139,
  "Physique - Physique électronique": 33138,
  "Mathématiques - Méthodes quantitatives en sciences humaines": 68848,
  "Sciences (STE/SE) - Secondaire 4 (Enrichi)": 68858,
  "Sciences - Primaire à secondaire 2": 68863,
  "Biologie - Évolution et diversité du vivant": 68849,
  Espagnol: 68860,
  "Biologie - Structure et fonctionnement du vivant": 68850,
  "Biologie - Biologie humaine": 68852,
  "Biologie - Intégration en biologie humaine": 68851,
  "Philosophie - L’être humain": 68853,
  "Philosophie - Éthique et politique": 68854,
  "Histoire - Initiation à la civilisation occidentale": 68855,
  "Histoire - Histoire du monde depuis le XVe siècle": 68856,
  "Sciences (ST/ATS) - Secondaire 3-4": 68857,
  "Physique - Mécanique": 57367,
  "Mathématiques - Méthodes quantitatives avancées": 58074,
};
const qualLevels: Record<string, number> = {
  Primaire: 111235,
  Secondaire: 111236,
  Cégep: 111237,
  Université: 111238,
};

const subjectMappingsByLevel: Record<string, Record<string, string>> = {
  Primaire: {
    Français: "Français",
    Anglais: "Anglais",
    Espagnol: "Espagnol",
    Mathématiques: "Mathématiques - Primaire et Secondaire 1 à 3",
    Sciences: "Sciences - Primaire à secondaire 2",
    "Sciences (ST/ATS)": "Sciences (ST/ATS) - Secondaire 3-4",
    Géographie: "Géographie",
    Histoire: "Histoire - Primaire à secondaire 4",
  },
  "Secondaire 1-3": {
    Français: "Français",
    Anglais: "Anglais",
    Espagnol: "Espagnol",
    Mathématiques: "Mathématiques - Primaire et Secondaire 1 à 3",
    "Sciences (ST/ATS)": "Sciences (ST/ATS) - Secondaire 3-4",
    Sciences: "Sciences - Primaire à secondaire 2",
    Géographie: "Géographie",
    Histoire: "Histoire - Primaire à secondaire 4",
  },
  "Secondaire 4-5": {
    Français: "Français",
    Anglais: "Anglais",
    Espagnol: "Espagnol",
    "Mathématiques Régulier (CST)":
      "Mathématiques CST (Faible) - Secondaire 4 et 5",
    "Mathématiques Moyen (TS)": "Mathématiques TS (Moyen) - Secondaire 4 et 5",
    "Mathématiques Enrichi (SN)": "Mathématiques SN (Fort) - Secondaire 4 et 5",
    "Sciences (ST/ATS)": "Sciences (ST/ATS) - Secondaire 3-4",
    "Sciences (STE/SE)": "Sciences (STE/SE) - Secondaire 4 (Enrichi)",
    Physique: "Physique - Secondaire 5",
    Chimie: "Chimie - Secondaire 5",
    Géographie: "Géographie",
    Histoire: "Histoire - Primaire à secondaire 4",
    "Histoire du monde depuis le XVe siècle":
      "Histoire - Histoire du monde depuis le XVe siècle",
    "Initiation à l’histoire de la civilisation occidentale":
      "Histoire - Initiation à la civilisation occidentale",
  },
  Cégep: {
    Français: "Français",
    Anglais: "Anglais",
    "Calcul différentiel": "Mathématiques - Calcul différentiel",
    "Calcul intégral": "Mathématiques - Calcul intégral",
    "Algèbre linéaire et géométrie vectorielle":
      "Mathématiques - Algèbre linéaire et géométrie vectorielle",
    "Méthodes quantitatives en sciences humaines":
      "Mathématiques - Méthodes quantitatives en sciences humaines",
    "Méthodes quantitatives avancées":
      "Mathématiques - Méthodes quantitatives en sciences humaines",
    "Électricité et magnétisme": "Physique - Électricité et magnétisme",
    "Physique mécanique": "Physique - Mécanique",
    "Ondes et physique moderne": "Physique - Ondes et physique moderne",
    "Physique électronique": "Physique - Physique électronique",
    "Chimie des solutions": "Chimie - Chimie des solutions",
    "Chimie générale, la matière": "Chimie - Chimie générale, la matière",
    "Chimie organique": "Chimie - Chimie organique",
    "Biologie humaine": "Biologie - Biologie humaine",
    "Évolution et diversité du vivant":
      "Biologie - Évolution et diversité du vivant",
    "Intégration en biologie humaine":
      "Biologie - Intégration en biologie humaine",
    "Structure et fonctionnement du vivant":
      "Biologie - Structure et fonctionnement du vivant",
    "Éthique et politique": "Philosophie - Éthique et politique",
    "L’être humain": "Philosophie - L’être humain",
    "Philosophie et rationalité": "Philosophie - Philosophie et rationalité",
  },
};

function getNiveau(niveauExact: string): string {
  const lower = niveauExact.toLowerCase();

  if (lower.includes("primaire") || lower.includes("maternelle"))
    return "Primaire";
  if (
    ["secondaire 1", "secondaire 2", "secondaire 3"].some((n) =>
      lower.includes(n)
    )
  )
    return "Secondaire 1-3";
  if (["secondaire 4", "secondaire 5"].some((n) => lower.includes(n)))
    return "Secondaire 4-5";
  if (lower.includes("cégep")) return "Cégep";
  if (lower.includes("université")) return "Université";

  return "";
}

export function getFormattedTeachingSkills(
  rawSubjects: string,
  niveauExact: string
): {
  qual_level: number;
  subjects: { teachingSkill: string; subject: number | null }[];
} {
  const niveau = getNiveau(niveauExact);
  const qual_level =
    qualLevels[
      niveau === "Secondaire 1-3" || niveau === "Secondaire 4-5"
        ? "Secondaire"
        : niveau
    ];

  if (!qual_level) throw new Error("Niveau scolaire non reconnu.");

  const mapping = subjectMappingsByLevel[niveau] || {};
  const subjectArray = rawSubjects.split(",").map((s) => s.trim());

  const result = subjectArray
    .map((subject) => {
      const skillValue = mapping[subject];
      return skillValue
        ? {
            teachingSkill: skillValue,
            subject: subjectsMap[skillValue] ?? null,
          }
        : null;
    })
    .filter(Boolean) as { teachingSkill: string; subject: number | null }[];

  console.log(
    `[mapTeachingSkillsToAPI] Niveau: ${niveau}, Qual: ${qual_level}`,
    result
  );

  return {
    qual_level,
    subjects: result,
  };
}
