# QQbot-The-Werewolves-of-Millers-Hollow

让你在群里玩狼人杀的 QQ bot。

### Usage

### Tutorials

~~以下内容都在路上了。~~

该 bot 只会在配置文件限定的 QQ 群内生效。

##### 注册

使用 `register` 注册。

注册成功后会被 bot 添加到当局游戏人员名单中。

如续取消报名可使用 `register cancel`。

只能在游戏未开始时注册。

##### 开始游戏

使用 `@bot game start` 开始游戏

开始游戏后会根据配置文件里的角色分配方案随机分配角色。

如果配置文件内没有对应人数的角色分配方案则无法开始游戏。

##### 狼人

狼人在每晚可以杀人。

狼人可以用 bot 进行队内交流，使用方法为私信 bot 发送 `# <your message>`（该功能只能在晚上使用）。

每个除你之外狼人会收到 `(message from <sender>) <your message>`。

bot 会询问今晚狼人要杀的人，使用 `kill <qq>` 命令回复，若回复 `kill none` 则跳过本回合杀人。

如果有多个存活的狼人，则第一条合法的 kill 消息会生效。

当有 kill 消息生效后，狼人回合结束。

##### 女巫

女巫有一瓶毒药和一瓶解药。

bot 会告知女巫今晚谁死了，女巫可以用 `kill <qq>` 使用毒药，`save <qq>` 使用解药。

女巫需要使用 `continue` 命令跳过女巫回合。

为了游戏公平，及时你没有药可以使用也需要手动输入 `continue`。

##### 预言家

预言家每晚可以验一个人的身份。

使用 `suspect <qq>` 命令验人。

##### 猎人

猎人在死的时候可以杀人。

死亡后输入 `kill <qq>` 命令杀人。

### Requirements