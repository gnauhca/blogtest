
function createMountain(height, radius, xRotate, zRotate, color) {
    var mountain = document.createElement('div'),
        darkMountain;
        darkColor = color.map(function(cnum) {
            return cnum + 15;
        });
    
    mountain.className = 'mountain';
    mountain.innerHTML = '<i></i>';
    darkMountain = mountain.getElementsByTagName('i')[0];

    mountain.style['transform'] = 'rotateX(' + xRotate + 'deg) ' +
                      'translateX(' + (zRotate / 20) * radius + 'px) translateY(' + -radius + 'px)' + 
                      'rotateZ(' + zRotate/2 + 'deg) ';
    
    mountain.style.borderLeft = height/2 + 'px solid transparent' ;
    mountain.style.borderRight = height/2 + 'px solid transparent' ;
    mountain.style.borderBottom = height + 'px solid rgb(' + color.join(',') + ')';

    darkMountain.style.borderTop = height + 'px solid transparent' ;
    if (zRotate > 0) {
        darkMountain.style.borderLeft = height/2 + 'px solid rgb(' + darkColor.join(',') + ')';
    } else {
        darkMountain.style.borderRight = height/2 + 'px solid rgb(' + darkColor.join(',') + ')';
        darkMountain.style.left = -height/2 + 'px';
    }
    
    return mountain;
}

function createStar(width, radius, xRotate, zRotate, color) {
    var star = document.createElement('div');

    star.className = 'star';
    star.style['transform'] = 'rotateX(' + xRotate + 'deg) ' +
                      'translateX(' + (zRotate / 20) * radius + 'px) translateY(' + -radius + 'px)' + 
                      'rotateZ(' + 45 + 'deg) ';

    star.style.width = star.style.height = width + 'px';
    star.style.background = 'rgb(' + color.join(',') + ')';
    star.style.animationDelay = parseInt(Math.random() * 6) + 's';
    return star;
}

function setup() {
    var view = document.querySelectorAll('.view')[0];
    var earth = document.querySelectorAll('.earth')[0];
    
    // mountain var
    var step = 360 / 40,
        zRandom = 10,
        xRandom = step / 5,
        radius = view.offsetHeight * 5.3,
        heightRandom = view.offsetHeight * 2.5,
        colors = [[31, 235, 213], [23, 239, 141]],
        colorRange,
        anglePass = 0,
        maxMountainForStep = 1,
        mountain,
        height,
        color;    

    while(anglePass < 360) {
        
        for (var i = 0; i < maxMountainForStep; i++) {

            colorRange = Math.random();
            color = colors[0].map(function(cnum, i) {
                return (cnum + (colors[1][i] - colors[0][i]) * Math.random()) | 0;
            });
            height = (heightRandom - heightRandom * Math.random() * 0.5)
            mountain = createMountain(
                        height |0,
                        (radius + height/4)|0,
                        (anglePass + xRandom * Math.random())|0,
                        (zRandom * Math.random() + 2) * (Math.random() > 0.5 ? 1 : -1)|0,
                        color
                    );
            earth.appendChild(mountain);
            mountain.style.marginLeft = -mountain.offsetWidth/2 + 'px';

            // star
        }
        anglePass += step;
    }  

    // star var
    var step = 360 / 50,
        zRandom = 10,
        xRandom = step / 5,
        radius = view.offsetHeight * 8,
        heightRandom = view.offsetHeight / 8,
        colors = [[222, 222, 222], [250, 250, 250]],
        colorRange;

    var anglePass = 0,
        maxStarForStep = 1,
        star,
        height,
        color; 

    while(anglePass < 360) {
        
        for (var i = 0; i < maxStarForStep; i++) {

            colorRange = Math.random();
            color = colors[0].map(function(cnum, i) {
                return (cnum + (colors[1][i] - colors[0][i]) * Math.random()) | 0;
            });
            height = (heightRandom - heightRandom * Math.random() * 0.5)
            star = createStar(
                        height | 0,
                        (radius)|0,
                        (anglePass + xRandom * Math.random())|0,
                        (zRandom * Math.random() + 2) * (Math.random() > 0.5 ? 1 : -1)|0,
                        color
                    );
            earth.appendChild(star);
            star.style.marginLeft = -star.offsetWidth/2 + 'px';

            // star
        }
        anglePass += step;
    }  
}

function init() {
    setup();
}

init();

