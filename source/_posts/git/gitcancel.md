---
title: Git 撤销操作
date: 2016-04-12 20:55:24
tags: Git
category: 工具配置
---

刚开始正式使用git不久，很多使用方法不是很了解，提交文件什么的总是提心吊胆的，生怕项目代码给自己弄乱，一开始为了保险还傻傻的copy一份放起来再做git提交。

今天学习了git撤销的一些命令。发现git作为一个版本控制系统，项目的备份本来就是它自己的一种特性，它完全允许我们在各个git动作之间穿梭。手动copy备份真是太2了。

总结一下，撤销相关的命令有reset、checkout、clean

　　

checkout

git checkout -- file

撤销对文件的修改，分两种情况

1、文件之前添加到暂存区之后做的修改，执行此命令相当于 本地的 file <== 暂存区的file

2、暂存区没有该文件，执行此命令相当于 本地的file <== 最新版本库的file

也可以用  git checkout .  (.代表所有文件)，撤销本地所有文件的改动

 

git checkout --ours / --theirs file

合并出现冲突的时候，可以使用此命令将冲突文件重置为当前分支 (ours) 的，或者另一分支 (theirs) 的文件

reset 

git reset --hard [commit]

让本地文件回退到某一个版本，版本可以用SHA值指定，查看SHA值可以用 git log 或者git log --pretty=oneline (简化的log信息)查看

那如果我回退到了一个版本，但是后来发现我又想回到前面的版本怎么办，git log 都找不到了！！！！

没关系，git 还有办法： git reflog 就可以找到全部的commit的SHA值了

 

git reset HEAD [file]

将文件从暂存区删除

 

clean

git clean -fd 

这条命令是用来删除新增加的而且没有放到暂存区的文件，既 使用git status 时， 标记为  Untracked files 的那些文件

 
