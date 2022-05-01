#!/usr/bin/env forever
const schedule = require('node-schedule');
const { getList, init } = require('./component/puppeteer');

const run = async () => {
  await init();
  console.log('🐞🐞🐞 爬虫正常运行中 🐞🐞🐞');
  const rule = new schedule.RecurrenceRule();
  rule.minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]; // 每隔五分钟运行一次
  // 启动任务
  schedule.scheduleJob(rule, async () => {
    const list = await getList();
    console.log(list)
  });
};
run();
