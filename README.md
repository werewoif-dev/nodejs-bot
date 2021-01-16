# werewolf-bot

让你在群里玩狼人杀的 QQbot。

### Tutorials

该 bot 只会在配置文件限定的 QQ 群内生效。

##### 注册

使用 `register` 注册。

注册成功后会被 bot 添加到当局游戏人员名单中。

如需取消报名可使用 `unregister`。

只能在游戏未开始时注册。

##### 开始游戏

使用 `start game` 开始游戏

开始游戏后会根据配置文件里的角色分配方案随机分配角色。

如果配置文件内没有对应人数的角色分配方案则无法开始游戏。

##### 角色功能

在分配到角色后使用 `help` 命令即可查看角色功能，包括用法和注意事项等。

**以下所有角色命令的 `<player>` 部分请自行使用 qq 或 nick 或座位号替换。**

### Usage

以下简短教程默认你有 NodeJS 基础且熟悉 Koishi 机器人部署。

1. clone 本项目到本地
2. 自行搭建 go-cqhttp 或类似服务
3. 复制 `config.example.yml` 到 `config.yml`，自行填写内容
4. 运行 `npm start` 启动程序

### Dependencies

* Koishi
* Mirai
* go-cqhttp