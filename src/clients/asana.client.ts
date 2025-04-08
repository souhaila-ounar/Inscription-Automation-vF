import axios from "axios";
import { config } from "../config";

const ASANA_BASE_URL = "https://app.asana.com/api/1.0";

export class AsanaClient {
  private headers = {
    Authorization: `Bearer ${config.apiKeys.asana}`,
    "Content-Type": "application/json",
  };

  //----- get task by name ------
  async getTaskByName(workspaceId: string, projectId: string, name: string) {
    const url = `${ASANA_BASE_URL}/${workspaceId}/tasks/search?text=${encodeURIComponent(
      name
    )}&projects.any=${projectId}`;
    const response = await axios.get(url, { headers: this.headers });
    return response.data;
  }

  //----- update task ------

  async updateTask(taskId: string, data: Record<string, any>) {
    const url = `${ASANA_BASE_URL}/tasks/${taskId}`;
    const response = await axios.put(url, { data }, { headers: this.headers });
    return response.data;
  }

  //------------ getTask -----------

  async getTask(taskId: string) {
    const url = `${ASANA_BASE_URL}/tasks/${taskId}`;
    const response = await axios.get(url, { headers: this.headers });
    return response.data;
  }
}
