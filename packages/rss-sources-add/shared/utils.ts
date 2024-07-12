import { XMLParser } from "fast-xml-parser";

const RSS_HUB_PREFIX = 'https://rsshub.app'
const LOCAL_RSS_HUB_PREFIX = 'http://localhost:1200'

export function getRSSPreviewURL (param: {
  path: string;
  payload: Record<string, any>;
}) {
  const prefix = LOCAL_RSS_HUB_PREFIX
  const { path, payload } = param

  let curPath = path;

  Object.entries(payload).forEach(([key, value]) => {
    if (value) {
      curPath = curPath.replace(new RegExp(`:${key}\\??`), value)
    }
  })

  return `/${curPath}`
}
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
  // 清理可选的参数
  curPath = curPath.replace(/\/:\w+\??/g, '').replace(/\/{2,}/g, '')

  return `${prefix}/${curPath}`
}

export function parseRSSUrl (url: string) {
  const prefix = LOCAL_RSS_HUB_PREFIX
  const [path, query] = url.split('?')
  const params = new URLSearchParams(query)
  const payload: Record<string, any> = {}

  params.forEach((value, key) => {
    payload[key] = value
  })

  return {
    path: path.replace(prefix, ''),
    payload
  }
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

export interface RSSSource {
  group: string
  subGroup: string
  title: string
  route: {
    author: string
    example: string,
    path: string,
    radar?: string,
    rssbud?: string
    paramsdesc?: string[]
  },
  tipsMarkDown: string[]
  tables?: string[]
}

export function genUniquePlatformKey (s?: RSSSource) {
  if (!s) {
    return
  }
  return `${s.group}/${s.subGroup}`;
}

/**
 * Mainly derived from chatGPT-3.5, with a few minor modifications
 */
export function extractParams (pattern: string, url: string) {
  // 将模式字符串中的冒号替换为匹配任意非斜杠字符的正则表达式
  const regexPattern = pattern.replace(/\/:[^/]+/g, '\/?([^/]+)?');

  // 构建正则表达式对象
  const regex = new RegExp(regexPattern);

  // 匹配 URL 获取参数值
  const matches = url.match(regex);

  // 提取参数名和对应的值
  const paramNames = pattern.match(/:[^/]+/g).map(name => name.slice(1));
  const paramValues = matches ? matches.slice(1) : [];

  // 将参数名和值组合成对象
  const result = {};
  paramNames.forEach((name, index) => {
    // 如果值存在则使用该值，否则将值设为undefined
    result[name] = paramValues[index] !== undefined ? paramValues[index] : result[name];
  });

  return result;
}


export function getParamsFromPath(path: string, desc?: string[]) {
  const params = path.split('/').filter(p => p.trim().startsWith(':'))
  return params.map((p, index) => {
    const optional = /\?$/.test(p)
    return {
      name: optional ? p.slice(1, -1) : p.slice(1),
      optional,
      desc: desc?.[index]
    }
  })
}
