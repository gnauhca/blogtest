---
title: linux 批量重命名 (你只要会用 js replace 函数)
date: 2016-01-05
tags: linux
category: linux
---


<p style="color: red">注意：rename 命令有两个版本，这里只介绍 perl 版本。</p>
{% asset_img renameman.png %}

----

<br>
<br>

## 需求

今天工作的时候需要处理一批文件，具体命名形式是 a_b_c.xx，要把它们改成 b_a_c.xx。

## mv 命令？

mv 命令一次只能操作一个文件，这样效率就太低了。其实可以结合管道操作完成

{% asset_img renamemv.png %}



<br>

## 使用 rename 

我想推荐的是 rename 命令，rename 命令是专门中来重命名操作的。linux 下的 rename 命令有两种版本，一种是 C 语言版本， 一种是 perl 版。可以使用 man rename 看一下自己的是什么版本的。我电脑上的 perl 版本的，所以我就只介绍这个版本的用法啦。

基本用法:
```
rename 's/(查询的正则)/(替换的内容)/' 文件

```

其中 `'s/(查询的正则)/(替换的内容)/'` 是 perl 的一种正则的形式，不懂没关系，不影响我们完成重命名操作，写成 s(代表替换) 就行了。

剩下的，只要你会用 js String 的 replace 函数就 OK 拉。

如果把文件名当成是需要替换的字符串，那么在 js 里，我们会这样写。

```javascript
var filename = "a_b_c.txt"
filename.replace(/(.*?)\_(.*?)\_(.*?)/, '$2_$1_$3');
//"b_a_c.txt"
```

对应到 rename 命令中，就是

{% asset_img renameperl.png %}

Cool!! 效果是和 js replace 函数是一样的。这样的话，知道这个用法，就已经可以应付大多数的重命名需求了。

如果不行，请别找我... 

<br>
## 参考文章：

[[精华] Perl 中的正则表达式](http://bbs.chinaunix.net/forum.php?mod=viewthread&tid=159388)
