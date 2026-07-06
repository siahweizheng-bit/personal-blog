import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import fs from 'fs';

const env = Object.fromEntries(
  fs.readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const notion = new Client({ auth: env.NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });
const dbId = env.NOTION_DATABASE_ID;

const res = await notion.databases.query({ database_id: dbId });
console.log(`共 ${res.results.length} 行\n`);

for (const page of res.results) {
  const p = page.properties;
  const titleProp = Object.values(p).find((v) => v.type === 'title');
  const title = (titleProp?.title || []).map((t) => t.plain_text).join('') || '(无标题)';
  const blocks = await n2m.pageToMarkdown(page.id);
  const md = (n2m.toMarkdownString(blocks).parent || '').trim();
  console.log('—'.repeat(40));
  console.log('标题:', title);
  console.log('正文 markdown 长度:', md.length);
  console.log('正文前 200 字:\n', md.slice(0, 200));
  console.log('');
}
