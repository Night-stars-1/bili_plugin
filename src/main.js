/*
 *Author: Night-stars-1 nujj1042633805@gmail.com
 *Date: 2024-11-09 01:13:38
 *LastEditors: Night-stars-1 nujj1042633805@gmail.com
 *LastEditTime: 2024-12-16 19:59:44
 */
const path = require("path");
const { ipcMain, BrowserWindow } = require("electron");

// ipcMain.on("app/isDevMode", (event, message) => {
//   event.returnValue = true;
// });

ipcMain.on("config/getIsShowConsoleLog", (event, message) => {
  event.returnValue = true;
});

/**
 *
 * @param {BrowserWindow} window
 */
function main(window) {
  ipcMain.handle("plugin/toggleDevTools", (event, message) => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) focusedWindow.webContents.openDevTools(); // 打开开发者工具
  });
  
  loadAllPlugin();
}

/**
 * 加载所有插件的主进程
 */
function loadAllPlugin() {
  BILIPLUGIN.plugins.forEach((plugin) => {
    try {
      const pathname = plugin.pathname;
      const mainPath = plugin?.manifest?.injects?.main;
      if (mainPath) require(path.join(pathname, mainPath));
    } catch (error) {
      console.error(error);
    }
  });
}

module.exports = main;
