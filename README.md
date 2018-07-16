# 悠然一指 App

## 开发

```sh
git clone http://192.168.30.4/yryz_new/yryz-app.git
```

安装依赖包：

```sh
yarn
```

切换环境，生成 `app.json`、`Constants.js` 等常量：

```sh
yarn env dev
```

环境参数有如下几种：

-	`dev`

-	`test`

-	`mo`

-	`prod`

运行：

如果使用 Expo：

```sh
yarn expo
```

如果是原生环境：

```sh
yarn start
```

然后从 IDE 启动。