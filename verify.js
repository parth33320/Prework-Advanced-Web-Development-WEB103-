import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

async function run() {
  // 1. Launch with slowMo: 1500
  const browser = await chromium.launch({
    headless: true,
    slowMo: 1500
  });

  const context = await browser.newContext({
    recordVideo: {
      dir: './verification/videos',
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  // 2. Inject CSS & JS for custom ripple clicks and DOM overlays
  await page.addInitScript(() => {
    // Inject click ripple listener
    window.addEventListener('DOMContentLoaded', () => {
      const style = document.createElement('style');
      style.innerHTML = `
        @keyframes ripple-effect {
          0% {
            transform: scale(0.3);
            opacity: 1;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        .playwright-click-ripple {
          position: fixed;
          width: 40px;
          height: 40px;
          border: 4px solid #ff4757;
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000000;
          animation: ripple-effect 0.4s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }
      `;
      document.head.appendChild(style);
    });

    window.addEventListener('click', (e) => {
      const ripple = document.createElement('div');
      ripple.className = 'playwright-click-ripple';
      ripple.style.left = `${e.clientX - 20}px`;
      ripple.style.top = `${e.clientY - 20}px`;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 400);
    }, true);

    // Inject title card overlay helpers
    window.showTitleCard = (title, subtitle) => {
      // Remove any existing one first
      const existing = document.getElementById('title-card-overlay');
      if (existing) existing.remove();

      const overlay = document.createElement('div');
      overlay.id = 'title-card-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(15, 23, 42, 0.95)'; // dark slate overlay
      overlay.style.display = 'flex';
      overlay.style.flexDirection = 'column';
      overlay.style.justifyContent = 'center';
      overlay.style.alignItems = 'center';
      overlay.style.color = '#fff';
      overlay.style.zIndex = '9999999';
      overlay.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.4s ease-in-out';

      const container = document.createElement('div');
      container.style.textAlign = 'center';
      container.style.padding = '2rem';
      container.style.maxWidth = '600px';

      const titleEl = document.createElement('h1');
      titleEl.innerText = title;
      titleEl.style.fontSize = '3.5rem';
      titleEl.style.fontWeight = '800';
      titleEl.style.marginBottom = '1.5rem';
      titleEl.style.color = '#3b82f6'; // vibrant blue
      titleEl.style.letterSpacing = '-0.05em';

      const subEl = document.createElement('h3');
      subEl.innerText = subtitle;
      subEl.style.fontSize = '1.5rem';
      subEl.style.color = '#e2e8f0';
      subEl.style.lineHeight = '1.6';
      subEl.style.fontWeight = '400';

      container.appendChild(titleEl);
      container.appendChild(subEl);
      overlay.appendChild(container);
      document.body.appendChild(overlay);

      // Force layout calculation & fade in
      overlay.getBoundingClientRect();
      overlay.style.opacity = '1';
    };

    window.hideTitleCard = () => {
      const overlay = document.getElementById('title-card-overlay');
      if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.remove();
        }, 400);
      }
    };
  });

  // Helper function to show a title card for 2.5 seconds
  async function displayOverlay(title, subtitle) {
    await page.evaluate(({ t, s }) => {
      window.showTitleCard(t, s);
    }, { t: title, s: subtitle });
    await page.waitForTimeout(2500);
    await page.evaluate(() => {
      window.hideTitleCard();
    });
    await page.waitForTimeout(500); // Wait for transition fade out
  }

  try {
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(1000);

    // --- READ ALL (Homepage) ---
    await displayOverlay(
      'CRUD - READ ALL',
      'Displaying at least five content creators in responsive PicoCSS cards on our homepage'
    );

    // Take screenshot of homepage
    console.log('Saving screenshot: homepage.png');
    await page.screenshot({ path: './verification/screenshots/homepage.png' });

    // --- READ ONE (Details Page) ---
    await displayOverlay(
      'CRUD - READ ONE',
      'Navigating to a unique URL to view detailed information for a single creator'
    );

    console.log('Clicking "View Details" on the first creator card...');
    const viewButton = page.locator('text=View Details').first();
    await viewButton.click();
    await page.waitForTimeout(1500);

    // Take screenshot of details page
    console.log('Saving screenshot: details.png');
    await page.screenshot({ path: './verification/screenshots/details.png' });

    console.log('Clicking "Creatorverse" link in nav breadcrumb to go back home...');
    await page.locator('text=Creatorverse').first().click();
    await page.waitForTimeout(1000);

    // --- CREATE (Add Creator Form) ---
    await displayOverlay(
      'CRUD - CREATE',
      'Adding a brand new human to our Creatorverse database using the AddCreator form'
    );

    console.log('Clicking "Add Creator" top nav button...');
    await page.locator('text=Add Creator').first().click();
    await page.waitForTimeout(1000);

    console.log('Filling in new creator details...');
    await page.fill('input[name="name"]', 'Matt Pocock');
    await page.fill('input[name="url"]', 'https://www.youtube.com/@mattpocock');
    await page.fill('textarea[name="description"]', 'Superb TypeScript tutorials and masterclass skills.');
    await page.fill('input[name="imageURL"]', 'https://images.unsplash.com/photo-1516116211223-5c359a36298a?auto=format&fit=crop&w=600&q=80');
    await page.waitForTimeout(1000);

    console.log('Saving screenshot: add_form.png');
    await page.screenshot({ path: './verification/screenshots/add_form.png' });

    console.log('Submitting form...');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Observe newly added creator card on the homepage
    console.log('Saving screenshot: homepage_with_new_creator.png');
    await page.screenshot({ path: './verification/screenshots/homepage_with_new_creator.png' });

    // --- UPDATE (Edit Creator Form) ---
    await displayOverlay(
      'CRUD - UPDATE',
      'Editing the newly created content creator details to update the name'
    );

    console.log('Clicking "Edit" on Matt Pocock\'s card...');
    await page.locator('article:has-text("Matt Pocock") >> text=Edit').first().click();
    await page.waitForTimeout(1500);

    console.log('Modifying name...');
    await page.fill('input[name="name"]', 'Matt Pocock TS Guru');
    await page.waitForTimeout(1000);

    console.log('Saving screenshot: edit_form.png');
    await page.screenshot({ path: './verification/screenshots/edit_form.png' });

    console.log('Submitting updates...');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Homepage with updated creator name
    console.log('Saving screenshot: homepage_updated.png');
    await page.screenshot({ path: './verification/screenshots/homepage_updated.png' });

    // --- DELETE (Remove Creator) ---
    await displayOverlay(
      'CRUD - DELETE',
      'Permanently removing the content creator from the database using the Delete option'
    );

    console.log('Clicking "Edit" again on updated card to perform delete test...');
    await page.locator('article:has-text("Matt Pocock TS Guru") >> text=Edit').first().click();
    await page.waitForTimeout(1500);

    console.log('Clicking "Delete Creator" and confirming dialog...');
    // Intercept confirm dialog and accept it
    page.on('dialog', async (dialog) => {
      console.log(`Intercepted Dialog: [${dialog.type()}] "${dialog.message()}"`);
      await dialog.accept();
    });

    await page.click('button:has-text("Delete Creator")');
    await page.waitForTimeout(2000);

    // Final homepage view (Matt deleted)
    console.log('Saving final screenshot: verification.png');
    await page.screenshot({ path: './verification/screenshots/verification.png' });
    console.log('E2E Playwright verification journey completed successfully!');

  } catch (err) {
    console.error('Error during Playwright journey:', err);
  } finally {
    const video = page.video();
    const videoPath = video ? await video.path() : null;

    await context.close();
    await browser.close();

    // After closing browser, Playwright saves the video file.
    if (videoPath && fs.existsSync(videoPath)) {
      console.log(`Playwright WebM video saved at: ${videoPath}`);
      try {
        const destDir = './verification/videos';
        const targetWebmPath = path.join(destDir, 'walkthrough.webm');
        const targetMp4Path = path.join(destDir, 'walkthrough.mp4');

        // Copy or rename the unique file to walkthrough.webm
        fs.copyFileSync(videoPath, targetWebmPath);
        console.log(`Copied WebM video to canonical destination: ${targetWebmPath}`);

        // Convert the WebM video to MP4 using ffmpeg
        console.log('Converting WebM video to MP4 using FFmpeg...');
        execSync(`ffmpeg -y -i "${targetWebmPath}" -c:v libx264 -pix_fmt yuv420p "${targetMp4Path}"`, { stdio: 'inherit' });
        console.log(`Successfully converted walkthrough video to MP4: ${targetMp4Path}`);
      } catch (err) {
        console.error('Failed to convert video to MP4:', err);
      }
    } else {
      console.log('No video path found or video was not recorded.');
    }
  }
}

run();
