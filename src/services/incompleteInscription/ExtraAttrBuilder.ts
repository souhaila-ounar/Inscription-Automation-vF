import { getcreatedBy } from "../../utils/common/getCreatedBy";
import { getNoteFieldName } from "../../utils/common/noteFieldName";
import { convertDate } from "../../utils/incompleteRegistration/formatRDVDate";

export class ExtraAttrBuilder {
  constructor(
    private formData: Record<string, any>,
    private existingClient: any = {},
    private isNewClient: boolean
  ) {}

  async build(): Promise<Record<string, string>> {
    const attrs: Record<string, string> = {};
    const branchName = this.formData.branch;
    const noteField = getNoteFieldName(branchName);
    const oldNote =
      this.existingClient.extra_attrs
        ?.find((a: any) => a.machine_name === noteField)
        ?.value?.trim() || "";

    const newNote = (this.formData.note_de_suivi || "").trim();
    let incompleteNote = this.formData.note || "";
    const regex = /(?=\b(?:[A-ZÉÈÀÇ][a-zéèàç]+\s)*[A-ZÉÈÀÇ][a-zéèàç]+\s*:\s)/g;

    incompleteNote = incompleteNote
      .split(regex)
      .map((s: string) => s.trim())
      .filter(Boolean);

    const createdBy = await getcreatedBy(this.formData);
    const incompleteSection = incompleteNote
      ? `—\nCe client n’a pas complété son inscription. Voici les données saisies par ${createdBy} :\n${incompleteNote}`
      : "";

    const finalNote = [newNote, incompleteSection, oldNote]
      .filter(Boolean)
      .join("\n\n");

    if (finalNote) {
      attrs[noteField] = finalNote;
    }

    const gender = this.formData.title_new || this.formData.title || "";
    if (gender) {
      attrs["client_gender"] = gender.toLowerCase();
    }

    const lang = this.formData.langue_du_client?.toLowerCase() || "";
    attrs["langue_de_communication"] = lang.includes("an")
      ? "anglais"
      : "francais";

    if (this.formData.pris_de_rdv === "Oui" && this.formData.date_rdv) {
      const rdvIso = convertDate(this.formData.date_rdv);
      attrs["client_mobile_appointment"] = rdvIso;
    }
    return attrs;
  }
}
