import puppeteer from 'puppeteer';

export async function screenshot(url: string, path: string): Promise<void> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(url);

  try {
    // Capture screenshot and save it in the current folder:
    await page.screenshot({
      path: `../../screenshots/${path}.jpg`
    });

  } catch (err) {
    console.log(`Error on puppeteer service: ${err}`);
  } finally {
    await browser.close();
    console.log(`Screenshot has been captured successfully`);
  }
}
