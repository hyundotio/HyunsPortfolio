// Minified: only 160 bytes!
function debounce(a,b,c){var d;return function(){var e=this,f=arguments;clearTimeout(d),d=setTimeout(function(){d=null,c||a.apply(e,f)},b),c&&!d&&a.apply(e,f)}}

const TiltAnimation = function() {

  let
    hero,
    mouseX,
    mouseY,
    textX,
    textY;

  const _init = function() {
    mouseX    = 0;
    mouseY    = 0;
    slider    = document.getElementsByClassName('about-portrait')[0];
    _addEventHandlers();
  }

  const _addEventHandlers = function() {
    window.addEventListener('mousemove', _getMousePos, false);
    if (window.DeviceMotionEvent != undefined) {
      window.addEventListener('devicemotion', _accelerometerUpdate, false);
    }
  }

  const _kill = function() {
    window.removeEventListener('mousemove', _getMousePos, false);
    if (window.DeviceMotionEvent != undefined) {
      window.removeEventListener('devicemotion', _accelerometerUpdate, false);
    }
    TweenLite.to(slider, 0.5, { rotationY:0, rotationX:0, ease:Power1.easeOut, transformPerspective:900, transformOrigin:"center" });
  }

  const _accelerometerUpdate = function(e) {
    const aX = event.accelerationIncludingGravity.x*1;
    const aY = event.accelerationIncludingGravity.y*1;
    const aZ = event.accelerationIncludingGravity.z*1;

    let xPosition = Math.atan2(aY, aZ) * 4;
    let yPosition = Math.atan2(aX, aZ) * 4;

    xPosition = Math.round(xPosition * 1000) / 1000;
    yPosition = Math.round(yPosition * 1000) / 1000;

    _animate(yPosition, xPosition);
  }

  const _getMousePos = function(e) {
    e = e || window.event;

    mouseX = e.clientX;
    mouseY = e.clientY;

    const xPos = (mouseX / window.innerWidth) - 0.5;
    const yPos = (mouseY / window.innerHeight) - 0.5;
    const rotationYValue = 40 * xPos;
    const rotationXValue = 40 * yPos;

    _animate(rotationYValue,rotationXValue);
  }

  const _animate = function(rotationYValue, rotationXValue) {
    TweenLite.to(slider, 0.5, { rotationY:rotationYValue, rotationX:rotationXValue, ease:Power1.easeOut, transformPerspective:900, transformOrigin:"center" });
  }

  return {
    init: _init,
    kill: _kill
  }
}();
