import {
  createClient,
  updateClient,
  createStudent,
  getClient,
} from "../clientStudentService";
import { FormatGenderAndSchool } from "../../utils/common/handleGenderAndSchool";
import { getFormattedDateTimeCanada } from "../../utils/common/date.utils";
import { getNoteFieldName } from "../../utils/common/noteFieldName";
import { findStudentIdFromClientRecipients } from "../../utils/common/getStudentIdFromClient";

export class ClientAndStudentProcessor {
  constructor(
    private formData: Record<string, any>,
    private branchId: number
  ) {}

  async process() {
    const clientData = await this.processClient();
    const studentId = await this.processStudent(clientData.clientId);
    return { ...clientData, studentId };
  }

  // --- handle client
  private async processClient() {
    const {
      client_id,
      nom_parent,
      phone_1,
      phone_2,
      user_email,
      address_client,
      contact_address,
    } = this.formData;
    const parentPhone = phone_2 || "";
    const adresse = address_client || {};
    const note = this.buildNote();
    const langue = this.getLangue();
    const gender = this.getClientGender();

    const payload: any = {
      first_name: nom_parent?.first_name,
      last_name: nom_parent?.last_name,
      email: user_email,
      mobile: phone_1,
      phone: parentPhone,
      status: "live",
      send_emails: true,
    };

    if (!contact_address) {
      Object.assign(payload, {
        street: adresse.address_line_1,
        town: adresse.city,
        postcode: adresse.zip,
      });
    }

    if (!client_id) {
      payload.extra_attrs = {
        notes: note,
        langue_de_communication: langue,
        client_gender: gender,
        signup_origin: "assisted-enrollment",
        organisation_school: "false",
        credit_card_info: "false",
        credit_card_count: "0",
      };
      const createdClient = await createClient(this.branchId, payload);
      return {
        clientId: createdClient?.role?.id,
        clientAdresse: createdClient?.role?.user?.street,
        clientCity: createdClient?.role?.user?.town,
      };
    } else {
      const existingClient = await getClient(this.branchId, client_id);
      const noteField = getNoteFieldName(this.formData.branch);
      const oldNote =
        existingClient?.extra_attrs
          ?.find((attr: any) => attr.machine_name === noteField)
          ?.value?.trim() || "";

      payload.extra_attrs = {
        [noteField]: [note, oldNote].filter(Boolean).join("\n\n"),
        langue_de_communication: langue,
        client_gender: gender,
      };

      const updatedClient = await updateClient(this.branchId, {
        ...payload,
        id: parseInt(client_id),
      });

      return {
        clientId: updatedClient?.role?.id,
        clientAdresse: updatedClient?.role?.user?.street,
        clientCity: updatedClient?.role?.user?.town,
      };
    }
  }

  // -- handle Student ----
  private async processStudent(clientId: number) {
    const { recipient_hidden, fisrt_name, last_name, address_client } =
      this.formData;
    const isNew =
      !recipient_hidden || recipient_hidden.toLowerCase() === "new_student";
    const studentAttrs = FormatGenderAndSchool({
      branch: this.formData.branch,
      genre: this.formData.genre_eleve,
      nomEcolePS: this.formData.nom_ecole_eleve,
      nomEcoleCegep: this.formData.nom_ecole_cegep,
      nomEcoleUni: this.formData.nom_ecole_uni,
      autreEcole: this.formData.autre_ecole,
    });

    if (isNew) {
      const payload = {
        first_name: fisrt_name,
        last_name: last_name,
        paying_client: clientId,
        ...address_client,
        extra_attrs: studentAttrs,
      };
      const student = await createStudent(this.branchId, payload);
      return student?.role?.id;
    } else {
      const studentId = await findStudentIdFromClientRecipients(
        this.branchId,
        clientId.toString(),
        recipient_hidden
      );
      if (!studentId)
        throw new Error("Étudiant introuvable dans les recipients.");
      return studentId;
    }
  }

  private buildNote() {
    const notes = [];
    if (this.formData.Ajouter_les_frais_d_inscription_) {
      notes.push(
        `[${getFormattedDateTimeCanada("fr")}]\nFrais d'inscription générés.`
      );
    }
    if (this.formData.notes_de_gestion_client) {
      notes.push(this.formData.notes_de_gestion_client.trim());
    }
    return notes.join("\n");
  }

  private getLangue() {
    const langue = this.formData.langue_client?.toLowerCase() || "";
    return langue.includes("fr") ? "francais" : "anglais";
  }

  private getClientGender() {
    const gender = this.formData.title?.toLowerCase() || "madame";
    return gender.includes("madame") ? gender : "monsieur";
  }
}
