---
title: new-ubuntu
tags:
---

## window bash 

lxrun -h

lxrun /unstall /full

lxrun /install

lxrun /setdefaultuser root

## 安装 zsh
```
apt install zsh
```

设置默认 shell 
```
chsh -s /bin/zsh
```

## 安装 on-my-zsh (github)

[https://github.com/robbyrussell/oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh)
```
sh -c "$(wget https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"
```

## 安装 git
apt install git

## 安装 autojump

apt-get install autojump
接着，输入

//没有安装git的先安装git,安装命令:sudo apt-get install git
git clone https://github.com/joelthelion/autojump.git
进入autojump 的目录，cd autojump，执行

python ./install.py
最后其会有提示:

//每个用户的提醒都不太一样
vim ～/.zshrc 添加如下到 ~/.zshrc
[[ -s /home/dong/.autojump/etc/profile.d/autojump.sh ]] && source /home/tan/.autojump/etc/profile.d/autojump.sh

autoload -U compinit && compinit -u

至此，autojump安装完成


## nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | zsh