/*
 *Author: Night-stars-1 nujj1042633805@gmail.com
 *Date: 2024-11-08 18:18:27
 *LastEditors: Night-stars-1 nujj1042633805@gmail.com
 *LastEditTime: 2024-11-09 14:31:49
 */
const path = require("path");
const { dialog, app } = require("electron");
const plugin = require("./plugin/index.js");
const BASEPATH = path.dirname(app.getPath("exe"));
BILIPLUGIN = {
  BASEPATH,
  plugins: plugin.loadAllPlugin(),
};
const main = require("./src/main.js");

let exitNum = 0;
process.exit = function (code) {
  if (code == 1 && exitNum <= 2) {
    console.log(`拦截退出成功`);
    exitNum++;
  }
};

const originalShowErrorBox = dialog.showErrorBox;
dialog.showErrorBox = function (title, content) {
  if (content.includes("程序异常，无法正常运行！错误代码：01")) {
    console.log(`拦截报错: ${content}`);
    return;
  }
  originalShowErrorBox(title, content);
};

require.cache["electron"] = new Proxy(require.cache["electron"], {
  get(target, property, receiver) {
    let electron = Reflect.get(target, property, receiver);
    if (property == "exports") {
      electron = new Proxy(electron, {
        get(target, property, receiver) {
          const BrowserWindow = Reflect.get(target, property, receiver);
          if (property != "BrowserWindow") return BrowserWindow;
          return new Proxy(BrowserWindow, {
            construct: function (target, argArray, newTarget) {
              const args = argArray[0];
              args.webPreferences.sandbox = false;
              // args.webPreferences.nodeIntegration = true;
              args.webPreferences.devTools = true;
              const preload = args.webPreferences.preload;
              if (typeof preload == "string") {
                args.webPreferences.preload = path.join(
                  __dirname,
                  "src",
                  "preload.js"
                );
                args.webPreferences.additionalArguments = [
                  preload,
                  `BILIPLUGIN:${JSON.stringify(BILIPLUGIN)}`,
                ];
              }
              const window = Reflect.construct(target, argArray, newTarget);
              main(window);
              return window;
            },
          });
        },
      });
    }
    return electron;
  },
});
