import { chromium } from '@playwright/test';
import fs from 'node:fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const executablePath = fs.existsSync(CHROME_PATH) ? CHROME_PATH : EDGE_PATH;
console.log('Using browser at:', executablePath);

async function runVerification() {
  const browser = await chromium.launch({
    executablePath,
    headless: true,
  });

  const consoleErrors = [];

  // 1. Desktop Context
  console.log('--- 1. Testing Desktop Layout (1440x900) ---');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await desktopContext.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.error('Browser Console Error:', msg.text());
    } else {
      console.log('Browser Console:', msg.text());
    }
  });

  console.log('Navigating to http://localhost:5173 ...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });

  // Wait 1 second for Supabase health check & ambient lighting to stabilize
  await page.waitForTimeout(2000);

  // Check Supabase Badge text
  const badgeText = await page.locator('header').first().innerText();
  console.log('Navbar text snippet:', badgeText.replace(/\n+/g, ' '));

  await page.screenshot({ path: 'screenshot_home_kalki.png', fullPage: false });
  console.log('Saved screenshot_home_kalki.png');

  // Check initial Kalki ambient CSS variables
  const kalkiThemePrimary = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--movie-ambient-primary').trim();
  });
  console.log('Initial Ambient Theme Primary:', kalkiThemePrimary);

  // Click on "Stree 2" trending button
  console.log('Switching to Stree 2...');
  const streeButton = page.locator('button:has-text("Stree 2")');
  if (await streeButton.count() > 0) {
    await streeButton.first().click();
    await page.waitForTimeout(800);
    const streeThemePrimary = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--movie-ambient-primary').trim();
    });
    console.log('After clicking Stree 2 -> Ambient Theme Primary:', streeThemePrimary);
    await page.screenshot({ path: 'screenshot_home_stree2.png', fullPage: false });
    console.log('Saved screenshot_home_stree2.png');
  }

  // Click on "Dune: Part Two" trending button
  console.log('Switching to Dune: Part Two...');
  const duneButton = page.locator('button:has-text("Dune: Part Two")');
  if (await duneButton.count() > 0) {
    await duneButton.first().click();
    await page.waitForTimeout(800);
    const duneThemePrimary = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--movie-ambient-primary').trim();
    });
    console.log('After clicking Dune: Part Two -> Ambient Theme Primary:', duneThemePrimary);
    await page.screenshot({ path: 'screenshot_home_dune2.png', fullPage: false });
    console.log('Saved screenshot_home_dune2.png');
  }

  // Navigate to Movie Details Page for Stree 2
  console.log('--- 2. Testing Movie Details Page (Stree 2) ---');
  await page.goto('http://localhost:5173/movie/stree-2', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);
  const movieDetailsTheme = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--movie-ambient-primary').trim();
  });
  console.log('Movie Details (Stree 2) Ambient Primary:', movieDetailsTheme);
  await page.screenshot({ path: 'screenshot_details_stree2.png', fullPage: false });
  console.log('Saved screenshot_details_stree2.png');

  // Navigate to Movie Details Page for Dune 2
  console.log('--- 3. Testing Movie Details Page (Dune 2) ---');
  await page.goto('http://localhost:5173/movie/dune-2', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);
  const duneDetailsTheme = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--movie-ambient-primary').trim();
  });
  console.log('Movie Details (Dune 2) Ambient Primary:', duneDetailsTheme);
  await page.screenshot({ path: 'screenshot_details_dune2.png', fullPage: false });
  console.log('Saved screenshot_details_dune2.png');

  await desktopContext.close();

  // 2. Mobile Context (390x844 - iPhone 14 / modern mobile)
  console.log('--- 4. Testing Mobile Layout (390x844) ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.waitForTimeout(1500);
  await mobilePage.screenshot({ path: 'screenshot_home_mobile.png', fullPage: false });
  console.log('Saved screenshot_home_mobile.png');

  await mobilePage.goto('http://localhost:5173/movie/kalki-2898', { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.waitForTimeout(1500);
  await mobilePage.screenshot({ path: 'screenshot_details_mobile.png', fullPage: false });
  console.log('Saved screenshot_details_mobile.png');

  await mobileContext.close();
  await browser.close();

  console.log('\n--- VERIFICATION SUMMARY ---');
  console.log('Total Console Errors Encountered:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log('Console Errors:', consoleErrors);
  }
}

runVerification().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
