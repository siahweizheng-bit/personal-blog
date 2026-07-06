/** 订阅/会员/订单/等待名单 → Google 表格 + 自动确认邮件 */

// ── 可改配置 ──
const SITE_NAME = '公民白话文 · Plain Civil';
const DUITNOW_NOTE = '';  // 想在邮件里直接附上付款方式就填，例如：'DuitNow 转账至 012-3456789（Zach）'；留空则不附

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const p = (e && e.parameter) || {};
    const source = (p.source || '').toString();
    const name = p.name || '';
    const email = p.email || '';
    const now = new Date();

    let sheetName, header, row;
    if (source === 'member') {
      sheetName = 'Members';
      header = ['时间', '名字', 'Email', '付费状态', '备注'];
      row = [now, name, email, '待付款', ''];
    } else if (source.indexOf('buy-') === 0) {
      sheetName = 'Orders';
      header = ['时间', '名字', 'Email', '产品', '付费状态', '备注'];
      row = [now, name, email, source.replace(/^buy-/, ''), '待付款', ''];
    } else if (source.indexOf('notify-') === 0) {
      sheetName = 'Waitlist';
      header = ['时间', '名字', 'Email', '想要的产品'];
      row = [now, name, email, source.replace(/^notify-/, '')];
    } else {
      sheetName = 'Subscribers';
      header = ['时间', '名字', 'Email', '来源'];
      row = [now, name, email, source || 'subscribe'];
    }

    let sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
    if (sheet.getLastRow() === 0) sheet.appendRow(header);
    sheet.appendRow(row);

    if (email && email.indexOf('@') > 0) sendConfirm(source, name, email);

    return ContentService.createTextOutput(JSON.stringify({ ok: true, sheet: sheetName }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendConfirm(source, name, email) {
  const hi = name ? ('嗨 ' + name + '，') : '你好，';
  const pay = DUITNOW_NOTE ? ('\n付款方式：' + DUITNOW_NOTE + '\n') : '';
  let subject, body;

  if (source === 'member') {
    subject = '✅ 收到你的会员申请 · ' + SITE_NAME;
    body = hi + '\n\n收到你的会员申请！我们会尽快把 DuitNow 付款方式发到这个邮箱；确认付款后，你就能开始收到每周两篇会员专属文章。' + pay +
           '\n—— ' + SITE_NAME + '\n\n(English) We received your membership request and will email you the payment details shortly.';
  } else if (source.indexOf('buy-') === 0) {
    subject = '✅ 收到你的订单 · ' + SITE_NAME;
    body = hi + '\n\n收到你的订单！我们会尽快把 DuitNow 付款方式发到这个邮箱；确认付款后，立刻把 PDF 发给你。' + pay +
           '\n—— ' + SITE_NAME + '\n\n(English) We received your order and will email you the payment details. Your PDF follows once payment is confirmed.';
  } else if (source.indexOf('notify-') === 0) {
    subject = '✅ 已加入等待名单 · ' + SITE_NAME;
    body = hi + '\n\n手册上架时我们会第一时间通知你，并给你订阅者早鸟价。\n\n—— ' + SITE_NAME +
           '\n\n(English) You\'re on the waitlist — we\'ll notify you first at launch.';
  } else {
    subject = '✅ 订阅成功，谢谢支持 · ' + SITE_NAME;
    body = hi + '\n\n谢谢订阅！你已加入名单，之后的公民教育内容会发到这个邮箱。核心知识永远免费。\n\n—— ' + SITE_NAME +
           '\n\n(English) Thanks for subscribing to Plain Civil — you\'re on the list.';
  }

  MailApp.sendEmail({ to: email, subject: subject, body: body, name: SITE_NAME });
}

/**
 * 会员验证：GET ?action=member-verify&email=xxx
 * 在 Members 表里查 Email + 付费状态。状态是「已付款」（或 active/paid/是/ok，
 * 也兼容「已付…」开头的写法，如 已付款✅）就算有效会员，返回解密密钥。
 *
 * 首次设置（一次即可）：
 * 1. Apps Script 编辑器 → 项目设置 → 脚本属性 → 新增
 *    属性: MEMBER_KEY   值: 与网站 .env 里 MEMBER_CONTENT_KEY 相同的 64 位十六进制
 * 2. 部署 → 管理部署 → 编辑 → 新版本（谁可以访问：任何人）
 *
 * 日常操作：会员付款后，把 Members 表该行的「付费状态」改成 已付款；
 * 要取消资格就改回 待付款（或删掉该行）。
 */
function doGet(e) {
  const p = (e && e.parameter) || {};

  if (p.action === 'member-verify') {
    const email = (p.email || '').toString().trim().toLowerCase();
    const out = { ok: false };

    if (email && email.indexOf('@') > 0) {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Members');
      if (sheet && sheet.getLastRow() > 1) {
        // 列：时间 | 名字 | Email | 付费状态 | 备注
        const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();
        const PAID = ['已付款', '付款成功', 'active', 'paid', '是', 'ok'];
        for (let i = 0; i < rows.length; i++) {
          const em = (rows[i][2] || '').toString().trim().toLowerCase();
          const st = (rows[i][3] || '').toString().trim().toLowerCase();
          if (em === email && (PAID.indexOf(st) > -1 || st.indexOf('已付') === 0)) {
            out.ok = true;
            break;
          }
        }
      }
      if (out.ok) {
        const key = PropertiesService.getScriptProperties().getProperty('MEMBER_KEY') || '';
        if (key) {
          out.key = key;
        } else {
          out.ok = false;
          out.error = '尚未设置脚本属性 MEMBER_KEY';
        }
      }
    }

    return ContentService.createTextOutput(JSON.stringify(out))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput('接口运行中 ✅（含自动确认邮件 + 会员验证）');
}
