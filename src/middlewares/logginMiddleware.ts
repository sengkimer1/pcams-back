import { Request, Response, NextFunction } from "express";
import { logger } from "../services/loggerService";
import { maskSensitiveData } from "../utils/maskSensitiveData";

export function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
  const { method, url, headers, body } = req;

  logger.info("Request received", {
    method,
    url,
    headers,
    body: maskSensitiveData(body),
  });

  next();
}