---
title: 简单一招搞定 three.js 屏幕适配
date: 2016-11-24 14:27:07
tags: three.js
category: three.js
---
这篇文章只讨论 <span style="color: red">PerspectiveCamera</span> 的适配方法

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


这些参数设置好之后，成像就相应确定了。最后 three.js 把相机拍摄到的矩形区域对应好四个顶点渲染到屏幕上。<span style="color: red">同样比例的屏幕看到的图像是一致的，与屏幕大小无关</span>。

{% asset_img photo.jpg %}

下面我用一个简单的场景来看一下这些参数对成像的影响。

## 场景元素

* 相机 （PerspectiveCamera）
* 一个边长为 100 的平面（主体内容范围），放在世界坐标中心。

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

## 设置 fov 参数
可以直接想到的一种适配方法是——改变 camera 到目标物体的距离以控制成像的内容，但是这样做计算成本比较高，而且还有可能影响其他一些数值，然后需要相应一起计算修改。
我想到改变视角也可以达到控制成像内容多少的目的，于是我想可不可以只通过改变 fov 一个数值，达到我要的效果。

fov 官网的定义翻译过来是垂直方向的视角大小。我们先规定好相机到平面的距离为 100，然后试试看能不能通过计算设置 fov 值，刚好让平面填满一个宽高比为 1:1 的屏幕。

```javascript
plane.position.set(0,0,0);
camera.position.set(0,0,100);
camera.lookAt(new THREE.Vector3);
```

{% asset_img fov.jpg %}

观察上面的图，可以很容易求出 fov 的值， fov = arctan((100/2)/100) * 2; fov 为 0.9272952180016122，约等于 53 度。

```javascript
camera.fov = Math.atan((100/2)/100) * 2 * (180 / Math.PI);
camera.updateProjectionMatrix();
```

设置完刚刚求出的 fov 值，将场景渲染到 宽高比为 1:1 的画布上。


<img src="{% asset_path fovinit.png %}" width=200 height=200>

渲染结果和预想的一样，平面刚好填满了 1:1 的画布。

## fov 和宽高比例的关系
下面在固定的 fov 下，使用 dat.gui 工具调整宽高比，观察渲染区域的变化。

{% asset_img fov-to-height.jpg %}


因为fov设置的是垂直方向的视角范围，可以看到无论我们怎么改变宽高比例，垂直方向的渲染范围，都是一致的。水平方向则是以裁剪的方式显示。也就是说当我们设置好视角让垂直方向范围刚好等于主体内容的范围，只要宽高比大于1，我们得到的渲染结果，已经是最佳的了。问题就只剩下当宽高比小于1的情况了。

宽高比小于1的时候，垂直方向显示的高度刚好是等于主体内容的高度。为了能让水平方向完整显示主体内容，我们只有将垂直方向范围增大，也就是将 fov 设置一个更大的值，此时水平方向的范围也会随之增大。当将 fov调整到 水平方向刚好能显示主体内容时，垂直方向此时显示的范围是超过主体内容垂直方向的范围的。其中的关系，其实可以用很简单的函数求出来。

已知 照相机到主题内容的距离为 d
正方形主体内容的边长为 w

设宽高比为 r，求照相机垂直方向的视角 f

当 r >= 1 时，照相机拍摄到的垂直方向范围等于 w

当 r > 1
`d * tan(f/2) * 2 = w`

当 r < 1 时，照相机拍摄到的水平方向范围等于 w，垂直方向范围应该是 w/r
`d * tan(f/2) * 2 = w/r`

这样，任意宽高比例的屏幕应该对应多大的垂直视角就确定了。

## 最终代码与效果

```javascript
var controls = new function () {

    camera.position.z = CAMERA_TO_MAIN_DIS;

    this.width = 500;
    this.height = 500;
    this.planeRY = 0;

    function calcFov(d, w, r) {
        var f;
        var vertical = w;
        if (r < 1) {
            vertical = vertical/r;
        }
        f = Math.atan(vertical/d/2)*2 * (180 / Math.PI);
        return f;
    }

    this.redraw = ()=>{
        webGLRenderer.setSize(this.width, this.height);
        plane.rotation.y = this.planeRY;
        camera.fov = calcFov(CAMERA_TO_MAIN_DIS, MAIN_CONTENT_WIDTH, this.width / this.height);
        camera.aspect = this.width / this.height;
        camera.updateProjectionMatrix();
    }
}
```

效果：
{% asset_img fov-to-height-final.jpg %}

demo 的完整代码：[http://codepen.io/JasonTurbo/pen/ZLwJMo](http://codepen.io/JasonTurbo/pen/ZLwJMo)