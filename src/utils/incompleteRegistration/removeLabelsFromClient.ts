import { TutorCruncherClient } from "../../clients/client";
import { ResourceType } from "../../enums/tc-resource-type.enums";

//---> supprime les labels commençant par "B", "C" ou "0 - Messagerie vocale" du client

export async function removeLabelsFromClient(
  labels: any[],
  clientId: number,
  branchId: number
) {
  const tc = new TutorCruncherClient(branchId);

  const labelsToRemove = labels.filter(
    (label) =>
      label.name.startsWith("B") ||
      label.name.startsWith("C") ||
      label.name === "0 - Messagerie vocale"
  );

  const removedLabels = await Promise.all(
    labelsToRemove.map(async (label) => {
      try {
        await tc.removeLabelFromResource(
          ResourceType.CLIENTS,
          clientId,
          label.id
        );
        return label.name;
      } catch (err) {
        return null;
      }
    })
  );

  return removedLabels.filter((name) => name);
}
