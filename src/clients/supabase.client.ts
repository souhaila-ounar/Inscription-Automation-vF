import axios, { AxiosInstance } from "axios";
import { config } from "../config"; // adapte ce chemin selon ton projet

export class SupabaseClient {
  private api: AxiosInstance;
  private schema: string;

  constructor(schema = "public") {
    const baseUrl = config.supabaseConfig.baseUrl;
    const anonKey = config.supabaseConfig.key;

    if (!baseUrl || !anonKey) {
      throw new Error("Missing Supabase API credentials in config.");
    }

    this.schema = schema;

    this.api = axios.create({
      baseURL: baseUrl,
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        "Content-Type": "application/json",
        "Accept-Profile": schema,
      },
    });
  }

  async getByFilter(table: string, filters: Record<string, any>) {
    const query = Object.entries(filters)
      .map(([key, val]) => `${key}=eq.${val}`)
      .join("&");

    const response = await this.api.get(`/${table}?${query}`);
    return response.data;
  }
}
