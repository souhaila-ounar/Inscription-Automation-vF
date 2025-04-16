import { getClient, createClient } from "../clientStudentService";
import { LabelHandler } from "./LabelHandler";
import { ExtraAttrBuilder } from "./ExtraAttrBuilder";
import { getBranchPipelineConstants } from "../../constants/incomplete.constants";
import { TutorCruncherClient } from "../../clients/client";
import { SmsSender } from "./SmsHandler";
import { removeLabelsFromClient } from "../../utils/incompleteRegistration/removeLabelsFromClient";

export class IncompleteInscriptionProcessor {
  constructor(
    private formData: Record<string, any>,
    private branchId: number
  ) {}

  async process() {
    const branchValues = getBranchPipelineConstants(this.branchId);
    console.log("branchValues", branchValues);
    const tc = new TutorCruncherClient(this.branchId);
    const labelHandler = new LabelHandler(this.branchId);
    const smsSender = new SmsSender(this.formData, this.branchId);
    let client: any;
    let isNewClient = false;

    //------ client exist ---
    if (this.formData.client_id && this.formData.client_id.trim() !== "") {
      console.log("client exist.");
      const existingClient = await getClient(
        this.branchId,
        this.formData.client_id
      );
      if (!existingClient) throw new Error("Client not found");

      client = {
        id: existingClient.id,
        first_name: existingClient.user?.first_name,
        last_name: existingClient.user?.last_name,
        email: existingClient.user?.email,
        mobile: existingClient.user?.mobile,
        extra_attrs: existingClient.extra_attrs || [],
        labels: existingClient.labels || [],
        title: this.formData.title_new || this.formData.title || "",
      };
      await removeLabelsFromClient(client.labels, client.id, this.branchId);
    } else {
      //----------- new client ------
      console.log("new client");
      isNewClient = true;
      const payload = {
        first_name: this.formData.names?.first_name,
        last_name: this.formData.names?.last_name,
        email: this.formData.client_email,
        mobile: this.formData.phone,
        status: "prospect",
        extra_attrs: await new ExtraAttrBuilder(
          this.formData,
          {},
          true
        ).build(),
      };
      const created = await createClient(this.branchId, payload);
      client = {
        id: created?.role?.id,
        first_name: created?.role?.user?.first_name,
        last_name: created?.role?.user?.last_name,
        email: created?.role?.user?.email,
        mobile: created?.role?.user?.mobile,
        extra_attrs: created?.role?.user?.extra_attrs || [],
        labels: [],
        title: this.formData.title || this.formData.title_new || "",
      };
    }

    const reason = this.formData.raison_non_finalisee?.toLowerCase() || "";
    if (reason.includes("message vocal")) {
      console.log("voice email : MBV");
      await labelHandler.handleVoicemail(
        client,
        branchValues,
        this.formData,
        isNewClient
      );
      await smsSender.sendFollowupSMS(client, isNewClient);
    } else {
      console.log("Info données");
      await labelHandler.handleProvidedInfo(
        client,
        branchValues,
        this.formData,
        isNewClient
      );
    }

    return client;
  }
}
