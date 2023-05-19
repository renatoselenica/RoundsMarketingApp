import { FastifyReply, FastifyRequest } from "fastify";
import { IAddApp, IGetApp } from "../types/interfaces";

function validateGetApp(request: FastifyRequest<{ Querystring: IGetApp }>, reply: FastifyReply, done: () => void) {
  if (!request.query.packageName) {
    reply.status(400);
    reply.send({ success: false, message: 'Package name is required' });
  }
  done();
}

function validateAddApp(request: FastifyRequest<{ Body: IAddApp }>, reply: FastifyReply, done: () => void) {
  const packageUrl = request.body.packageUrl;
  if (!_validateUrl(packageUrl)) {
    reply.status(400);
    reply.send({ success: false, message: 'Package url is not valid' });
  }
  const packageName = new URL(packageUrl).searchParams.get("id") as string;
  if (!packageName) {
    reply.status(200);
    reply.send({ message: "Google play link must contain an ID" })
  }
  done();
}

function validateAddScreenshot(request: FastifyRequest<{ Body: IGetApp }>, reply: FastifyReply, done: () => void) {
  if (!request.body.packageName) {
    reply.status(400);
    reply.send({ success: false, message: 'Package name is required' });
  }
  done();
}

function _validateUrl(url: string) {
  try {
    const urlObj = new URL(url);
    return (
      urlObj.protocol === "https:" &&
      urlObj.hostname === "play.google.com" &&
      urlObj.searchParams.has("id")
    );
  } catch (_) {
    return false;
  }
}

export default {
  validateGetApp,
  validateAddApp,
  validateAddScreenshot
}
