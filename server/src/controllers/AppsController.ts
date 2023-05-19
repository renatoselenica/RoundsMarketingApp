import { FastifyReply, FastifyRequest } from "fastify";
import { URL } from "url";
import { IAddApp, IGetApp } from "../interfaces/IAddApp";
import { screenshot } from "../services/PuppeteerService";
import AppPackageRepository from "../repositories/AppPackageRepository";

async function getApps(request: FastifyRequest, reply: FastifyReply) {
  try {
    const apps = await AppPackageRepository.findAppsWithScreenshotNumber();
    reply.status(200);
    reply.send({ success: true, message: 'Apps retrieved successfully', data: apps });
  } catch (err) {
    request.log.error({ err }, "An error has happened");
    reply.status(500);
    reply.send({ success: false, message: 'There was an error with adding the package' });
  }
}

async function getApp(request: FastifyRequest<{ Params: IGetApp }>, reply: FastifyReply) {
  const { packageName } = request.params;
  try {
    const app = await AppPackageRepository.findAppWithScreenshots(packageName);
    reply.status(200);
    reply.send({ success: true, message: 'Package retrieved successfully', data: app });
  } catch (err) {
    request.log.error({ err }, "An error has happened");
    reply.status(500);
    reply.send({ success: false, message: 'There was an error with adding the package' });
  }
}

async function addApp(request: FastifyRequest<{ Body: IAddApp }>, reply: FastifyReply) {
  const packageUrl = request.body.packageUrl;
  // TODO: validation
  const packageName = new URL(packageUrl).searchParams.get("id") as string;
  if (!packageName) {
    reply.status(200);
    reply.send({ message: "Google play link must contain an ID" })
  }

  try {
    await AppPackageRepository.insertApp(packageName, packageUrl);
    reply.status(200);
    reply.send({ success: true, message: 'Package added successfully' });
  } catch (err) {
    request.log.error({ err }, "An error has happened");
    reply.status(500);
    reply.send({ success: false, message: 'There was an error with adding the package' });
  }
}

async function createScreenshot(request: FastifyRequest<{ Body: IGetApp }>, reply: FastifyReply) {
  const packageName = request.body.packageName;
  // TODO: validation
  if (!packageName) {
    reply.status(200);
    reply.send({ message: "Package Name is obligatory" })
  }

  try {
    const appPackage = await AppPackageRepository.findAppByPackageName(packageName);
    if (!appPackage) {
      throw new Error('package does not exist');
    }
    await screenshot(appPackage.packageUrl, appPackage.packageName);
    reply.status(200);
    reply.send({ success: true, message: 'Screenshot added successfully' });
  } catch (err) {
    request.log.error({ err }, "An error has happened");
    reply.status(500);
    reply.send({ success: false, message: 'There was an error with creating the screenshot' });
  }
}

export default {
  getApps,
  getApp,
  addApp,
  createScreenshot
}
