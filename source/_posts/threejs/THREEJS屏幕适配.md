---
title: 简单一招搞定 three.js 屏幕适配
date: 2016-11-24 14:27:07
tags: three.js
category: three.js
---
这篇文章只讨论 PerspectiveCamera 的适配方法

做过手机 H5 的同学可能会觉得屏幕适配挺麻烦。原因是设计师提供的设计稿尺寸比固定，但是前端开发者却要适配不同大小、长宽比的目标设备。适配的终极目标无非是最大程度把主体内容优雅地呈现给用户。开发和设计如果没有协调好的话可能会妥协比较丑陋的方案，例如由于设计比例问题，为了照顾主体内容不被裁剪，只好设备两边，或者上下留黑边这种。

不过在 3D 的世界里，我们不用担心会有黑边的问题，因为 3D 场景是无限延伸的，总能填满任何比例的屏幕。


先看看 PerspectiveCamera 官方 API 说明如下：

```
PerspectiveCamera( fov, aspect, near, far )

fov — Camera frustum vertical field of view.
aspect — Camera frustum aspect ratio.
near — Camera frustum near plane.
far — Camera frustum far plane.
```

上面四个参数都会影响成像结果，`fov` 和 `aspect` 设置 XY 平面的范围，也就是广度。 `near` 和 `far` 影响的是纵深 Z 轴的范围，也就是深度。纵深只要保证物体离相机距离在这个范围就可以了，这是为了性能而设置的参数，由用户设置，只渲染必要的东西。实际上真实的相机这两个值对应的是 0 到 无限远。


这些参数设置好之后，成像就相应确定了。最后 three.js 把相机拍摄到的矩形区域对应好四个顶点渲染到屏幕上。同样比例的屏幕看到的图像是一致的，与屏幕大小无关。

{% asset_img photo.jpg %}

下面我用一个简单的场景来看一下这些参数对成像的影响。

## 场景元素

* 相机 （PerspectiveCamera）
* 一个边长为 100 的平面，放在世界坐标中心。

```javascript
var camera = new THREE.PerspectiveCamera(53, 500 / 500, 0.1, 1000);

var planeGemo = new THREE.PlaneGeometry( 100, 100, 10, 10 )
var meshMaterial = new THREE.MeshLambertMaterial();
meshMaterial.color = new THREE.Color(0x2dcaf1);
meshMaterial.side = THREE.DoubleSide;

var wireFrameMat = new THREE.MeshBasicMaterial();
wireFrameMat.color = new THREE.Color(0xdddddd);
wireFrameMat.wireframe = true;

var plane = THREE.SceneUtils.createMultiMaterialObject(planeGemo, [meshMaterial, wireFrameMat]);

scene.add(plane);
```

## 目标
在任何屏幕下，都能最大程度地显示完整的立方体。最大程度，就是最少多余空间的意思。下面是要达到效果

{% asset_img plane.jpg %}

## 只改变 fov 参数
可以直接想到的一种适配方法是——改变 camera 到目标物体的距离以控制成像的内容，但是这样做计算成本比较高，而且还有可能影响其他一些数值，然后需要相应一起计算修改。
我想到改变视角也可以达到控制成像内容多少的目的，于是我想可不可以只通过改变 fov 一个数值，达到我要的效果。

fov 官网的定义翻译过来是垂直方向的视角大小。我们先规定好相机到平面的距离为 100，然后试试看能不能通过计算设置 fov 值，刚好让平面填满一个宽高比为 1:1 的屏幕。

```javascript
plane.position.set(0,0,0);
camera.position.set(0,0,100);
camera.lookAt(new THREE.Vector3);
```

{% asset_img fov.jpg %}

## 设置相机
先在理想长宽比例 1 : 1 的尺寸下渲染出整个正方体。这应该挺简单，我们拍照都知道，要想相机拍到更多或者更少的东西，可以调整相机和物体的距离，或者调整光圈大小。想象一下你拥有这样一部可以调节光圈的相机，你会怎么做，抱着个相机到处跑，还是按一按相机的调整按钮？答案很明显了，对应到 three.js 也能很清楚。

position: 根据不同屏幕调整相机到目标物体的距离。
fov: 根据不同屏幕调整相机视角宽度。

three.js 对应这两个概念的属性分别是 position 和 fov。
改变 fov 不需要考虑目标物体，只需考虑相机本身。

