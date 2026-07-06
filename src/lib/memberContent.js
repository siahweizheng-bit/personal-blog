// ── 会员内容加密（构建端） ──
// 会员文章的「续读」部分在构建时用 AES-256-GCM 加密后才放进页面，
// 公开 HTML 里只有密文；密钥保存在 .env（MEMBER_CONTENT_KEY）与
// Google Apps Script 的 Script Properties（MEMBER_KEY）中。
// 读者在付费墙输入邮箱 → Apps Script 查 Members 表 → 通过则返回密钥 →
// 浏览器用 Web Crypto 解密并显示全文。
import crypto from 'node:crypto';

const KEY_HEX = (import.meta.env.MEMBER_CONTENT_KEY || process.env.MEMBER_CONTENT_KEY || '').trim();

export const memberKeyConfigured = /^[0-9a-fA-F]{64}$/.test(KEY_HEX);

if (!memberKeyConfigured) {
  console.warn('[member] 未配置 MEMBER_CONTENT_KEY（.env），会员文章将只显示试读，无法在线解锁。');
}

/**
 * 把 { zh, en } 的 HTML 加密成 { iv, data }（均为 base64）。
 * data = 密文 + 16 字节 GCM tag，与浏览器 Web Crypto 的 AES-GCM 解密格式一致。
 */
export function encryptMemberContent(payload) {
  if (!memberKeyConfigured) return null;
  const key = Buffer.from(KEY_HEX, 'hex');
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const plain = Buffer.from(JSON.stringify(payload), 'utf8');
  const enc = Buffer.concat([cipher.update(plain), cipher.final(), cipher.getAuthTag()]);
  return { iv: iv.toString('base64'), data: enc.toString('base64') };
}
