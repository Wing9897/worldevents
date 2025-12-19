@echo off
chcp 65001
setlocal enabledelayedexpansion

:: 檢查 .git 目錄是否存在
if not exist ".git\" (
    echo 正在初始化 Git 倉庫...
    git init
) else (
    echo Git 倉庫已初始化。
)

:: 獲取當前時間戳，格式為 YYYY-MM-DD_HH-MM-SS
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "timestamp=%dt:~0,4%-%dt:~4,2%-%dt:~6,2%_%dt:~8,2%-%dt:~10,2%-%dt:~12,2%"

:: 將所有文件添加到暫存區
echo 正在添加所有文件...
git add .

:: 使用時間戳作為提交信息進行提交
echo 正在提交更改...
git commit -m "更新 %timestamp%"

:: 顯示提交歷史
echo 正在顯示提交歷史...
git log --oneline -10

endlocal
pause