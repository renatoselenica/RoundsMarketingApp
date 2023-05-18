import puppeteer from 'puppeteer';
import * as path from "path";
import AppPackageRepository from '../repositories/AppPackageRepository';

export async function screenshot(packageUrl: string, packageName: string): Promise<void> {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(packageUrl);

  try {
    const fileName = `${packageName}-${Date.now()}.jpeg`;
    const imagePath = path.join(__dirname, `../../public/screenshots/${fileName}`);
    // Capture screenshot and save it in the current folder:
    await page.screenshot({
      type: "jpeg",
      path: imagePath,
    });

    await AppPackageRepository.insertScreenshot(packageName, `screenshots/${fileName}`);
  } catch (err) {
    console.log(`Error on puppeteer service: ${err}`);
  } finally {
    await browser.close();
  }
}
