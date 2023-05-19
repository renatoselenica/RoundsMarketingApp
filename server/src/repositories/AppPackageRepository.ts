import { Prisma } from '@prisma/client';
import { db } from '../utils/db.connection';

async function findAppsWithScreenshotNumber() {
  try {
    const apps = await db.package.findMany({
      select: {
        packageName: true,
        _count: {
          select: {
            screenshots: true
          }
        }
      },
    })

    return apps;
  } catch (err) {
    console.log(`Error on findAppsWithScreenshotNumber: ${err}`);
    throw err;
  }
}

async function findAppWithScreenshots(packageName: string) {
  try {
    const app = await db.package.findUnique({
      select: {
        packageName: true,
        packageUrl: true,
        createdAt: true,
        screenshots: {
          select: {
            screenshotPath: true,
            createdAt: true,
          }
        }
      },
      where: {
        packageName: packageName
      }
    })

    return app;
  } catch (err) {
    console.log(`Error on findAppWithScreenshots: ${err}`);
    throw err;
  }
}

async function insertApp(packageName: string, packageUrl: string) {
  try {
    await db.package.create({
      data: {
        packageName: packageName,
        packageUrl: packageUrl,
      }
    })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        console.log('Record with package name already exists');
      }
      console.log(`Error on insertApp: ${err}`)
    }
    throw err;
  }
}

async function findAppByPackageName(packageName: string) {
  try {
    const appPackage = await db.package.findUnique({
      select: {
        packageName: true,
        packageUrl: true,
      },
      where: {
        packageName: packageName
      }
    });
    return appPackage;
  } catch (err) {
    console.log(`Error on findAppByPackageName: ${err}`);
    throw err;
  }
}

async function findAllApps() {
  try {
    const apps = await db.package.findMany({
      select: {
        packageName: true,
        packageUrl: true,
      }
    });
    return apps;
  } catch (err) {
    console.log(`Error on findAppByPackageName: ${err}`);
    throw err;
  }
}

async function insertScreenshot(packageName: string, screenshotPath: string) {
  try {
    await db.screenshot.create({
      data: {
        screenshotPath: screenshotPath,
        packageId: packageName,
      }
    })
  } catch (err) {
    console.log(`Error on insertScreenshot: ${err}`);
    throw err;
  }
}

export default {
  findAppsWithScreenshotNumber,
  findAppWithScreenshots,
  findAppByPackageName,
  findAllApps,
  insertApp,
  insertScreenshot
}
