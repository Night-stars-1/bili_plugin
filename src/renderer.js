/*
 *Author: Night-stars-1 nujj1042633805@gmail.com
 *Date: 2024-11-09 01:13:38
 *LastEditors: Night-stars-1 nujj1042633805@gmail.com
 *LastEditTime: 2024-11-09 14:09:07
 */
const regRequestData = [];
function regFetchBefore(url, func) {
  regRequestData.push({
    url,
    before: func,
  });
}

function regFetchAfter(url, func) {
  regRequestData.push({
    url,
    after: func,
  });
}

const originalFetch = window.fetch;
window.fetch = async function (url, options) {
  const requestList = regRequestData.filter((item) => url.includes(item.url));

  for (const item of requestList) {
    const result = await Promise.resolve(item.before?.(url, options));
    if (item.before && result === null) {
      return new Response(null, { status: 204 });
    } else if (result && typeof result === "object") {
      options = { ...options, ...result };
    }
  }

  // 调用原始的 fetch 函数
  let response = await originalFetch(url, options);

  for (const item of requestList) {
    const result = await Promise.resolve(item.after?.(response.clone()));

    if (item.after && result === null) {
      // 如果 `after` 返回 null，返回一个空响应
      return new Response(null, { status: 204 });
    } else if (result && typeof result === "object") {
      // 如果 `after` 返回一个对象，修改响应
      response = new Response(JSON.stringify(result), {
        headers: response.headers,
        status: response.status,
        statusText: response.statusText,
      });
    }
  }

  // 返回响应对象
  return response;
};
