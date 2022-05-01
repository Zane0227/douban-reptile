const puppeteer = require('puppeteer');

const url = 'https://movie.douban.com/chart';
let browser;
let page;
async function init() {
  console.time('环境初始化');
//   browser = await puppeteer.launch({headless: false});
  browser = await puppeteer.launch();
  page = await browser.newPage();
  page.setViewport({
    width: 1920,
    height: 1080,
  });
  await page.goto(url);
  await page.waitForSelector('#content');
  console.timeEnd('环境初始化');
}
async function getList() {
  console.time('刷新页面');
  // 获取元素innerText属性
  await page.goto(url);
  await page.waitForSelector('#content');
  const trs = await page.$$('#content .indent table > tbody > tr');
  const list = []
  for(const tr of trs){
      const item = {
          name:  await tr.$eval('td:nth-child(2) div a', (a) => a.innerText),
          href: await tr.$eval('td:nth-child(2) div a', (a) => a.href),
          stars: await tr.$eval('.star span:nth-child(2)', (span) => span.innerText),
      }
      list.push(item)
  }
  console.timeEnd('刷新页面');
  return list;
}
module.exports = {
  getList,
  init,
};
