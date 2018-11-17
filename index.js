const path = require('path');
const puppeteer = require('puppeteer');
const download = require('image-downloader');
const config = require('./config');
const instagramAccount = 'https://www.instagram.com/yoona__lim/'; // Instagram account url
const numberOfPosts = 10; // Number of post that you want to save

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

const scrape = async page => {
  try {
    await page.click('div._2z6nI > article > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1) > a > div.eLAPa > div._9AhH0');
    await page.waitFor(500);
    for (let i = 0; i < numberOfPosts; i++) {
      let nextBtn = await page.evaluate("document.querySelector('.coreSpriteRightChevron')");
      let imageNumber = 1;

      if (nextBtn !== undefined) {
        // With one image from post
        const imgs = await page.evaluate(() => {
          const elements = document.querySelectorAll('div._97aPb IMG');
          return [...elements].map(el => el.src);
        });
        
        await Promise.all(imgs.map(async file => {
          await downloadImg({
            url: file,
            dest: IMAGE_DIRECTORY
          });
        }));
      } else {
        // More than one image from post
        while (nextBtn === undefined) {
          // Save images from post when next button exist
          const imgs = await page.evaluate(imageNumber => {
            const elements = document.querySelectorAll(`div.MreMs > div > ul > li:nth-child(${imageNumber}) IMG`);
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
        // Save last image from post
        const imgs = await page.evaluate(imageNumber => {
          const elements = document.querySelectorAll(`div.MreMs > div > ul > li:nth-child(${imageNumber}) IMG`);
          return [...elements].map(el => el.src);
        }, imageNumber);

        await Promise.all(imgs.map(async file => {
          await downloadImg({
            url: file,
            dest: IMAGE_DIRECTORY
          });
        }));
      }

      count += imageNumber;
      if (i !== numberOfPosts - 1) {
        await page.click('.coreSpriteRightPaginationArrow');
        await page.waitFor(800);
      }
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

    let isPrivate = await page.evaluate("document.querySelector('#react-root > section > main > div > div > article > div > div > h2')");

    if (isPrivate === undefined) {
      isPrivate = await page.evaluate(() => {
        const header = document.querySelectorAll('#react-root > section > main > div > div > article > div > div > h2');
        return header[0].innerHTML;
      })
    }
    
    if (isPrivate === 'This Account is Private') {
      await page.click('#react-root > section > main > div > div > article > div > div > div > a');
      await page.waitFor(500);
      await page.type('#react-root > section > main > div > article > div > div:nth-child(1) > div > form > div:nth-child(1) > div > div > input', config.email);
      await page.type('#react-root > section > main > div > article > div > div:nth-child(1) > div > form > div:nth-child(2) > div > div > input', config.password);
      await page.click('#react-root > section > main > div > article > div > div:nth-child(1) > div > form > div:nth-child(3) > button');
      await page.waitForSelector('body > div:nth-child(13) > div > div > div > div.mt3GC > button.aOOlW.HoLwm');
      await page.click('body > div:nth-child(13) > div > div > div > div.mt3GC > button.aOOlW.HoLwm');

      console.log("Loginned to your account!");
      await page.goto(instagramAccount);
    }

    console.log('⛏  Scraping image URLs...');
    await scrape(page);

    const time2 = Date.now();

    console.log(`👌  Done -- downloaded \x1b[36m${count}\x1b[0m album covers!`);
    let timeTake = time2 - time1;
    let unit = 'milliseconds';

    if (timeTake >= 1000 && timeTake < 60000) {
      timeTake = Math.round(timeTake / 1000);
      unit = 'seconds';
    }
    if (timeTake >= 60000) {
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