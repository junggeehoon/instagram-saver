// const path = require('path');
// const puppeteer = require('puppeteer');
// const download = require('image-downloader');
// const instagramAccount = 'https://www.instagram.com/irene.redvelvet/?hl=ko';
// const numberOfPosts = 100;

// // Relative path to directory to download images
// const IMAGE_DIRECTORY = './img';
// const headless = false;

// const scrapImages = () => {
//   const elements = document.querySelectorAll('.FFVAD');
//   return [...elements].map(el => el.src);
// }

// const downloadImg = async (options = {}) => {
//   try {
//     const {
//       filename,
//       image
//     } = await download.image(options);
//     console.log('⬇️  ', path.basename(filename));
//   } catch (err) {
//     console.log(err);
//   }
// }

// const scrape = async page => {
//   const images = [];
//   try {
//     await page.click('div._2z6nI > article > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1) > a > div.eLAPa > div._9AhH0');
//     await page.waitForSelector('.coreSpriteRightChevron');
//     await page.waitFor(500);
//     for (let i = 0; i < numberOfPosts - 1; i++) {
//       let nextBtn = await page.evaluate("document.querySelector('.coreSpriteRightChevron')");
//       while (nextBtn === undefined) {
//         const imgs = await page.evaluate(scrapImages);
//         for (j = 0; j < imgs.length; j++) {
//           if (!images.includes(imgs[j])) {
//             images.push(imgs[j]);
//           }
//         }
//         console.log(images.length);
//         await page.click('.coreSpriteRightChevron');
//         nextBtn = await page.evaluate("document.querySelector('.coreSpriteRightChevron')");
//       }
//       await page.click('.coreSpriteRightPaginationArrow');
//       await page.waitFor(1000);
//     }
//   } catch (err) {
//     console.log(err);
//   }
//   return images;
// }

// const scrapeImgUrls = async () => {
//   try {
//     console.log('🚀  Launching...');
//     const time1 = Date.now();
//     const browser = await puppeteer.launch({
//       headless: headless
//     });
//     const page = await browser.newPage();
//     page.setViewport({
//       width: 1080,
//       height: 720
//     });

//     console.log('🌎  Visiting web page...');
//     await page.goto(instagramAccount);

//     console.log('⛏  Scraping image URLs...');
//     const results = await scrape(page);
//     await Promise.all(results.map(async file => {
//       await downloadImg({
//         url: file,
//         dest: IMAGE_DIRECTORY
//       });
//     }));

//     const time2 = Date.now()

//     console.log(`👌  Done -- downloaded \x1b[36m${results.length}\x1b[0m album covers!`);
//     let timeTake = time2 - time1;
//     let unit = 'milliseconds';
//     if (timeTake >= 1000 && timeTake < 60000) {
//       timeTake = Math.round(timeTake / 1000);
//       unit = 'seconds';
//     }
//     if (timeTake >= 60000) {
//       timeTake = Math.round(timeTake / 60000);
//       unit = 'minutes';
//     }
//     console.log(`It took about ${timeTake} ${unit}!`);
//     return browser.close();
//   } catch (err) {
//     console.log(err);
//   }
// }

// scrapeImgUrls();
//div._97aPb > div > div > div > div.KL4Bh > img
//div._97aPb > div > div > div > div.KL4Bh > img
//div._97aPb > div > div > div > div.KL4Bh > img 홀로 있는 놈들
//div.MreMs > div > ul > li:nth-child(1) > div > div > div > div > div.KL4Bh > img
//div.MreMs > div > ul > li:nth-child(1) > div > div > div > div > div.KL4Bh > img 첫번째로 있는 놈들
//div.MreMs > div > ul > li:nth-child(2) > div > div > div > div.KL4Bh > img 다음번째로 있는 것들
//div.MreMs > div > ul > li:nth-child(3) > div > div > div > div.KL4Bh > img
//div.MreMs > div > ul > li:nth-child(5) > div > div > div > div.KL4Bh > img

// const path = require('path');
// const puppeteer = require('puppeteer');
// const download = require('image-downloader');
// const instagramAccount = 'https://www.instagram.com/h.young_j/';
// const numberOfPosts = 100;

// // Relative path to directory to download images
// const IMAGE_DIRECTORY = './img';

// const extractImage = () => {
//   const elements = document.querySelectorAll('div.KL4Bh > img');
//   return [...elements].map(img => img.src);
// }

// const extractLink = () => {
//   const elements = document.querySelectorAll('article.FyNDV > div > div > div > div > a');
//   return [...elements].map(el => el.href);
// }

// const downloadImg = async (options = {}) => {
//   try {
//     const {
//       filename,
//       image
//     } = await download.image(options);
//     console.log('⬇️  ', path.basename(filename));
//   } catch (err) {
//     console.log(err);
//   }
// }

// const scrapPostImage = async (links) => {
//   const images = [];
//   try {
//     for (let i = 0; i < links.length; i++) {
//       const browser = await puppeteer.launch({
//         headless: false
//       });
//       const page = await browser.newPage();
//       page.setViewport({
//         width: 1080,
//         height: 720
//       });
//       await page.goto(links[i]);
//       let nextBtn = await page.evaluate("document.querySelectorAll('.coreSpriteRightChevron')");
//       while (nextBtn === undefined) {
//         const imgs = await page.evaluate(extractImage);
//         for (let i = 0; i < imgs.length; i++) {
//           if (!images.includes(imgs[i])) {
//             images.push(imgs[i]);
//           }
//         }
//         await page.click('.coreSpriteRightChevron');
//         nextBtn = await page.evaluate("document.querySelectorAll('.coreSpriteRightChevron')");
//       }
//       browser.close();
//     }
//   } catch (err) {
//     console.log(err);
//   }
//   return images;
// }

// const scrapeInfiniteScrollItems = async page => {
//   const allLinks = [];
//   try {
//     while (allLinks.length < numberOfPosts) {
//       const links = await page.evaluate(extractLink);
//       for (let i = 0; i < links.length; i++) {
//         if (!allLinks.includes(links[i])) {
//           allLinks.push(links[i]);
//         }
//       }
//       previousHeight = await page.evaluate('document.body.scrollHeight');
//       await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
//       await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`, {
//         timeout: 3000
//       });
//       await page.waitFor(300);
//     }
//   } catch (err) {}
//   return await scrapPostImage(allLinks);
// }

// const scrapeImgUrls = async () => {
//   try {
//     console.log('🚀  Launching...');
//     const time1 = Date.now();
//     const browser = await puppeteer.launch({
//       headless: false
//     });
//     const page = await browser.newPage();
//     page.setViewport({
//       width: 1080,
//       height: 720
//     });

//     console.log('🌎  Visiting web page...');
//     await page.goto(instagramAccount);

//     console.log('⛏  Scraping image URLs...');
//     const imgs = await scrapeInfiniteScrollItems(page);
//     await Promise.all(imgs.map(async file => {
//       await downloadImg({
//         url: file,
//         dest: IMAGE_DIRECTORY
//       });
//     }));
//     const time2 = Date.now()

//     console.log(`👌  Done -- downloaded \x1b[36m${imgs.length}\x1b[0m album covers!`);
//     let timeTake = time2 - time1;
//     let unit = 'milliseconds';
//     if (timeTake >= 1000 && timeTake < 60000) {
//       timeTake = Math.round(timeTake / 1000);
//       unit = 'seconds';
//     }
//     if (timeTake >= 60000) {
//       timeTake = Math.round(timeTake / 60000);
//       unit = 'minutes';
//     }
//     console.log(`It took about ${timeTake} ${unit}!`);
//     return browser.close();
//   } catch (err) {
//     console.log(err);
//   }
// }

// scrapeImgUrls();