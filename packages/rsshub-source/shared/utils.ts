import { XMLParser } from "fast-xml-parser";

const RSS_HUB_PREFIX = 'https://rsshub.app'
const LOCAL_RSS_HUB_PREFIX = 'http://localhost:1200'

export function getRSSComplementURL (param: {
  path: string;
  payload: Record<string, any>;
}) {
  const prefix = LOCAL_RSS_HUB_PREFIX
  const { path, payload } = param

  let curPath = path;

  Object.entries(payload).forEach(([key, value]) => {
    curPath = curPath.replace(new RegExp(`:${key}\\??`), value)
  })
  console.log('curPath: ', curPath);
  // 清理可选的参数
  curPath = curPath.replace(/\/:\w+\??/g, '').replace(/\/{2,}/g, '')

  return `${prefix}/${curPath}`
}

export interface RSSItem{
  title: string;
  description: string;
  pubDate: string;
  guid: string; // url
  link: string;
  author: string;
  content?: string | {
    html?: string
    [k: string]: string
  }
}

export function toRSS_JSON (rssXML: string): {
  lastBuildDate: Date
  item: RSSItem[]
} {
  const parser = new XMLParser();
  const obj = parser.parse(rssXML);

  const { lastBuildDate, item } = obj.rss.channel

  return {
    lastBuildDate: new Date(lastBuildDate),
    item
  };
}