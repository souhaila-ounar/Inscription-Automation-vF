import { SupabaseClient } from "../../clients/supabase.client";
import { DialpadClient } from "../../clients/Dialpad.client";
import { fillTemplate } from "../../utils/incompleteRegistration/fillTemplate";
import { smsTemplates } from "../../utils/incompleteRegistration/smsTemplates";

export class SmsSender {
  constructor(
    private formData: Record<string, any>,
    private branchId: number
  ) {}

  private getLanguage(): "francais" | "anglais" {
    const lang = this.formData.langue_du_client?.toLowerCase() || "";
    return lang.includes("an") ? "anglais" : "francais";
  }

  async sendFollowupSMS(client: any, isNewClient: boolean) {
    const reason = this.formData.raison_non_finalisee?.toLowerCase() || "";
    if (!reason.includes("message vocal")) return;

    const supabase = new SupabaseClient("tutorax");
    const dialpad = new DialpadClient();

    const conseillerId = this.formData.sellerID;
    const conseillerData = await supabase.getByFilter("client_managers", {
      client_manager_id: conseillerId,
    });

    const conseiller = conseillerData?.[0];
    if (!conseiller) {
      console.warn("Conseiller introuvable, SMS non envoyé.");
      return;
    }

    const clientLang = this.getLanguage();
    const clientPhone = client.mobile || this.formData.phone || "";

    const isFemale = conseiller.gender?.toLowerCase() === "female";
    const conseillerGenderFr = isFemale ? "conseillère" : "conseiller";
    const conseillerGenderEn = "educational advisor";
    const conseillerGender =
      clientLang === "anglais" ? conseillerGenderEn : conseillerGenderFr;

    let templateType: "WITH_RDV" | "WITHOUT_RDV" = "WITHOUT_RDV";

    if (!isNewClient) {
      const rdvValue = client.extra_attrs?.find(
        (a: any) => a.machine_name === "client_mobile_appointment"
      )?.value;

      if (rdvValue) {
        const rdvDate = new Date(rdvValue);
        const today = new Date();

        const isSameDay =
          rdvDate.getFullYear() === today.getFullYear() &&
          rdvDate.getMonth() === today.getMonth() &&
          rdvDate.getDate() === today.getDate();

        if (isSameDay) templateType = "WITH_RDV";
      }
    }
    const rawtitle = this.formData.title_new || this.formData.title || "";
    let politeTitle = rawtitle;
    if (clientLang == "anglais") {
      if (rawtitle.toLowerCase().includes("madame")) {
        politeTitle = "Madam";
      } else if (rawtitle.toLowerCase().includes("monsieur")) {
        politeTitle = "Sir";
      }
    }
    const message = fillTemplate(smsTemplates[templateType][clientLang], {
      title: politeTitle,
      lastName: client.last_name || "",
      firstName: conseiller.name || "",
      role: conseiller.formatedText || conseillerGender,
    });

    if (!clientPhone) {
      console.warn("Numéro de téléphone du client manquant, SMS non envoyé.");
      return;
    }

    await dialpad.sendSMS(
      clientPhone,
      message,
      "6042183362478080",
      "4934377748054016",
      "callcenter"
    );

    console.log("SMS envoyé !");
  }
}
