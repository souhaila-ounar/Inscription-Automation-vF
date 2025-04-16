import { SupabaseClient } from "../../clients/supabase.client";

export async function getcreatedBy(
  formData: Record<string, any>
): Promise<string> {
  if (formData?.adminName && formData?.adminName.trim !== "") {
    return formData.adminName.trim();
  }

  const sellerID = formData.sellerID;
  if (!sellerID) return "Inconnu";
  const supabase = new SupabaseClient("tutorax");
  const conseillerId = formData?.sellerID;
  const conseillerData = await supabase.getByFilter("client_managers", {
    client_manager_id: conseillerId,
  });
  const conseillerName = conseillerData?.[0]?.name?.trim();
  return conseillerName || "Inconnu";
}
