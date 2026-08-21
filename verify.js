import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

async function run() {
  // Configured with headless: false so you can watch the browser execute live
  const browser = await chromium.launch({
    headless: false,
    slowMo: 1200
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 1200 },
    recordVideo: {
      dir: './verification/videos',
      size: { width: 1280, height: 1200 }
    }
  });

  const page = await context.newPage();

  // In-memory mock database for Playwright walkthrough
  let db = [
    {
      id: 1,
      name: "Marques Brownlee (MKBHD)",
      url: "https://www.youtube.com/@mkbhd",
      description: "One of the world's top tech reviewers, producing extremely high-quality video reviews on smartphones, electric vehicles, and future tech gadgets.",
      imageURL: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      name: "Simone Giertz",
      url: "https://www.youtube.com/@simonegiertz",
      description: "A brilliant Swedish inventor, maker, and robotics enthusiast famous for crafting wonderfully useless machines and transforming a Tesla into 'Truckla'.",
      imageURL: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      name: "The Primeagen",
      url: "https://www.youtube.com/@ThePrimeagen",
      description: "An energetic and highly entertaining software engineer focused on Neovim, TypeScript, Rust, algorithms, and hilarious developer culture memes.",
      imageURL: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 4,
      name: "Mark Rober",
      url: "https://www.youtube.com/@MarkRober",
      description: "A former NASA and Apple engineer who creates incredibly viral and educational science, engineering, and prank/glitter bomb videos.",
      imageURL: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 5,
      name: "Kurzgesagt – In a Nutshell",
      url: "https://www.youtube.com/@kurzgesagt",
      description: "An animation studio making beautiful, colorful, bird-themed science videos explaining space, biology, physics, and complex philosophical dilemmas.",
      imageURL: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80"
    }
  ];

  // Intercept all Supabase REST calls to mock CRUD operations seamlessly
  await page.route('**/rest/v1/creators*', async (route) => {
    const request = route.request();
    const method = request.method();
    const url = request.url();

    if (method === 'GET') {
      const urlObj = new URL(url);
      const idParam = urlObj.searchParams.get('id');
      if (idParam && idParam.startsWith('eq.')) {
        const idVal = parseInt(idParam.replace('eq.', ''), 10);
        const item = db.filter(c => c.id === idVal);
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(item)
        });
      } else {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(db)
        });
      }
    } else if (method === 'POST') {
      const postData = JSON.parse(request.postData() || '{}');
      const newCreator = {
        id: db.length > 0 ? Math.max(...db.map(c => c.id)) + 1 : 1,
        ...postData
      };
      db.push(newCreator);
      return route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify([newCreator])
      });
    } else if (method === 'PATCH') {
      const urlObj = new URL(url);
      const idParam = urlObj.searchParams.get('id');
      if (idParam && idParam.startsWith('eq.')) {
        const idVal = parseInt(idParam.replace('eq.', ''), 10);
        const postData = JSON.parse(request.postData() || '{}');
        db = db.map(c => c.id === idVal ? { ...c, ...postData } : c);
      }
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    } else if (method === 'DELETE') {
      const urlObj = new URL(url);
      const idParam = urlObj.searchParams.get('id');
      if (idParam && idParam.startsWith('eq.')) {
        const idVal = parseInt(idParam.replace('eq.', ''), 10);
        db = db.filter(c => c.id !== idVal);
      }
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    }

    return route.continue();
  });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  // Inject CSS & JS for custom ripple clicks and DOM overlays
  await page.addInitScript(() => {
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

    window.showTitleCard = (title, subtitle) => {
      const existing = document.getElementById('title-card-overlay');
      if (existing) existing.remove();

      const overlay = document.createElement('div');
      overlay.id = 'title-card-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(15, 23, 42, 0.95)';
      overlay.style.display = 'flex';
      overlay.style.flexDirection = 'column';
      overlay.style.justifyContent = 'center';
      overlay.style.alignItems = 'center';
      overlay.style.color = '#fff';
      overlay.style.zIndex = '9999999';
      overlay.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.2s ease-in-out'; // Adjusted transition duration from 0.4s to 0.2s

      const container = document.createElement('div');
      container.style.textAlign = 'center';
      container.style.padding = '2rem';
      container.style.maxWidth = '700px';

      const titleEl = document.createElement('h1');
      titleEl.innerText = title;
      titleEl.style.fontSize = '3.5rem';
      titleEl.style.fontWeight = '800';
      titleEl.style.marginBottom = '1.5rem';
      titleEl.style.color = '#3b82f6';
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

      overlay.getBoundingClientRect();
      overlay.style.opacity = '1';
    };

    window.hideTitleCard = () => {
      const overlay = document.getElementById('title-card-overlay');
      if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.remove();
        }, 200); // Adjusted timeout duration from 400ms to 200ms
      }
    };
  });

  async function displayOverlay(title, subtitle) {
    await page.evaluate(({ t, s }) => {
      window.showTitleCard(t, s);
    }, { t: title, s: subtitle });
    await page.waitForTimeout(2000); // Adjusted screen time from 3000ms to 2000ms for punchier pacing
    await page.evaluate(() => {
      window.hideTitleCard();
    });
    await page.waitForTimeout(300);
  }

  try {
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(1000);

    fs.mkdirSync('./verification/screenshots', { recursive: true });
    fs.mkdirSync('./verification/videos', { recursive: true });

    // --- READ ALL (Homepage) ---
    await displayOverlay(
      'CRUD - READ ALL',
      'Displaying at least 5 content creators with explicit channel URLs on the homepage'
    );

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);

    console.log('Saving screenshot: homepage.png');
    await page.screenshot({ path: './verification/screenshots/homepage.png' });

    // --- READ ONE (Details Page) ---
    await displayOverlay(
      'CRUD - READ ONE',
      'Navigating to a unique URL to view detailed creator info with explicit channel link'
    );

    console.log('Clicking "View Details" on the first creator card...');
    const viewButton = page.locator('text=View Details').first();
    await viewButton.scrollIntoViewIfNeeded();
    await viewButton.click();
    await page.waitForTimeout(1500);

    console.log('Saving screenshot: details.png');
    await page.screenshot({ path: './verification/screenshots/details.png' });

    console.log('Clicking "Creatorverse" link in nav breadcrumb to go back home...');
    await page.locator('text=Creatorverse').first().click();
    await page.waitForTimeout(1000);

    // --- CREATE (Add Creator Form) ---
    await displayOverlay(
      'CRUD - CREATE',
      'Adding a brand new creator with an explicit YouTube URL to our Creatorverse'
    );

    console.log('Clicking "Add a Creator" top nav button...');
    const addCreatorBtn = page.locator('text=Add a Creator').first();
    await addCreatorBtn.scrollIntoViewIfNeeded();
    await addCreatorBtn.click();
    await page.waitForTimeout(1000);

    console.log('Filling in new creator details...');
    await page.fill('input[name="name"]', 'Matt Pocock');
    await page.fill('input[name="url"]', 'https://www.youtube.com/@mattpocockuk');
    await page.fill('textarea[name="description"]', 'Superb TypeScript tutorials and masterclass skills.');
    await page.fill('input[name="imageURL"]', 'https://images.unsplash.com/photo-1516116211223-5c359a36298a?auto=format&fit=crop&w=600&q=80');
    await page.waitForTimeout(1000);

    console.log('Saving screenshot: add_form.png');
    await page.screenshot({ path: './verification/screenshots/add_form.png' });

    console.log('Submitting form...');
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click();
    await page.waitForTimeout(2000);

    console.log('Saving screenshot: homepage_with_new_creator.png');
    await page.screenshot({ path: './verification/screenshots/homepage_with_new_creator.png' });

    // --- UPDATE (Edit Creator Form) ---
    await displayOverlay(
      'CRUD - UPDATE',
      'Editing the newly created content creator details to update the name'
    );

    console.log('Clicking "Edit" on Matt Pocock's card...');
    const editBtn = page.locator('article:has-text("Matt Pocock") >> text=Edit').first();
    await editBtn.scrollIntoViewIfNeeded();
    await editBtn.click();
    await page.waitForTimeout(1500);

    console.log('Modifying name...');
    await page.fill('input[name="name"]', 'Matt Pocock TS Guru');
    await page.waitForTimeout(1000);

    console.log('Saving screenshot: edit_form.png');
    await page.screenshot({ path: './verification/screenshots/edit_form.png' });

    console.log('Submitting updates...');
    const updateSubmitBtn = page.locator('button[type="submit"]');
    await updateSubmitBtn.scrollIntoViewIfNeeded();
    await updateSubmitBtn.click();
    await page.waitForTimeout(2000);

    console.log('Saving screenshot: homepage_updated.png');
    await page.screenshot({ path: './verification/screenshots/homepage_updated.png' });

    // --- DELETE (Remove Creator) ---
    await displayOverlay(
      'CRUD - DELETE',
      'Permanently removing the content creator from the database using the Delete option'
    );

    console.log('Clicking "Edit" again on updated card to perform delete test...');
    const editDeleteBtn = page.locator('article:has-text("Matt Pocock TS Guru") >> text=Edit').first();
    await editDeleteBtn.scrollIntoViewIfNeeded();
    await editDeleteBtn.click();
    await page.waitForTimeout(1500);

    console.log('Clicking "Delete Creator" and confirming dialog...');
    page.on('dialog', async (dialog) => {
      console.log(`Intercepted Dialog: [${dialog.type()}] "${dialog.message()}"`);
      await dialog.accept();
    });

    const deleteBtn = page.locator('button:has-text("Delete Creator")');
    await deleteBtn.scrollIntoViewIfNeeded();
    await deleteBtn.click();
    
    // Safety guardrails: Wait for redirection and flush data streams securely
    await page.waitForURL('http://localhost:3000/');
    await page.waitForTimeout(2000);

    console.log('Saving final screenshot: verification.png');
    await page.screenshot({ path: './verification/screenshots/verification.png' });
    
    console.log('Waiting for video recording buffer to flush cleanly...');
    await page.waitForTimeout(4000);

    console.log('E2E Playwright verification journey completed successfully!');

  } catch (err) {
    console.error('Error during Playwright journey:', err);
  } finally {
    const video = page.video();
    const videoPath = video ? await video.path() : null;

    await context.close();
    await browser.close();

    if (videoPath && fs.existsSync(videoPath)) {
      console.log(`Playwright WebM video saved at: ${videoPath}`);
      try {
        const destDir = './verification/videos';
        const targetWebmPath = path.join(destDir, 'walkthrough.webm');
        const targetMp4Path = path.join(destDir, 'walkthrough.mp4');
        const targetGifPath = path.join(destDir, 'walkthrough.gif');

        fs.copyFileSync(videoPath, targetWebmPath);
        console.log(`Copied WebM video to canonical destination: ${targetWebmPath}`);

        console.log('Converting WebM video to MP4 using FFmpeg...');
        execSync(`ffmpeg -y -i "${targetWebmPath}" -c:v libx264 -pix_fmt yuv420p "${targetMp4Path}"`, { stdio: 'inherit' });
        console.log(`Successfully converted walkthrough video to MP4: ${targetMp4Path}`);

        console.log('Converting video to animated GIF using FFmpeg...');
        execSync(`ffmpeg -y -i "${targetMp4Path}" -vf "fps=10,scale=800:-1:flags=lanczos" "${targetGifPath}"`, { stdio: 'inherit' });
        console.log(`Successfully generated animated GIF: ${targetGifPath}`);
      } catch (err) {
        console.error('Failed to convert video assets with FFmpeg:', err);
      }
    } else {
      console.log('No video path found or video was not recorded.');
    }
  }
}

run();
