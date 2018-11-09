const path = require('path');
const puppeteer = require('puppeteer');
const download = require('image-downloader');

// Relative path to directory to download images
const IMAGE_DIRECTORY = './img';

const downloadImg = async (options = {}) => {
  try {
    const { filename, image } = await download.image(options);
    console.log('⬇️  ', path.basename(filename));
  }
  catch (err) {
    console.log(err);
  }
}

const extractItems = () => {
  const elements = document.querySelectorAll('div.KL4Bh > img');
  return [...elements].map(el => el.src);
}

const scrapeInfiniteScrollItems = async (page, extractItems, scrollDelay) => {
  try {
    let previousHeight;
    let count = 0;
    while (count < 330) {
      const imgs = await page.evaluate(extractItems);
      await Promise.all(imgs.map(async file => {
        await downloadImg({
          url: file,
          dest: IMAGE_DIRECTORY 
        });
      }));
      previousHeight = await page.evaluate('document.body.scrollHeight');
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
      await page.waitFor(scrollDelay);
      count += imgs.length;
    }
    console.log(`👌  Done -- downloaded \x1b[36m${count}\x1b[0m album covers!`);
  } catch(err) {
    console.log(err);
  }
  return;
}

const scrapeImgUrls = async () => {
  try {
    console.log('🚀  Launching...');
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    page.setViewport({ width: 1080, height: 720 });

    console.log('🌎  Visiting web page...');
    await page.goto('https://www.instagram.com/yoona__lim/');

    console.log('⛏  Scraping image URLs...');
    await scrapeInfiniteScrollItems(page, extractItems, scrollDelay = 200);

    browser.close();
    return;
  }
  catch(err) {
    console.log(err);
  }
}

scrapeImgUrls();