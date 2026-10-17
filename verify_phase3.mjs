import { chromium } from '@playwright/test';

async function verifyPhase3() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  console.log('--- CineBook V2 Phase 3 Automated Verification ---');
  const consoleErrors = [];

  // ================= 1. DESKTOP VERIFICATION (1440x900) =================
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await desktopContext.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('Browser Error:', msg.text());
      consoleErrors.push(msg.text());
    }
  });

  console.log('Navigating to http://localhost:5173 ...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);

  // Verify Supabase Connected Badge
  const headerText = await page.locator('header').first().innerText();
  const isSupabaseConnected = headerText.includes('Supabase Connected');
  console.log('Supabase Connection Status:', isSupabaseConnected ? 'CONNECTED (Green)' : 'FAILED');

  // Verify Hero Section Elements
  const heroTitle = await page.locator('h1').first().innerText();
  console.log('Hero Spotlight Title:', heroTitle);

  // Verify Hero 3D Poster is visible
  const heroPoster = page.locator('[aria-label^="Featured movie poster"]');
  const heroPosterCount = await heroPoster.count();
  console.log('Hero 3D Poster Present on Desktop:', heroPosterCount > 0);

  // Test Hero 3D Poster Mouse Hover Tilt
  if (heroPosterCount > 0) {
    const box = await heroPoster.first().boundingBox();
    if (box) {
      console.log('Hovering top-right quadrant of Hero 3D Poster...');
      await page.mouse.move(box.x + box.width * 0.85, box.y + box.height * 0.2);
      await page.waitForTimeout(300);

      const tiltedTransform = await heroPoster.first().evaluate(el => el.style.transform);
      console.log('Hero Poster Transform during hover:', tiltedTransform);

      await page.mouse.move(box.x - 100, box.y - 100);
      await page.waitForTimeout(600);
      const restingTransform = await heroPoster.first().evaluate(el => el.style.transform);
      console.log('Hero Poster Transform after mouse leave:', restingTransform);
    }
  }

  // Capture Desktop Hero Screenshot
  await page.screenshot({ path: 'screenshot_phase3_hero_kalki.png', fullPage: false });
  console.log('Saved screenshot_phase3_hero_kalki.png');

  // Test Movie Spotlight Switching (Stree 2)
  console.log('Switching hero spotlight to Stree 2...');
  const streeBtn = page.locator('button:has-text("Stree 2")').first();
  await streeBtn.click();
  await page.waitForTimeout(800);
  const streeTitle = await page.locator('h1').first().innerText();
  console.log('Updated Hero Title:', streeTitle);
  await page.screenshot({ path: 'screenshot_phase3_hero_stree2.png', fullPage: false });
  console.log('Saved screenshot_phase3_hero_stree2.png');

  // Test Movie Spotlight Switching (Dune: Part Two)
  console.log('Switching hero spotlight to Dune: Part Two...');
  const duneBtn = page.locator('button:has-text("Dune: Part Two")').first();
  await duneBtn.click();
  await page.waitForTimeout(800);
  const duneTitle = await page.locator('h1').first().innerText();
  console.log('Updated Hero Title:', duneTitle);
  await page.screenshot({ path: 'screenshot_phase3_hero_dune2.png', fullPage: false });
  console.log('Saved screenshot_phase3_hero_dune2.png');

  // ================= 2. GRID MOVIE CARD 3D TILT TEST =================
  console.log('Testing Grid MovieCard 3D Hover & Depth...');
  // Scroll down to Now Showing grid
  await page.locator('#now-showing').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const firstCard = page.locator('#now-showing [role="button"]').first();
  const cardBox = await firstCard.boundingBox();
  if (cardBox) {
    // Hover bottom-left quadrant
    await page.mouse.move(cardBox.x + cardBox.width * 0.2, cardBox.y + cardBox.height * 0.8);
    await page.waitForTimeout(300);

    const cardTiltedTransform = await firstCard.evaluate(el => el.style.transform);
    console.log('Grid Card Transform during hover:', cardTiltedTransform);

    // Check specular glare opacity
    const glareOpacity = await firstCard.locator('div[aria-hidden="true"]').first().evaluate(el => el.style.opacity);
    console.log('Grid Card Specular Glare Opacity:', glareOpacity);

    await page.screenshot({ path: 'screenshot_phase3_card_hover.png', fullPage: false });
    console.log('Saved screenshot_phase3_card_hover.png');

    // Move mouse away
    await page.mouse.move(cardBox.x - 200, cardBox.y - 200);
    await page.waitForTimeout(600);
    const cardRestingTransform = await firstCard.evaluate(el => el.style.transform);
    console.log('Grid Card Transform after mouse leave:', cardRestingTransform);
  }

  // Test Movie Card Click Navigation
  console.log('Testing movie card click navigation...');
  const detailsBtn = firstCard.locator('a:has-text("Details")').first();
  await detailsBtn.click();
  await page.waitForTimeout(1200);
  console.log('Navigated URL:', page.url());
  const detailsTitle = await page.locator('h1').first().innerText();
  console.log('Movie Details Page Title:', detailsTitle);
  await page.screenshot({ path: 'screenshot_phase3_details.png', fullPage: false });

  await desktopContext.close();

  // ================= 3. REDUCED MOTION TEST =================
  console.log('--- Testing prefers-reduced-motion: reduce ---');
  const reducedMotionContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce'
  });
  const reducedMotionPage = await reducedMotionContext.newPage();
  await reducedMotionPage.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
  await reducedMotionPage.waitForTimeout(1000);

  const rmCard = reducedMotionPage.locator('#now-showing [role="button"]').first();
  const rmBox = await rmCard.boundingBox();
  if (rmBox) {
    await reducedMotionPage.mouse.move(rmBox.x + rmBox.width * 0.8, rmBox.y + rmBox.height * 0.2);
    await reducedMotionPage.waitForTimeout(300);
    const rmTransform = await rmCard.evaluate(el => el.style.transform);
    console.log('Reduced Motion Card Transform (should remain untransformed/empty):', rmTransform || '(none)');
  }
  await reducedMotionContext.close();

  // ================= 4. MOBILE VIEWPORT TEST (390x844) =================
  console.log('--- Testing Mobile Layout (390x844 - iPhone 14) ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.waitForTimeout(1500);

  // Check horizontal overflow
  const hasHorizontalScroll = await mobilePage.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  console.log('Mobile Horizontal Scroll (should be false):', hasHorizontalScroll);

  await mobilePage.screenshot({ path: 'screenshot_phase3_mobile_home.png', fullPage: false });
  console.log('Saved screenshot_phase3_mobile_home.png');

  // Navigate to movie details on mobile
  await mobilePage.goto('http://localhost:5173/movie/kalki-2898', { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.waitForTimeout(1200);
  await mobilePage.screenshot({ path: 'screenshot_phase3_mobile_details.png', fullPage: false });
  console.log('Saved screenshot_phase3_mobile_details.png');

  await mobileContext.close();
  await browser.close();

  console.log('\n========================================');
  console.log('VERIFICATION COMPLETE');
  console.log('Total Console Errors:', consoleErrors.length);
  console.log('========================================');
}

verifyPhase3().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
