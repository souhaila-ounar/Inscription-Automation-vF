import dotenv from "dotenv";
dotenv.config();

export const config = {
  urlBaseTC: process.env.URL_BASE_TC!,
  dialpad: {
    apiKey: process.env.DIALPAD_API_KEY,
    baseUrl: "https://dialpad.com/api/v2/",
  },
  apiKeys: {
    openAI: process.env.OPENAI_KEY || "",
    deepSeek: process.env.DEEPSEEK_KEY || "",
    ourApp: process.env.API_KEY || "12345678",
    asana: process.env.ASANA_KEY || "",
  },
  endpoints: {
    jumelage: process.env.PABBLY_ENDPOINT_JUMELAGE || "",
    creditCard: process.env.PABBLY_ENDPOINT_CREDIT_CARD || "",
    addLabelInHome: process.env.PABBLY_ENDPOINT_ADD_LABEL_INHOME || "",
    kpis: process.env.KPIS_URL || "",
  },
  supabaseConfig: {
    key: process.env.SUPABASE_KEY!,
    baseUrl: process.env.SUPABASE_URL!,
  },
  smtp: {
    host: process.env.SMTP_HOST || "smtp.example.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USERNAME || "",
      pass: process.env.SMTP_PASSWORD || "",
    },
  },
  branchTokens: {
    3268: process.env.TOKEN_TUTORAX_TUTORAT || "",
    7673: process.env.TOKEN_TUTORAX_CANADA || "",
    8427: process.env.TOKEN_TUTORAX_ORTHOPEDAGOGIE || "",
    15751: process.env.TOKEN_TUTORAX_USA || "",
    14409: process.env.TOKEN_TUTORAX_ORTHOPHONIE || "",
    5737: process.env.TOKEN_TUTORAX_STIMULATION || "",
    3269: process.env.TOKEN_TUTORAX_ADMIN || "",
  },
};
