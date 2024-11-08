/*
 *Author: Night-stars-1 nujj1042633805@gmail.com
 *Date: 2024-11-08 22:17:13
 *LastEditors: Night-stars-1 nujj1042633805@gmail.com
 *LastEditTime: 2024-11-08 23:46:00
 */
const fs = require("fs");
const path = require("path");
const { app } = require("electron");

const DOCUMENTS = app.getPath("documents");
const BILIPLUGINPATH = path.join(DOCUMENTS, "BILIPLUGIN", "plugins");

function findAllPlugin() {
  const plugins = [];
  try {
    fs.mkdirSync(BILIPLUGINPATH, { recursive: true });
    for (const _pathname of fs.readdirSync(BILIPLUGINPATH, "utf-8")) {
      try {
        const pathname = path.join(BILIPLUGINPATH, _pathname);
        const filepath = path.join(pathname, "manifest.json");
        const manifest = JSON.parse(fs.readFileSync(filepath, "utf-8"));
        plugins.push({ pathname, manifest });
      } catch (error) {
        console.error(error);
        continue;
      }
    }
  } catch (error) {
    app.on("ready", () => {
      dialog.showMessageBox(null, {
        type: "warning",
        title: "BILIPLUGIN",
        message: `读取数据目录异常！\n${error}`,
      });
    });
  }
  return plugins;
}

function loadAllPlugin() {
  const plugins = findAllPlugin();
  console.log(`找到${plugins.length}个插件`);
  return plugins;
}

module.exports = {
  loadAllPlugin,
};
