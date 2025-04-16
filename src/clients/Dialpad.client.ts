import axios from "axios";
import { config } from "../config";

export class DialpadClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = config.dialpad.apiKey!;
    this.baseUrl = config.dialpad.baseUrl || "https://dialpad.com/api/v2";
    if (!this.apiKey) {
      throw new Error("Missing Dialpad API key in config.");
    }
  }

  async sendSMS(
    to: string,
    text: string,
    user_id: string,
    sender_group_id: string,
    sender_group_type: string
  ): Promise<void> {
    try {
      const cleanedPhone = to.replace(/\s+/g, "").trim();

      const response = await axios.post(
        `${this.baseUrl}/sms`,
        {
          to_numbers: [cleanedPhone],
          text,
          user_id,
          sender_group_id,
          sender_group_type,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("SMS envoyé avec succès:", response.data);
    } catch (error: any) {
      console.error(
        "Erreur lors de l'envoi du SMS:",
        error.response?.data || error.message
      );
      throw new Error("Échec de l'envoi du SMS");
    }
  }
}
