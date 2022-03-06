# Lite Studio

以 csv 文件作为数据库的纯前端音乐播放器，使用 vite 进行构建

# CHANGE LOG

- 2022-02-05
  - 从[这里](https://github.com/K-bai/csv-based-web-music-player)fork 代码

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run dev
```

### Compiles and minifies for production

```
npm run build
npm run preview
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cn.vitejs.dev/config/#configuring-vite).

## Task List

- [x] vue3 project creation with vite.
- [x] Refactor csv-based-web-music-player modules into vue3 compisation API base.
- [x] Implement requests based on axios
- [x] Implement local cache based on indexed lib dexie.
- [ ] Implement save playlist to localstorage feature
- [ ] Use lodash to implemmnt shuffle for the audio play shuffle mode.

## Project Dev Guideline

### Project Branche

Main: feature development for origin lite web studio. Please use the origin to contribute. No pull request will be accepted for this branch.
A-soul: A-soul customzied version of lite web studio, any new feature pull request please submit to here.
Release: branch for auto deplyment to [AS 录音棚 CN](https://studio.asf.ink/) or [AS 录音棚 Global](https://studio.a-soul.fans/)

### Directory Structure

```
LITE-WEB-STUDIO
├─public
│  └─datasheets
└─src
    ├─apis
    ├─assets
    │  └─ui
    ├─components
    │  └─popup
    ├─globals
    ├─styles
    └─utils
```

- public: 公共资源目录
  - datasheets: 数据库文件存放
- src: 项目代码
  - apis: 远程调用 API 格纳
  - assets: 静态资源
    - ui: ui 相关 svg 格纳
  - components: 播放器控件
    - popup: 弹窗相关功能子控件
  - globals: 全局变量结构定义，全局常量设置
  - styles: 各界面式样文件
  - utils: 共通处理

### Naming Convention

- 变量名，函数参数：Camel Case 小驼峰式命名法：首字母小写。开头单词为名词。eg：studentInfo、userInfo
- 方法名：Camel Case 小驼峰式命名法：首字母小写。开头单词为动词。eg：canRead、getName
- 函数内局部临时变量名: 前导下划线小字母。 eg：\_studentinfo, \_username
- 组件名，全局变量名：Pascal Case 大驼峰式命名法：首字母大写。eg：AudiooPlayer、HelloWorld
- 全局变量属性名，缓存对象名,object 属性名：Snake Case 蛇形命名法。全小写字母借由下划线连接。eg：empty_song、code_src
- bus event 事件名称：Kebab Case 短横线命名。单词以 ‘-’ 短横线连接，最后以 event 结尾。eg：update-song-list-event
