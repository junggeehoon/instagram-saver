const path = require('path');
const puppeteer = require('puppeteer');
const download = require('image-downloader');

// Relative path to directory to download images
const IMAGE_DIRECTORY = './img';
const delay = 300;
let count = 0;

const extractImage = () => {
  const elements = document.querySelectorAll('div.KL4Bh > img');
  return [...elements].map(el => el.src);
}

const extractLink = () => {
  const elements = document.querySelectorAll('div._2z6nI > article > div > div > div > div > a');
  return [...elements].map(el => el.href);
}

const downloadImg = async (options = {}) => {
  try {
    const { filename, image } = await download.image(options);
    console.log('⬇️  ', path.basename(filename));
  }
  catch (err) {
    console.log(err);
  }
}

const scrapPostImage = async (links) => {
  try {
    for (let i = 0; i < links.length; i++) {
      const browser = await puppeteer.launch({headless: false});
      const page = await browser.newPage();
      page.setViewport({ width: 1080, height: 720 });
      await page.goto(links[i]);
      let nextBtn = await page.evaluate("document.querySelectorAll('.coreSpriteRightChevron')");
      while (nextBtn === undefined) {
        const imgs = await page.evaluate(extractImage);
        await Promise.all(imgs.map(async file => {
          await downloadImg({
            url: file,
            dest: IMAGE_DIRECTORY 
          });
        }));
        count += imgs.length;
        await page.click('.coreSpriteRightChevron');
        await page.waitFor(delay);
        nextBtn = await page.evaluate("document.querySelectorAll('.coreSpriteRightChevron')");
      }
      browser.close();
    }
    return;
  } catch (err) {
    console.log(err);
  }
}

const scrapeInfiniteScrollItems = async page => {
  try {
    while (count < 600) {
      const links = await page.evaluate(extractLink);
      await scrapPostImage(links);
      previousHeight = await page.evaluate('document.body.scrollHeight');
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`, {timeout: 7000});
      await page.waitFor(delay);
    }
    console.log(`👌  Done -- downloaded \x1b[36m${count}\x1b[0m album covers!`);
  } catch(err) {}
  return;
}

const scrapeImgUrls = async () => {
  try {
    console.log('🚀  Launching...');
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    page.setViewport({ width: 1080, height: 720 });

    console.log('🌎  Visiting web page...');
    await page.goto('https://www.instagram.com/h.young_j/');

    console.log('⛏  Scraping image URLs...');
    await scrapeInfiniteScrollItems(page);

    return browser.close();
  }
  catch(err) {
    console.log(err);
  }
}

scrapeImgUrls();