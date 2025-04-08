import { Request, Response, NextFunction } from "express";
import { config } from "../config";
export const validateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("token ")) {
    res.status(401).json({
      status: "error",
      message: "Authorization header missing or invalid format",
    });
    return;
  }

  const apiKey = authHeader.split(" ")[1];

  console.log("config.apiKeys.ourApp", config.apiKeys.ourApp);
  if (apiKey !== config.apiKeys.ourApp) {
    res.status(401).json({
      status: "error",
      message: "Invalid API key",
    });
    return;
  }

  next();
};
