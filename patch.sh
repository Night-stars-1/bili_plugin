#!/bin/sh
###
 # @Author: Night-stars-1 nujj1042633805@gmail.com
 # @Date: 2024-11-09 01:13:38
 # @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 # @LastEditTime: 2024-11-09 01:14:02
### 

script_dir=$(dirname "$0")
# 查询注册表以获取哔哩哔哩的安装路径
install_path=$(reg query "HKEY_LOCAL_MACHINE\SOFTWARE\BiliBili\BiliBili" //s //f "InstallLocation" 2>/dev/null | findstr "InstallLocation" | awk '{print $NF}')

# 检查是否找到路径
if [ -n "$install_path" ]; then
    echo "哔哩哔哩 安装路径: $install_path"
else
    install_path=$1
    echo "哔哩哔哩 入参路径: $install_path"
fi

echo "开始修补"
asar e "$install_path/resources/app.asar" "$install_path/resources/app"

app_js="$install_path/resources/app/main/index.js"
if ! head -n 5 "$app_js" | grep -q 'const'; then
    cat "$script_dir/path.js" "$install_path/resources/app/main/index.js" > temp_file.js && mv temp_file.js "$install_path/resources/app/main/index.js"
    echo "注入插件驱动完成"
fi
asar p "$install_path/resources/app" "$install_path/resources/app.asar"
rm -rf "$install_path/resources/app"
echo $script_dir
cp -r "$script_dir" "$install_path/external_modules"
echo "修补完成"
