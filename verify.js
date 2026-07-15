import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: {
      dir: './verification/videos',
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  // In-memory store for mocked Supabase DB during verification
  let creatorsList = [
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
      description: "An energetic and highly entertaining software engineer focused on Neovim, TypeScript, Rust, algorithms, and developer culture memes.",
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

  let nextId = 6;

  // Intercept and route Supabase API calls
  await page.route('**/rest/v1/creators*', async (route, request) => {
    const method = request.method();
    const urlString = request.url();
    const url = new URL(urlString);
    console.log(`Intercepted API Call: [${method}] ${url.search}`);

    if (method === 'GET') {
      const selectParam = url.searchParams.get('select');
      const idEqParam = url.searchParams.get('id');

      if (idEqParam && idEqParam.startsWith('eq.')) {
        const idToFind = parseInt(idEqParam.replace('eq.', ''), 10);
        const item = creatorsList.find(c => c.id === idToFind);
        console.log(`Responding details for id ${idToFind}:`, item);
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(item ? [item] : [])
        });
      } else {
        console.log('Responding with full creators list');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(creatorsList)
        });
      }
    } else if (method === 'POST') {
      const body = JSON.parse(request.postData() || '[]');
      console.log('Inserting new creators:', body);
      const itemsToAdd = Array.isArray(body) ? body : [body];

      const addedItems = itemsToAdd.map(item => {
        const newItem = { ...item, id: nextId++ };
        creatorsList.push(newItem);
        return newItem;
      });

      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(addedItems)
      });
    } else if (method === 'PATCH') {
      const idEqParam = url.searchParams.get('id');
      const body = JSON.parse(request.postData() || '{}');
      console.log(`Updating creator with id param ${idEqParam}:`, body);

      if (idEqParam && idEqParam.startsWith('eq.')) {
        const idToUpdate = parseInt(idEqParam.replace('eq.', ''), 10);
        const index = creatorsList.findIndex(c => c.id === idToUpdate);
        if (index !== -1) {
          creatorsList[index] = { ...creatorsList[index], ...body };
        }
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    } else if (method === 'DELETE') {
      const idEqParam = url.searchParams.get('id');
      console.log(`Deleting creator with id param ${idEqParam}`);

      if (idEqParam && idEqParam.startsWith('eq.')) {
        const idToDelete = parseInt(idEqParam.replace('eq.', ''), 10);
        creatorsList = creatorsList.filter(c => c.id !== idToDelete);
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    } else {
      await route.continue();
    }
  });

  try {
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(1500);

    // Take screenshot of homepage with auto-seeded cards
    console.log('Saving screenshot: homepage.png');
    await page.screenshot({ path: './verification/screenshots/homepage.png' });

    console.log('Clicking "View Details" on Marques Brownlee (MKBHD) card...');
    const viewButton = page.locator('text=View Details').first();
    await viewButton.click();
    await page.waitForTimeout(1500);

    // Take screenshot of details page
    console.log('Saving screenshot: details.png');
    await page.screenshot({ path: './verification/screenshots/details.png' });

    console.log('Clicking "Creatorverse" link in nav breadcrumb to go back home...');
    await page.locator('text=Creatorverse').first().click();
    await page.waitForTimeout(1000);

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
