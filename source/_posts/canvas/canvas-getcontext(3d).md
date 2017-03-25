---
title: Canvas getContext("3d")?
date: 2017-03-13 
tags: canvas
category: canvas
---

## 前言

不好意思，标题其实是开了个玩笑。大家都知道，Canvas 获取绘画上下文的 api 是 getContext("2d")。我第一次看到这个 api 定义的时候，就很自然的认为，既然有 2d 那一定是有 3d 的咯？ 但是我接着我看到了 api 介绍的这句话

> 提示：在未来，如果 canvas 标签扩展到支持 3D 绘图，getContext() 方法可能允许传递一个 "3d" 字符串参数。

what? 我有一句妈卖批不知当讲不当讲... 从接触 canvas 之后我就一直等这个未来，等到后来我学习 three.js... 再等到现在，这个 getContext("3d") 还是没有出来。可能是因为越来越多浏览器都已经支持 webgl 的原因把，这个 getContext("3d") 有可能再也不会来了。

{% asset_img webglsupport.jpg %} 

webGL 就是浏览器端的 3D 绘图标准，它直接借助系统显卡来渲染 3D 场景，它能制作的 3D 应用，是普通 canvas 无法相比的。所以，你有复杂的 3D 前端项目，且不考虑 IE 的兼容性的话。不用说，直接使用 webGL 吧。

## 不使用 webGL 制作简单的 3D 效果

然而，有的时候我们只需要实现简单的 3D 效果。在没有学习 webGL 或这方面的框架的情况下，我们其实也可以在普通的 canvas api 基础上制作出来。而且，我们可以兼容 IE 9。先来看看，我们都能做些什么效果。

[https://www.meizu.com/products/pro6/summary.html](https://www.meizu.com/products/pro6/summary.html)
{% asset_img pro6summary3d.gif %}


[https://www.meizu.com/products/pro6/performance.html](https://www.meizu.com/products/pro6/performance.html)
{% asset_img pro6experience3d.gif %}

这的两个效果都是工作时简单的 3D 效果需求，没有必要使用 webGL。然而当时我并没有使用今天介绍的办法，因为没有扩展到 3D 坐标去实现所以只能很繁琐的转换成 2D 平面图形分析出来。

{% asset_img pro6summaryhard.jpg %}
<br>
{% asset_img pro6experiencehard.jpg %}

如果当时能使用今天介绍方法，将可以很简单、在很短时间就能实现。

## 素描知识的启发
因为平时以前在学校的时候学习过素描，现在平常也会简单画一点，所以对素描知识我有一点点了解。画画描绘真实世界的三维场景，需要用到透视。这里我当然不介绍太多，简单来说就是我们理解的近大远小，可以用简单的线条连接表示出来。两条平行的直线在无穷远的地方看起来会汇集到一起，而汇集的点，在透视里称作消失点。通过找到这个消失点，还有平行线，就可以画出简单的立体感觉的图像。

{% asset_img toushi.jpg %}

观察上面这幅图，在这里所画的三维空间，所有的直线都是垂直与画面的，也就是所，如果用坐标描述每条直线上的任一点 v(x,y,z) 他们的 x,y 都是相等的。在画面上，离我们眼睛观察点越远的点，就越趋向与眼睛观察点的 x,y 。 那三维空间的坐标 v(x,y,z)，对应到平面的坐标 p(x',y') 其中这个 x,y 会随着 z 的变化，是不是会呈现一定的规律对应到 x', y' 呢？

## 回忆中学物理课

我想起了中学学习过的一节物理课。小孔成像

{% asset_img xiaokongchengxiang.jpg %}

三维空间的火焰，透过小孔，在二维成像屏上显示了二维的画面。那时候老师教我们，这其实最简单的照相机，和我们眼睛一样，光透过瞳孔，最终到达视网膜，在转换成我们看到的影像。照相机模拟我们的眼睛，所以拍出来的照片和我们眼睛看到的感觉是一样的。

我们试着把刚才的实验转换到简单的几何坐标中看。

{% asset_img xiaokongchengxiangzuobiao1.jpg %}

观察 yz (x=0) 截面，假设小孔为坐标原点 (0,0,0) 成像屏到小孔的距离为 d，图中火焰上的一个点 a(0,y,z) 投射到成像屏对应点 a2，可以求的 a2 在成像屏中的平面坐标：x2 = 0, y2 = y * (d/z)。我天，这么简单就找到了这个对应关系？ 先别急，为了方便开发，我们还需要做一点小转换。

## 像 CSS 3D 一样表示坐标

在 CSS 3D transform 中，我们需要定义 perspective 属性，用来说明观察点到屏幕的距离。如果一个点的 z 轴是 0， 那这个点是处于二维点一样的位置。z 轴越小（远离屏幕），对应到屏幕上的显示的点 xy 就越趋向于定义 perspective 属性容器的中心，也就是观察点、眼睛对应到屏幕的 xy。我们的目标就是用这种 CSS 3D 的方式表示三维的坐标（z = 0 的时候三维坐标的 xy 是和屏幕坐标的 xy 一样的），然后再套用我们找到的公式，计算出对应到屏幕中的二维坐标是多少，然后我们就可以用三维坐标描述点的位置，真正在 canvas 绘画的时候呢，通过简单的转换，用计算出来的二维坐标绘画。

{% asset_img xiaokongchengxiangzuobiao2.jpg %}

上一步求的 a2 对应的平面坐标是倒立的（成像屏的火焰也是倒过来的），我们可以想想在小孔与成像屏前方等距的位置放置显示屏，我们像 CSS 3D 一样，让坐标系原点就是显示屏的中点。而小孔，就成了我们的观察点，既眼睛所在的位置，眼睛离显示屏的距离就是 p(perspective)。由全等三角形的知识可以知道，上图中 a2' 刚好是 a2 正过来的坐标。咦，看来屏幕坐标完全可以简化三维坐标点和眼睛的连线与屏幕的交点。这样，一个三维空间的点坐标对应到屏幕坐标的关系就找出来了。


## 将这个关系用一个缩放值表示

既然已经描述出来这个关系了，我们再用把它表示成简单的公式。以便直接在代码中完成三维坐标到平面坐标的转换。

{% asset_img xiaokongchengxiangzuobiao3.jpg %}

已知观察者到屏幕的距离 p (perspective), 三维空间一个点的坐标 a(x,y,z)，求这个点在屏幕上的坐标。 图中，三维坐标 a 在坐标 xy 平面上的向量长度 d 和该点对应到屏幕上的点 a2' 在 xy 平面上的向量长度 d'，根据相似三角形，有这样的关系：

d'/d = p/(p+z)

x 和 y 的值同理：

x'/x = p/(p+z)   y'/y = p/(p+z)

原来，三维空间的点坐标的 x 和 y 对应到屏幕平面上是关于 z 和 p 成比例变化的这个比例值就是

scale = p/(p+z)

这个 scale 随着物体到屏幕的距离的值的变大而变小。这也很好地解释了为什么我们看东西会近大远小的原因：

{% asset_img xiaokongchengxiangzuobiao4.jpg %}


## 缩放值的使用实例
假设我们的眼睛看的就是屏幕中央，我们现在在 y = cvs.height + 5 的 xz 平面上一个正方形区域画一系列的变长为 5 的矩形点。如果不做处理，那么可以想到我们直接使用些点的 x, y 坐标画的点，肯定在画布上是看不到的，因为范围超出了画布。而真实的世界里，我们是可以看到远处的点的，远处的点是趋向与屏幕中央的。

#### 代码 1：

```javascript
let cvs = document.querySelector('canvas');
let ctx = cvs.getContext('2d');

class Point {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

// 根据 perspective 和 z 获取三维坐标对应二维坐标的xy缩放值
function getScaleByZ(z, p=600) {
    let scale; 
    if (z > p) {
        scale = Infinity;
    } else {
        scale = p / (-z + p);
    }
    return scale;
}

function draw() {
    ctx.clearRect(0,0,cvs.width,cvs.height);
    
    let rectWidth = 5;
    points.forEach((point)=>{
        let scale = getScaleByZ(point.z);
        let drawX = center.x + (point.x -  center.x) * scale;
        let drawY = center.y + (point.y -  center.y) * scale;
        let drawWidth = rectWidth * scale

        ctx.fillStyle = '#abcdef';
        ctx.fillRect(drawX, drawY, drawWidth, drawWidth);
    });
}


let center = new Point(cvs.width/2, cvs.height/2, 0);
let points = [];
let xCount = 20; // x 方向的点数
let zCount = 20; // z 方向的点数
let step = cvs.width / xCount; // x 方向点之间的间隔

for (let i = -(xCount - 1) / 2; i <= (xCount - 1) / 2; i++) {
    for (let j = -(zCount - 1) / 2; j <= (zCount - 1) / 2; j++) {

        let x = i;
        let z = j;
        let y = 0;

        console.log(x,y,z);

        points.push(
            new Point((x + xCount/2) * step, cvs.height + 1, z * step)
        );
    }
}

draw();
```

#### 效果 1：

{% asset_img daimaxiaoguo1.jpg %}

在 draw 方法里，我把三维的坐标转换成了屏幕坐标。并且，边长也根据缩放值重新计算了，远处的点，边长越小。代码最终运行的结果是我们可以看到远处的点，还是有 3D 的感觉的，不过不是很明显。我们改变生成点的逻辑，这一次，我们生成一个球面上的点。


#### 代码 2：
```javascript
let center = new Point(cvs.width/2, cvs.height/2, 0);
let points = [];
let circlePointCount = 30;
let angelStep = Math.PI * 2 / circlePointCount;
let radius = 10;
let step = 40;

for (let i = -radius; i <= radius; i++) {
    let y = i;

    for (let j = 0; j < circlePointCount; j++) {

        let xzRadius = Math.sqrt(radius * radius - y * y);
        let xzAngel = j * angelStep;
        let x = xzRadius * Math.cos(xzAngel);
        let z = xzRadius * Math.sin(xzAngel);

        // console.log(x,y,z);

        points.push(
            new Point(
                x * step + cvs.width/2, 
                y * step + cvs.height/2, 
                z * step - cvs.width/2
            )
        );
    }
}
draw();
```

#### 效果 2
{% asset_img daimaxiaoguo2.jpg %}

或者，再直接让它旋转起来。

#### 代码 3

```javascript
function update(angelOffset) {
    points = [];
    for (let i = -radius; i <= radius; i++) {
        let y = i;

        for (let j = 0; j < circlePointCount; j++) {

            let xzRadius = Math.sqrt(radius * radius - y * y);
            let xzAngel = j * angelStep + angelOffset;
            let x = xzRadius * Math.cos(xzAngel);
            let z = xzRadius * Math.sin(xzAngel);

            // console.log(x,y,z);
            points.push(
                new Point(
                    x * step + cvs.width/2, 
                    y * step + cvs.height/2, 
                    z * step - cvs.width/2
                )
            );
        }
    }
}

(function() {
    let angelOffset = 0;
    function tick() {
        update(angelOffset += 0.006);
        draw();
        window.requestAnimationFrame(tick);
    }
    tick();
})();
```

#### 效果 3
{% asset_img daimaxiaoguo3.gif %}


## F3.js

因为学过 three.js，three.js 有丰富的三维向量计算 api。我从源码里提取了这些计算向量的 api 再结合这篇文章里总结的转换方法计算二维的坐标写了一个专门在 canvas(2d) 上绘制三维场景的组件，因为是并非真的是调用3D api，所以我取名字叫 F3.js (fake3D) 

[https://github.com/gnauhca/f3.js](https://github.com/gnauhca/f3.js)

#### 使用 F3.js 制作的简单的 Demo：

{% asset_img daimaxiaoguo4.gif %}
