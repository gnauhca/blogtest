---
title: 通过配置ssh密钥认证连接Git
date: 2016-05-11 20:35:37
tags: Git
category: 工具配置
---

#通过配置ssh密钥认证连接Git

## 说明

### 1. Git 

提供git服务的托管服务器，以 github 为例子说明。github服务支持使用ssh协议和https协议。

### 2. SSH协议
ssh--“安全外壳协议”，专为远程登录会话和其他网络服务提供安全性的协议。支持两种加密方式：
* 密码加密，每次传输需要提供账户、密码作为认证凭证
* 密钥加密，使用一对密钥进行认证，配置好密钥之后，就可以不用打密码了（这才是重点）

## 开始
这一步目的，就是不再打密码向你的 github 提交东西。

1，在自己电脑上生成一对ssh密钥。

	ssh-keygen -t rsa -C "<github帐户名>"

期间你可以指定密钥的文件名，如这个是用来连接github的，那就可以打github
默认是id_rsa。生成的时候看一下，有个路径是告诉你密钥生成的路径一般windows是：C:\Users\用户名\.ssh；linux、mac下是 ~/.ssh/。这个路径下就会出现两个文件

* github        --密钥
* github.pub --公钥

2，把公钥上传到github上面
![](http://images2015.cnblogs.com/blog/847155/201601/847155-20160109192954184-353040641.png)


3，试一下成功了没

	ssh -T git@github.com

遇到一个警告yes过去，然后不出意外就能看到 Hi 某某某 你很叼哦连接到给github了什么之类的。那就代表成功了。

4，现在就可以使用ssh协议克隆项目了。就是git@..开头的项目地址

![](http://images2015.cnblogs.com/blog/847155/201601/847155-20160109193058418-2007308048.png)



这样克隆下来的项目，会有一条ssh协议项目远程地址的 记录  origin，可以用这个命令看到。

	$ git remote -v
	origin  git@github.com:zhzhchwin/test_git.git (fetch)
	origin  git@github.com:zhzhchwin/test_git.git (push)

然后提交的时候就会默认使用ssh协议用刚刚生成的密钥进行认证了。

如果之前有通过https 克隆下来的项目想要修改成ssh协议，可以使用下面的命令设置

	git remote set-url origin (ssh协议地址)


## 我需要连接不同的git的服务器

如果需要连接不同的git 服务器，就代表要为不同的服务器生成不同的密钥对。
那我们就要使用配置ssh 的 config 文件 来告诉电脑的 ssh客户端不同密钥和服务器的对应关系。

说配置这个文件之前有一个细节要注意，就是如果要使用多个密钥，需要将生成的密钥的私钥添加到私钥列表 否则不会成功
生成的密钥要使用 命令 ssh-add添加到密钥列表（私钥）

	$ ssh-add ~/.ssh/id_rsa1（添加服务器1的私钥）
	
	$ ssh-add ~/.ssh/id_rsa2（添加服务器2的私钥）

ssh的 config文件 在密钥默认生成的同目录下，没有的话手动创建一个。

格式：

	Host            别名
    HostName        主机名
    Port            端口
    User            用户名
    IdentityFile    密钥文件的路径

举个我的例子。公司项目搭了个gitlab服务器生成的密钥文件名字是gitlab，另一个是github 密钥文件名字是github，那么我的config文件就配成下面这样就行了。

	gitlab
	Host gitlab.com
	HostName gitlab.com
	IdentityFile ~/.ssh/gitlab
	
	github
	Host github.com
	HostName github.com
	IdentityFile ~/.ssh/github

接下来就可以使用这两个git服务器了。

