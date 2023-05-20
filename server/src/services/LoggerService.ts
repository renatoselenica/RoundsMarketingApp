import { FastifyBaseLogger } from "fastify";

class Logger {
  private static instance: FastifyBaseLogger;
  constructor(logger: FastifyBaseLogger) {
    Logger.instance = logger;
  }

  public static getInstance(): FastifyBaseLogger {
    if (!Logger.instance) {
      throw new Error("Logger not initialized");
    }
    return Logger.instance;
  }
}

export default Logger;
