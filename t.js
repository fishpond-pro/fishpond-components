function extractParams(pattern, url) {
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

// 示例1
const pattern1 = '/a/:b/:c';
const url1 = 'https://rsshub.com/a/1/2';
const params1 = extractParams(pattern1, url1);
console.log(params1);  // 输出: { b: '1', c: '2' }

// 示例2
const pattern2 = '/a/:b/:c';
const url2 = 'https://rsshub.com/a/1';
const params2 = extractParams(pattern2, url2);
console.log(params2);  // 输出: { b: '1', c: undefined }
