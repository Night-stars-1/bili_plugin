/*
 *Author: Night-stars-1 nujj1042633805@gmail.com
 *Date: 2024-11-08 22:14:20
 *LastEditors: Night-stars-1 nujj1042633805@gmail.com
 *LastEditTime: 2024-11-09 16:28:21
 */
const path = require("path");
const preloadScriptPath = process.argv.find((arg) =>
  arg.includes("preload.js")
);
const BILIPLUGIN_STR = process.argv
  .find((arg) => arg.startsWith("BILIPLUGIN:"))
  .replace("BILIPLUGIN:", "");
const BILIPLUGIN = JSON.parse(BILIPLUGIN_STR);
require(preloadScriptPath);
const BASEPATH = BILIPLUGIN.BASEPATH;
loadAllPreloadPlugin();
const { contextBridge } = require("electron");

// 加载渲染进程
document.addEventListener("DOMContentLoaded", () => {
  // <script type="module" src="renderer.js"></script>
  const script = document.createElement("script");
  script.type = "module";
  script.src = `file://${BASEPATH}/external_modules/src/renderer.js`;
  script.onload = () => {
    loadAllRendererPlugin();
  };

  document.head.prepend(script);
});

/**
 * 加载所有插件的预渲染进程
 */
function loadAllPreloadPlugin() {
  BILIPLUGIN.plugins.forEach((plugin) => {
    try {
      const pathname = plugin.pathname;
      const preloadPath = plugin?.manifest?.injects?.preload;
      if (preloadPath) require(path.join(pathname, preloadPath));
    } catch (error) {
      console.error(error);
    }
  });
}

/**
 * 加载所有插件的渲染进程
 */
function loadAllRendererPlugin() {
  BILIPLUGIN.plugins.forEach((plugin) => {
    try {
      const pathname = plugin.pathname;
      const rendererPath = plugin?.manifest?.injects?.renderer;
      if (rendererPath) {
        const script = document.createElement("script");
        script.type = "text/JavaScript";
        script.src = path.join("file://", pathname, rendererPath);
        document.head.prepend(script);
      }
    } catch (error) {
      console.error(error);
    }
  });
}
