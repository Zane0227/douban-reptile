#!/usr/bin/env forever
const schedule = require('node-schedule');
const { getList, init } = require('./component/puppeteer');
const nodemailer = require("nodemailer");
const userInfo = require('./util/user')
const { host, user, pass, from, to } = userInfo


// 创建Nodemailer传输器 SMTP 或者 其他 运输机制
let transporter = nodemailer.createTransport({
  host, // 第三方邮箱的主机地址
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user, // 发送方邮箱的账号
    pass, // 邮箱授权密码
  },
});

const run = async () => {
  await init();
  console.log('🐞🐞🐞 爬虫正常运行中 🐞🐞🐞');
  const rule = new schedule.RecurrenceRule();
  rule.second = [0]; // 每分钟运行一次
  // 启动任务
  schedule.scheduleJob(rule, async () => {
    const list = await getList();
    console.log(list)
    const filtered = list.filter((item) => {
      item.status !== 'Contact Us'
    })
    if (!filtered.length) {
      console.log('无变动')
      return;
    }
    console.log(filtered)
    let html = '<h2>下列房源状态发生改变,可点击url直达</h2>'
    for (let item of filtered) {
      const { href, detail, status, name } = item
      if (!['C1', 'C2'].includes(name)) continue;
      html += `<div><h3><a href="${href}">${name}  ${detail}</a>  status: ${status}</h3></div>`
    }
    console.log(html)
    // 定义transport对象并发送邮件
    const info = await transporter.sendMail({
      from, // 发送方邮箱的账号
      to, // 邮箱接受者的账号
      subject: "房源状态变动通知", // Subject line
      html: html, // html 内容, 如果设置了html内容, 将忽略text内容
    });
    console.log(info)
  });
};
// const run = async () => {
//   await init();
//   console.log('🐞🐞🐞 爬虫正常运行中 🐞🐞🐞');
//   const list = await getList();
//   console.log(list)
// };
run();
