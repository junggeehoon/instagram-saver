const path = require('path');
const puppeteer = require('puppeteer');
const download = require('image-downloader');
const instagramAccount = 'https://www.instagram.com/irene.redvelvet/?hl=ko';
const numberOfPosts = 300;

// Relative path to directory to download images
const IMAGE_DIRECTORY = './img';
const headless = false;
let count = 0;

const downloadImg = async (options = {}) => {
  try {
    const {
      filename,
      image
    } = await download.image(options);
    console.log('⬇️  ', path.basename(filename));
  } catch (err) {
    console.log(err);
  }
}
//div.MreMs > div > ul > li:nth-child(1) > div > div > div > div > div.KL4Bh > img
//div.MreMs > div > ul > li:nth-child(2) > div > div > div > div.KL4Bh > img
//div.MreMs > div > ul > li:nth-child(1) > div > div > div > div > div.KL4Bh > img
//div.MreMs > div > ul > li:nth-child(2) > div > div > div > div.KL4Bh > img
//body > div:nth-child(15) > div > div.zZYga > div > article > div._97aPb > div > div > div > div.KL4Bh > img
//body > div:nth-child(15) > div > div.zZYga > div > article > div._97aPb > div > div > div > div.KL4Bh > img
//body > div:nth-child(15) > div > div.zZYga > div > article > div._97aPb > div > div > div > div.KL4Bh > img
//div.MreMs > div > ul > li:nth-child(2) > div > div > div > div.KL4Bh > img
//FFVAD

const scrape = async page => {
  try {
    await page.click('div._2z6nI > article > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1) > a > div.eLAPa > div._9AhH0');
    await page.waitForSelector('.coreSpriteRightChevron');
    for (let i = 0; i < numberOfPosts - 1; i++) {
      let nextBtn = await page.evaluate("document.querySelector('.coreSpriteRightChevron')");
      let imageNumber = 1;
      while (nextBtn === undefined) {
        const imgs = await page.evaluate(imageNumber => {
          const elements = document.querySelectorAll(`li:nth-child(${imageNumber}) > div > div > div > div.KL4Bh > img`);
          return [...elements].map(el => el.src);
        }, imageNumber);
        await Promise.all(imgs.map(async file => {
          await downloadImg({
            url: file,
            dest: IMAGE_DIRECTORY
          });
        }));
        imageNumber++;
        await page.click('.coreSpriteRightChevron');
        nextBtn = await page.evaluate("document.querySelector('.coreSpriteRightChevron')");
      }
      count += imageNumber;
      await page.waitFor(1000);
      await page.click('.coreSpriteRightPaginationArrow');
      await page.waitFor(1000);
    }
  } catch (err) {
    console.log(err);
  }
  return;
}

const scrapeImgUrls = async () => {
  try {
    console.log('🚀  Launching...');
    const time1 = Date.now();
    const browser = await puppeteer.launch({
      headless: headless
    });
    const page = await browser.newPage();
    page.setViewport({
      width: 1080,
      height: 720
    });

    console.log('🌎  Visiting web page...');
    await page.goto(instagramAccount);

    console.log('⛏  Scraping image URLs...');
    await scrape(page);

    const time2 = Date.now()

    console.log(`👌  Done -- downloaded \x1b[36m${count}\x1b[0m album covers!`);
    let timeTake = time2 - time1;
    let unit = 'milliseconds';
    if (timeTake > 60000) {
      timeTake = Math.round(timeTake / 60000);
      unit = 'minutes';
    }
    console.log(`It took about ${timeTake} ${unit}!`);
    return browser.close();
  } catch (err) {
    console.log(err);
  }
}

scrapeImgUrls();