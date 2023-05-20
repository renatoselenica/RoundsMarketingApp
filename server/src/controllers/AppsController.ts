import { FastifyReply, FastifyRequest } from "fastify";
import { URL } from "url";
import { IAddApp, IGetApp } from "../types/interfaces";
import { screenshot } from "../services/PuppeteerService";
import AppPackageRepository from "../repositories/AppPackageRepository";
import validateUrl from "../utils/validateUrl";

async function getApps(_request: FastifyRequest, reply: FastifyReply) {
  const apps = await AppPackageRepository.findAppsWithScreenshotNumber();
  reply.send({ success: true, message: 'Apps retrieved successfully', data: apps });
}

async function getApp(request: FastifyRequest<{ Querystring: IGetApp }>, reply: FastifyReply) {
  const { packageName } = request.query;
  const app = await AppPackageRepository.findAppWithScreenshots(packageName);

  if (!app) {
    reply.notFound('Package not found');
  }
  reply.send({ success: true, message: 'Package retrieved successfully', data: app });
}

async function addApp(request: FastifyRequest<{ Body: IAddApp }>, reply: FastifyReply) {
  const packageUrl = request.body.packageUrl;
  if (!validateUrl(packageUrl)) {
    reply.notAcceptable('Package url is not valid');
  }

  const packageName = new URL(packageUrl).searchParams.get("id") as string;
  await AppPackageRepository.insertApp(packageName, packageUrl);
  reply.send({ success: true, message: 'Package added successfully' });
}

async function createScreenshot(request: FastifyRequest<{ Body: IGetApp }>, reply: FastifyReply) {
  const packageName = request.body.packageName;
  const appPackage = await AppPackageRepository.findAppByPackageName(packageName);

  if (!appPackage) {
    reply.notFound('Package not found');
    return;
  }
  await screenshot(appPackage.packageUrl, appPackage.packageName);
  reply.send({ success: true, message: 'Screenshot added successfully' });
}


export default {
  getApps,
  getApp,
  addApp,
  createScreenshot
}
