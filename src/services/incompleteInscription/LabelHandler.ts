import { updateClient } from "../clientStudentService";
import { ResourceType } from "../../enums/tc-resource-type.enums";
import { TutorCruncherClient } from "../../clients/client";
import { ExtraAttrBuilder } from "./ExtraAttrBuilder";
import { formatFrenchRDVDisplay } from "../../utils/incompleteRegistration/formaDisplayRDV";

export class LabelHandler {
  constructor(private branchId: number) {}

  //-------- MBV case -------------
  async handleVoicemail(
    client: any,
    branchValues: any,
    formData: Record<string, any>,
    isNewClient: boolean
  ) {
    const tc = new TutorCruncherClient(this.branchId);
    const builder = new ExtraAttrBuilder(formData, client, isNewClient);
    const extraAttrs = await builder.build();
    //addd label to client
    await tc.addLabelToResource(
      ResourceType.CLIENTS,
      client.id,
      branchValues.MBV_LABEL_ID
    );
    console.log("addLabelToResource : label added !");
    // move client to MBV
    await updateClient(this.branchId, {
      id: client.id,
      first_name: client.first_name,
      last_name: client.last_name,
      email: client.email,
      pipeline_stage: branchValues.PIPELINE_STAGE_MBV,
      extra_attrs: extraAttrs,
    });

    console.log("client updated !");
  }

  //---- info données case : -----------
  async handleProvidedInfo(
    client: any,
    branchValues: any,
    formData: Record<string, any>,
    isNewClient: boolean
  ) {
    const hasRDV = formData.pris_de_rdv === "Oui";
    const labelId = formData.label;
    const tc = new TutorCruncherClient(this.branchId);

    const rdvDate = formData.date_rdv?.trim() || "";
    const dateLabel = hasRDV && rdvDate ? formatFrenchRDVDisplay(rdvDate) : "";
    const firstNameWithDate = dateLabel
      ? `${dateLabel} ${client.first_name}`
      : client.first_name;

    const builder = new ExtraAttrBuilder(formData, client, isNewClient);
    const extraAttrs = await builder.build();

    await tc.addLabelToResource(ResourceType.CLIENTS, client.id, labelId);
    console.log("label added!");

    await updateClient(this.branchId, {
      id: client.id,
      first_name: firstNameWithDate,
      last_name: client.last_name,
      email: client.email,
      pipeline_stage: hasRDV
        ? branchValues.PIPELINE_STAGE_RAPPELER
        : branchValues.PIPELINE_STAGE_INFO_DONNEE,
      extra_attrs: extraAttrs,
    });

    console.log("client updated!");
  }
}
