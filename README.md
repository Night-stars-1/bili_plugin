<!--
 * @Author: Night-stars-1 nujj1042633805@gmail.com
 * @Date: 2024-11-09 01:13:38
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-11-09 01:24:31
-->
# 哔哩哔哩PC端插件加载器

> [!TIP]
> 理论上支持目前任意版本 \
> 请不要在国内平台宣传

## 使用方法
```shell
npm install asar -g
sh path.sh <exe目录>
```

## 插件
- **目录**: 文档下的`BILIPLUGIN`目录
- 在`plugins`文件夹下新建`插件文件夹`
- 在`插件文件夹`下写入如下配置文件`manifest.json`
```json
{
    "manifest_version": 1,
    "id": "唯一识别",
    "name": "名称",
    "description": "描述",
    "injects": {
        "main": "主进程脚本相对路径",
        "preload": "预渲染进程脚本相对路径",
        "renderer": "渲染脚本相对路径"
    }
}
```
**示例:**
```json
{
    "manifest_version": 1,
    "id": "",
    "name": "测试",
    "description": "测试",
    "injects": {
        "main": "./src/main.js",
        "preload": "./src/preload.js",
        "renderer": "./src/renderer.js"
    }
}
```
```
BILIPLUGIN
└─ 📁plugins
   └─ 📁test
      ├─ 📁src
      │  ├─ 📄main.js # 主进程脚本
      │  ├─ 📄preload.js # 预渲染进程脚本
      │  └─ 📄renderer.js # 渲染脚本
      └─ 📄manifest.json
```