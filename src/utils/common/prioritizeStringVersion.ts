export function prioritizeStringVersion(
  formData: Record<string, any>
): Record<string, any> {
  const keyToFix = ["Ajouter_les_frais_d_inscription_", "Cr_er_une_2e_demande"];
  const cleaned: Record<string, any> = { ...formData };

  for (const key of keyToFix) {
    const value = formData[key];
    if (Array.isArray(value)) {
      const firstString = value.find((v) => typeof v === "string");
      if (firstString) {
        cleaned[key] = firstString;
      }
    }
  }
  return cleaned;
}
