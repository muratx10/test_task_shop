// async function scrap(url) {
//   const PROXY_URL = 'https://stark-anchorage-11922.herokuapp.com/';
//   const html = await (await fetch(`${PROXY_URL}${url}`)).text();
//   const doc = new DOMParser().parseFromString(html, 'text/html');
//   return doc.body;
// }

// scrap(URL).then(res => {
//   console.log(res);
//   console.log(res.querySelector('.product-hero h1').textContent);
// });


// get array of image URLs
/**
 * @param {string} url of main image
 * * @param {string} altTxt of main image
 */
function getImgUrls(url, altTxt) {
  const regex = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
  const [, , , , , , base] = regex.exec(url);
  const [, , , , , , , query] = regex.exec(url);
  const number = Number(altTxt.slice(-1));
  const str = base.substring(0, base.length - 1);
  const baseUrl = url.replace(`${base}${query}`, '');
  const urls = [];
  for (i = 1; i <= number; i++) {
    urls.push(`${baseUrl}${str}${i}${query}`);
  }
  return urls;
}

// ---------------------------------------------------------------------------------------------------------------------------
// РЕШЕНИЕ с помощью puppeteer.js (работает только в терминале)
// 1. npm install
// 2. node index.js

const puppeteer = require('puppeteer');

/**
 * @param {string} url of page
 */
async function scrapTest(url) {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    // setting custom user agent to prevent blocking automated processes by website
    page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.16 Safari/537.36'
    );
    await page.goto(url);

    // get element that contains title
    const [node1] = await page.$x('//*[@id="aside-content"]/div[1]/h1');
    const title = await node1.getProperty('textContent');
    const Title = await title.jsonValue();

    // get element that contains current price
    const [node2] = await page.$x(
      '//*[@id="product-price"]/div[1]/span/span[4]/span[1]'
    );
    const currentPrice = await node2.getProperty('textContent');
    const CurrentPrice = await currentPrice.jsonValue();

    // get element that contains previous price
    const [node3] = await page.$x(
      '//*[@id="product-price"]/div[1]/span/span[2]'
    );
    const prevPrice = await node3.getProperty('textContent');
    const PrevPrice = await prevPrice.jsonValue();

    // get URL of main image
    const [node4] = await page.$x(
      '//*[@id="product-gallery"]/div[1]/div[2]/div[5]/div/div/div/div[1]/div[1]/div[3]/div/div/img'
    );
    const imageURL = await node4.getProperty('src');
    const imgAlt = await node4.getProperty('alt');
    const alt = await imgAlt.jsonValue();
    const ImageURL = await imageURL.jsonValue();


    const AllImgUrls = getImgUrls(ImageURL, alt);

    console.log({
      Title,
      CurrentPrice,
      PrevPrice,
      ImageURL,
      AllImgUrls,
    });

    browser.close();
  } catch (err) {
    console.error(err.message);
  } finally {
    await browser.close();
  }
}

scrapTest('https://www.asos.com/ru/asos-tall/chernye-dzhinsy-s-zavyshennoj-taliej-asos-design-tall/prd/10264367?clr=odnotonnyj-chernyj&colourwayid=15106387&SearchQuery=&cid=3630');
scrapTest('https://www.asos.com/ru/adidas-originals/belaya-olimpijka-s-logotipom-adidas-originals-locked-up/prd/14125453?clr=belyj&colourwayid=16593428&SearchQuery=&cid=2641');


// ---------------------------------------------------------------------------------------------------------------------------
// РЕШЕНИЕ В ЛОБ ДЛЯ РАБОТЫ ВНУТРИ БРАУЗЕРА
// В КОНСОЛЬ БРАУЗЕРА ВСТАВИТЬ ФУНКЦИЮ getImgUrls, ВСТАВИТЬ ФУНКЦИЮ scrapWithinBrowser и вызвать ее

function scrapWithinBrowser() {
  const mainImg = document.querySelector('.fullImageContainer .img');
  const imgSrc = mainImg.getAttribute('src');
  const imgCount = mainImg.getAttribute('alt');
  const title = document.querySelector('#asos-product .product-hero h1').textContent;
  const currentPrice = document.querySelector('.current-price').textContent;
  const prevPrice = document.querySelectorAll("[data-id='previous-price']")[0].textContent;
  const urls = getImgUrls(imgSrc, imgCount);
  return {
    title,
    currentPrice,
    prevPrice,
    imgSrc,
    urls
  }
}