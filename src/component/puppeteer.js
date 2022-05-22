const puppeteer = require('puppeteer');

const url = 'https://thecommonwealthbldg.com/floorplans/';
let browser;
let page;
async function init() {
  console.time('环境初始化');
  // browser = await puppeteer.launch({ headless: false });
  browser = await puppeteer.launch();
  page = await browser.newPage();
  page.setViewport({
    width: 1920,
    height: 1080,
  });
  await page.goto(url);
  await page.waitForSelector('#content-container');
  console.timeEnd('环境初始化');
}
async function autoScroll() {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      const distance = 100;
      var timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}
async function getList() {
  console.time('刷新页面');
  // 获取元素innerText属性
  await page.goto(url);
  await page.waitForSelector('#content-container');
  await autoScroll();
  const lis = await page.$$('#content-container .floorplan-listing-b .floorplan-listing-b__list li');
  const list = []
  for (const li of lis) {
    const item = {
      name: await li.$eval('a div:nth-child(2) div h2', (h2) => h2.innerText),
      href: await li.$eval('a', (a) => a.href),
      detail: await li.$eval('a div:nth-child(2) div p:nth-child(2)', (p) => p.innerText),
      status: await li.$eval('a div:nth-child(2) div p:nth-child(3)', (p) => p.innerText),
    }
    list.push(item)
  }
  await page.evaluate( () => {
    window.scrollBy(0, -1 * document.body.scrollHeight);
  });
  console.timeEnd('刷新页面');
  return list;
}

module.exports = {
  getList,
  init,
};
