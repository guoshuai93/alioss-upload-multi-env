# alioss-upload-multi-env

## 介绍

现在和 ali-oss 上传相关的插件有很多，但在实际场景中，我们可能会有部署多套环境的需求（不同环境的 oss 配置也很可能不同），调研后发现绝大多数 oss 上传插件仅支持一套配置，所以写了一个这样的插件出来。支持自定义上传目录，支持多套 oss 配置。

## 安装

```bash
npm i -D alioss-upload-multi-env
```

## 使用

你所需要的仅仅只是名为 `.alioss.config.json` 的一个配置文件，它的内容如下：

```json
{
  // mode = test
  "test": {
    "USERNAME": "xxx",
    "PASSWORD": "xxx",
    "REGION": "xxx", // 如 oss-cn-beijing
    "BUCKET": "xxx"
  }
  // ...
}
```

另外在 `package.json` 里的 `scripts` 下配置对应的脚本，如：

```bash
"upload:test": "alioss-upload-multi-env --source dist/test --target static/your-project-name --mode test",
```
参数解释：
- --source: 待上传文件的相对目录；不能为空
- --target: oss 上文件的位；不能为空
- --mode: 指定 `.alioss.config.json` 里要读取的对应 mode 的配置
