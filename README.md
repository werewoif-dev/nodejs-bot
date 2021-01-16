# werewolf-bot

让你在群里玩狼人杀的 QQbot。

### Usage

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

**以下所有角色命令的 `<player>` 部分请自行使用 qq 或 nick 或座位号替换。**

##### 角色功能

在分配到角色后使用 `help` 命令即可查看角色功能，包括用法和注意事项等。

### Requirements

* Mirai Console
* Mirai HTTP API
* Mirai Node SDK