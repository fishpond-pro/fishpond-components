export function getRSSComplementURL (param: {
  path: string;
  payload: Record<string, any>;
}) {
  const { path, payload } = param

  let curPath = path;

  Object.entries(payload).forEach(([key, value]) => {
    curPath = curPath.replace(new RegExp(`:${key}\\??`), value)
  })
  // 清理可选的参数
  curPath = curPath.replace(/\/:\w+\??/g, '').replace(/\/{2,}/g, '')

  return `/${curPath}`
}
