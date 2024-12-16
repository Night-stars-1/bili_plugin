/*
 *Author: Night-stars-1 nujj1042633805@gmail.com
 *Date: 2024-11-09 01:13:38
 *LastEditors: Night-stars-1 nujj1042633805@gmail.com
 *LastEditTime: 2024-12-16 19:59:40
 */
import "./vue.js";

const regFetchData = [];
const regXhrData = [];
window.regFetchBefore = (url, func) => {
  regFetchData.push({
    url,
    before: func,
  });
}

window.regFetchAfter = (url, func) => {
  regFetchData.push({
    url,
    after: func,
  });
}

window.regXhrAfter = (url, func) => {
  regXhrData.push({
    url,
    after: func,
  });
}

const originalFetch = window.fetch;
window.fetch = async function (url, options) {
  const requestList = regFetchData.filter((item) => url.includes(item.url));

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

const originalOpen = XMLHttpRequest.prototype.open;
const originalSend = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
  this._method = method;
  this._url = url;
  this._async = async;

  return originalOpen.apply(this, arguments);
};

// 重写 send 方法，添加自定义逻辑
XMLHttpRequest.prototype.send = async function (body) {
  const requestList = regXhrData.filter((item) => this._url.includes(item.url));

  // 添加一个事件监听器，当请求完成时触发
  this.addEventListener("readystatechange", function () {
    if (this.readyState === 4) { // 请求完成
      for (const item of requestList) {
        const result = item.after?.(this);
    
        if (item.after && result === null) {
          Object.defineProperty(this, "responseText", {
            get: () => "",
          });
          Object.defineProperty(this, "status", {
            get: () => 204,
          });
        } else if (result && typeof result === "object") {
          Object.defineProperty(this, "responseText", {
            get: () => JSON.stringify(result),
          });
        }
      }
    }
  });

  // 调用原始的 send 方法
  return originalSend.apply(this, arguments);
};

// 打开开发者工具
document.addEventListener("keydown", (event) => {
  if (event.key === "F12") {
    biliBridgePc.callNative("plugin/toggleDevTools");
    event.preventDefault();
  }
});
