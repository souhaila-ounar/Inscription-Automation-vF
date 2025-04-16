import { getClient, createClient, updateClient } from "../clientStudentService";
import { getNoteFieldName } from "../../utils/common/noteFieldName";
import { convertDate } from "../../utils/incompleteRegistration/formatRDVDate";
import { getcreatedBy } from "../../utils/common/getCreatedBy";
export class HandleClient {
  constructor(
    private formData: Record<string, any>,
    private branchId: number
  ) {}

  async processClient(): Promise<any> {
    const clientId = this.formData.client_id?.trim();

    if (clientId) {
      console.log("client exist!");
      const existingClient = await getClient(this.branchId, clientId);
      if (!existingClient) throw new Error("Client not found");

      return {
        id: existingClient.id,
        first_name: existingClient.user?.first_name,
        last_name: existingClient.user?.last_name,
        email: existingClient.user?.email,
        mobile: existingClient.user?.mobile,
        extra_attrs: existingClient.extra_attrs || [],
        labels: existingClient.labels || [],
        title: this.formData.title_new || this.formData.title || "",
        isNew: false,
      };
    } else {
      console.log("new client!");
      const payload = {
        first_name: this.formData.names?.first_name,
        last_name: this.formData.names?.last_name,
        email: this.formData.client_email,
        mobile: this.formData.phone,
        status: "prospect",
        extra_attrs: this.buildExtraAttr({}, true),
      };

      const createdClient = await createClient(this.branchId, payload);
      return {
        id: createdClient?.role?.id,
        first_name: createdClient?.role?.user?.first_name,
        last_name: createdClient?.role?.user?.last_name,
        email: createdClient?.role?.user?.email,
        mobile: createdClient?.role?.user?.mobile,
        extra_attrs: createdClient?.role?.user?.extra_attrs || [],
        labels: [],
        title: createdClient?.role?.user?.title || "",
        isNew: true,
      };
    }
  }

  private async buildExtraAttr(
    client: any,
    isNewClient: boolean
  ): Promise<Record<string, string>> {
    const noteField = getNoteFieldName(this.formData.branch);
    const oldNote =
      client.extra_attrs
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
      ? `—\nLe client n’a pas complété son inscription. Voici les données saisies par ${createdBy} :\n${incompleteNote}`
      : "";

    const finalNote = [newNote, incompleteSection, oldNote]
      .filter(Boolean)
      .join("\n\n");

    const attrs: Record<string, string> = {};
    if (finalNote) {
      attrs[noteField] = finalNote;
    }

    const gender = isNewClient ? this.formData.title_new : client.title;
    if (gender) {
      attrs["client_gender"] = gender.toLowerCase();
    }

    attrs["signup_origin"] = "assisted-enrollment";
    const language = this.getLanguage();
    if (language) {
      attrs["langue_de_communication"] = language;
    }

    if (this.formData.pris_de_rdv === "Oui" && this.formData.date_rdv) {
      attrs["client_mobile_appointment"] = convertDate(this.formData.date_rdv);
    }

    return attrs;
  }

  private getLanguage(): string {
    const lang = this.formData.langue_du_client?.toLowerCase() || "";
    return lang.includes("an") ? "anglais" : "francais";
  }
}
