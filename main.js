const regexURL = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
const regexNum = /(\d+)(?!.*\d)/;
const form = document.querySelector('form');
const input = document.querySelector('#URL');

async function scrap(url) {
  const PROXY_URL = 'https://stark-anchorage-11922.herokuapp.com/';
  const SCRAP_PROXY = 'https://api.scraperapi.com?api_key=5983be0e42093018d5c0ba9aa624b48b&url=';
  const imagesBaseURL = 'https://images.asos-media.com/products/chernye-dzhinsy-s-zavyshennoj-taliej-asos-design-tall/';
  const imageURLQuery = '?$XXL$&wid=513&fit=constrain';
  const priceBaseURL = 'https://www.asos.com/api/product/catalogue/v3/stockprice?productIds=';
  const priceURLQuery = '&store=RU&currency=USD&keyStoreDataversion=j42uv2x-26';

  try {
    const productId = regexURL.exec(url)[6].match(regexNum)[0];
    const html = await (await fetch(`${PROXY_URL}${url}`)).text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    const priceReq = await fetch(`${SCRAP_PROXY}${priceBaseURL}${productId}${priceURLQuery}`);
    const prices = await priceReq.json();

    const galleryURLs = [];
    for (let i = 2; i <= 4; i++) {
      galleryURLs.push(await fetch(`${imagesBaseURL}${productId}-${i}${imageURLQuery}`).then(res => res.url));
    }
    const page = doc.body;

    return {
      page,
      prices,
      galleryURLs
    };
  } catch (e) {
    console.error(e.message);
  }
}

form.addEventListener('submit', e => {
  e.preventDefault();
  try {
    scrap(input.value).then(res => {
      const title = res.page.querySelector('.product-hero h1').textContent;
      const mainImg = res.page.querySelector('#product-gallery.product-carousel img').getAttribute('src');
      const gallery = res.galleryURLs;
      const currentPrice = res.prices[0].productPrice.current.text;
      const previousPrice = res.prices[0].productPrice.previous.text;

      console.log({
        title,
        currentPrice,
        previousPrice,
        mainImg,
        gallery
      });
    });
  } catch (e) {
    console.error(e.message);
  }
})
