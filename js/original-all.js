/*
from: https://simply4all.net/test/halftone.php
file: https://simply4all.net/js/new/halftone.js
 */

//==========================
// HTML index.html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Remove halftone</title>
<style>
#buttons a{padding:0 6px;text-decoration:underline;color:blue;cursor:pointer}
#buttons a:hover{text-decoration:none}
</style>
</head>
<body>
<img id="dragcp" class="halftone" src="https://simply4all.net/test/sarah.jpg" data-src="sarah.jpg" />
<div id="buttons">
<a id="rgbc">RGB</a> <a id="red">Red</a> <a id="green">Green</a> <a id="blue">Blue</a> <a id="black">Black</a> <a id="removehalftone">Remove Halftone</a>
</div>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<script src="https://simply4all.net/js/new/halftone.js"></script>
<script>
jQuery(document).ready(function(){

function addHalftone(n){
	var img = document.querySelector('#dragcp');
	halftone = new BreathingHalftone(
	img,{
		dotSize:1/100,
		oscAmplitude:0,
		initVelocity:1,
		isAdditive:true,
		channels:[n]
		});
	}

function removeHalftone(){
	if($('#idh').length!==0){
	$('#idh').remove();halftone.destroy();delete halftone;
	}
};

$('#rgbc').click(function(){removeHalftone();var img = document.querySelector('#dragcp');halftone = new BreathingHalftone(img,{dotSize: 1/100,oscAmplitude:0,initVelocity:1,isAdditive:true,channels:['red','green','blue']});});
$('#red').click(function(){removeHalftone();addHalftone('red');});
$('#green').click(function(){removeHalftone();addHalftone('green');});
$('#blue').click(function(){removeHalftone();addHalftone('blue');});
$('#black').click(function(){removeHalftone();addHalftone('lum');});
$('#removehalftone').click(function(){removeHalftone();});

});
</script>
</body>
</html>

//===========================
// JS - https://simply4all.net/js/new/halftone.js
/*! Breathing Halftone * http://breathing-halftone.desandro.com */
(function(window){
'use strict';
var Halftone = window.BreathingHalftone = window.BreathingHalftone || {};
function Vector(x, y){this.set(x || 0, y || 0);}
Vector.prototype.set = function(x, y){this.x = x;this.y = y;};
Vector.prototype.add = function(v){this.x += v.x;this.y += v.y;};
Vector.prototype.subtract = function(v){this.x -= v.x;this.y -= v.y;};
Vector.prototype.scale = function(s){this.x *= s;this.y *= s;};
Vector.prototype.multiply = function(v){this.x *= v.x;this.y *= v.y;};
Object.defineProperty( Vector.prototype, 'magnitude', {get: function(){return Math.sqrt( this.x * this.x  + this.y * this.y );}});
Vector.subtract = function(a, b){return new Vector( a.x - b.x, a.y - b.y );};
Vector.add = function(a, b){return new Vector( a.x + b.x, a.y + b.y );};
Vector.copy = function(v){return new Vector( v.x, v.y );};
Halftone.Vector = Vector;
})(window);
(function(window){
'use strict';
var TAU = Math.PI * 2;
function getNow(){
return new Date();
}
var Halftone = window.BreathingHalftone || {};
var Vector = Halftone.Vector;
function Particle( properties ) {
this.channel = properties.channel;
this.origin = properties.origin;
this.parent = properties.parent;
this.friction = properties.friction;
this.position = Vector.copy( this.origin );
this.velocity = new Vector();
this.acceleration = new Vector();
this.naturalSize = properties.naturalSize;
this.size = 0;
this.sizeVelocity = 0;
this.oscSize = 0;
this.initSize = 0;
this.initSizeVelocity = ( Math.random() * 0.5 + 0.5 ) *
this.parent.options.initVelocity;
this.oscillationOffset = Math.random() * TAU;
this.oscillationMagnitude = Math.random();
this.isVisible = false;
}
Particle.prototype.applyForce = function(force){this.acceleration.add(force);};
Particle.prototype.update = function(){
if (!this.isVisible && Math.random() > 0.03){return;}
this.isVisible = true;
this.applyOriginAttraction();
this.velocity.add( this.acceleration );
this.velocity.scale( 1 - this.friction );
this.position.add( this.velocity );
this.acceleration.set( 0, 0 );
this.calculateSize();
};
Particle.prototype.render = function(ctx){
var size = this.size * this.oscSize;
var initSize = Math.cos(this.initSize * TAU / 2) * -0.5 + 0.5;
size *= initSize;
size = Math.max(0, size);
ctx.beginPath();
ctx.arc(this.position.x, this.position.y, size, 0, TAU);
ctx.fill();
ctx.closePath();
};
Particle.prototype.calculateSize = function(){
if (this.initSize !== 1) {
this.initSize += this.initSizeVelocity;
this.initSize = Math.min(1, this.initSize);
}
var targetSize = this.naturalSize * this.getChannelValue();
var sizeAcceleration = (targetSize - this.size) * 0.1;
this.sizeVelocity += sizeAcceleration;
this.sizeVelocity *= ( 1 - 0.3 );
this.size += this.sizeVelocity;
var now = getNow();
var opts = this.parent.options;
var oscSize = (now / (1000 * opts.oscPeriod)) * TAU;
oscSize = Math.cos( oscSize + this.oscillationOffset );
oscSize = oscSize * opts.oscAmplitude + 1;
this.oscSize = oscSize;
};
Particle.prototype.getChannelValue = function() {
var channelValue;
var position = this.parent.options.isChannelLens ? this.position : this.origin;
if ( this.parent.options.isChannelLens ) {
channelValue = this.parent.getPixelChannelValue(position.x, position.y, this.channel);
}else{
if (!this.originChannelValue){this.originChannelValue = this.parent.getPixelChannelValue(position.x, position.y, this.channel);}channelValue = this.originChannelValue;}
return channelValue;
};
Particle.prototype.applyOriginAttraction = function(){
var attraction = Vector.subtract(this.position, this.origin);
attraction.scale(-0.02);
this.applyForce(attraction);
};
Halftone.Particle = Particle;
})(window);
(function(window){
'use strict';
var TAU = Math.PI * 2;
var ROOT_2 = Math.sqrt(2);
var objToString = Object.prototype.toString;
var isArray = Array.isArray || function( obj ) {
return objToString.call(obj) === '[object Array]';
};
function extend(a, b, isDeep){
for ( var prop in b ){
var value = b[ prop ];
if (isDeep && typeof value === 'object' && !isArray(value)){
a[prop] = extend( a[ prop ] || {}, value, true );
}else{
a[prop] = value;
}}return a;}
function insertAfter( elem, afterElem ){
var parent = afterElem.parentNode;
var nextElem = afterElem.nextElementSibling;
if ( nextElem ) {
parent.insertBefore( elem, nextElem );
} else {
parent.appendChild( elem );
}}
var supports = {};
( function() {
var canvas = document.createElement('canvas');
var ctx = canvas.getContext && canvas.getContext('2d');
supports.canvas = !!ctx;
if ( !supports.canvas ) {
return;
}
canvas.width = 1;
canvas.height = 1;
ctx.globalCompositeOperation = 'darker';
ctx.fillStyle = '#F00';
ctx.fillRect( 0, 0, 1, 1 );
ctx.fillStyle = '#999';
ctx.fillRect( 0, 0, 1, 1 );
var imgData = ctx.getImageData( 0, 0, 1, 1 ).data;
supports.darker = imgData[0] === 153 && imgData[1] === 0;
})();
var lastTime = 0;
var prefixes = 'webkit moz ms o'.split(' ');
var requestAnimationFrame = window.requestAnimationFrame;
var cancelAnimationFrame = window.cancelAnimationFrame;
var prefix;
for( var i = 0; i < prefixes.length; i++ ) {
if ( requestAnimationFrame && cancelAnimationFrame ){
break;
}
prefix = prefixes[i];
requestAnimationFrame = requestAnimationFrame || window[ prefix + 'RequestAnimationFrame' ];
cancelAnimationFrame  = cancelAnimationFrame  || window[ prefix + 'CancelAnimationFrame' ] || window[ prefix + 'CancelRequestAnimationFrame' ];
}
if (!requestAnimationFrame || !cancelAnimationFrame){
requestAnimationFrame = function(callback){
var currTime = new Date().getTime();
var timeToCall = Math.max(0, 16 - (currTime - lastTime));
var id = setTimeout( function() {
callback( currTime + timeToCall );
}, timeToCall );
lastTime = currTime + timeToCall;
return id;
};
cancelAnimationFrame = function( id ){
clearTimeout( id );
};
}
var _Halftone = window.BreathingHalftone || {};
var Vector = _Halftone.Vector;
var Particle = _Halftone.Particle;
function Halftone(img, options){
this.options = extend({}, this.constructor.defaults, true);
extend(this.options, options, true);
this.img = img;
if (!supports.canvas){return;}
this.create();
}
Halftone.defaults = {
dotSize:1/40,
dotSizeThreshold:0.05,
initVelocity:0.02,
oscPeriod:3,
oscAmplitude:0.2,
isAdditive:false,
isRadial:false,
channels:[ 'red', 'green', 'blue' ],
isChannelLens:true,
friction:0.06,
hoverDiameter:0.3,
hoverForce:-0.02,
activeDiameter:0.6,
activeForce:0.01
};
function makeCanvasAndCtx(){
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
return{
canvas:canvas,
ctx:ctx
};
}
Halftone.prototype.create = function(){
this.isActive = true;
var canvasAndCtx = makeCanvasAndCtx();
this.canvas = canvasAndCtx.canvas;
this.ctx = canvasAndCtx.ctx;
this.canvas.className = this.img.className;
this.canvas.id = "idh";
insertAfter(this.canvas, this.img);
this.img.style.visibility = 'hidden';
this.channels = !this.options.isAdditive && !supports.darker ?
[ 'lum' ] : this.options.channels;
this.proxyCanvases = {};
for (var i=0, len = this.channels.length; i < len; i++) {
var channel = this.channels[i];
this.proxyCanvases[ channel ] = makeCanvasAndCtx();
}
this.loadImage();
this.canvasPosition = new Vector();
this.getCanvasPosition();
this.cursors = {};
};
Halftone.prototype.getCanvasPosition = function(){
var rect = this.canvas.getBoundingClientRect();
var x = rect.left + window.pageXOffset;
var y = rect.top + window.pageYOffset;
this.canvasPosition.set( x, y );
this.canvasScale = this.width ? this.width / this.canvas.offsetWidth  : 1;
};
Halftone.prototype.loadImage = function(){
var src = this.img.getAttribute('data-src') || this.img.src;
var loadingImg = new Image();
loadingImg.onload = function() {
this.onImgLoad();
}.bind( this );
loadingImg.src = src;
if ( this.img.src !== src ){
this.img.src = src;
}};
Halftone.prototype.onImgLoad = function(){
this.getImgData();
this.resizeCanvas();
this.getCanvasPosition();
this.img.style.display = 'none';
this.getCanvasPosition();
this.initParticles();
this.animate();
};
Halftone.prototype.getImgData = function(){
var canvasAndCtx = makeCanvasAndCtx();
var imgCanvas = canvasAndCtx.canvas;
var ctx = canvasAndCtx.ctx;
this.imgWidth = imgCanvas.width = this.img.naturalWidth;
this.imgHeight = imgCanvas.height = this.img.naturalHeight;
ctx.drawImage( this.img, 0, 0 );
this.imgData = ctx.getImageData( 0, 0, this.imgWidth, this.imgHeight ).data;
};
Halftone.prototype.resizeCanvas = function(){
var w = this.width = this.img.offsetWidth;
var h = this.height = this.img.offsetHeight;
this.diagonal = Math.sqrt( w*w + h*h );
this.imgScale = this.width / this.imgWidth;
this.gridSize = this.options.dotSize * this.diagonal;
for ( var prop in this.proxyCanvases ) {
var proxy = this.proxyCanvases[ prop ];
proxy.canvas.width = w;
proxy.canvas.height = h;
}
this.canvas.width = w;
this.canvas.height = h;
};
Halftone.prototype.initParticles = function(){
var getParticlesMethod = this.options.isRadial ?
'getRadialGridParticles' : 'getCartesianGridParticles';
this.particles = [];
this.channelParticles = {};
var angles = { red: 1, green: 2.5, blue: 5, lum: 4 };
for (var i=0, len = this.channels.length; i < len; i++) {
var channel = this.channels[i];
var angle = angles[ channel ];
var particles = this[ getParticlesMethod ]( channel, angle );
this.channelParticles[ channel ] = particles;
this.particles = this.particles.concat( particles );
}};
Halftone.prototype.animate = function(){
if (!this.isActive){return;}
this.update();
this.render();
requestAnimationFrame(this.animate.bind( this));
};
Halftone.prototype.update = function() {
for (var i=0, len = this.particles.length; i < len; i++){
var particle = this.particles[i];
particle.update();
}};
Halftone.prototype.render = function(){
this.ctx.globalCompositeOperation = 'source-over';
this.ctx.fillStyle = this.options.isAdditive ? 'black' : 'white';
this.ctx.fillRect( 0, 0, this.width, this.height );
this.ctx.globalCompositeOperation = this.options.isAdditive ? 'lighter' : 'darker';
for ( var i=0, len = this.channels.length; i < len; i++ ){
var channel = this.channels[i];
this.renderGrid( channel );
}};
var channelFillStyles = {
additive:{
red:'#FF0000',
green:'#00FF00',
blue:'#0000FF',
lum:'#FFF'
},
subtractive: {
red:'#00FFFF',
green:'#FF00FF',
blue:'#FFFF00',
lum:'#000'
}};
Halftone.prototype.renderGrid = function( channel ){
var proxy = this.proxyCanvases[ channel ];
proxy.ctx.fillStyle = this.options.isAdditive ? 'black' : 'white';
proxy.ctx.fillRect( 0, 0, this.width, this.height );
var blend = this.options.isAdditive ? 'additive' : 'subtractive';
proxy.ctx.fillStyle = channelFillStyles[ blend ][ channel ];
var particles = this.channelParticles[ channel ];
for ( var i=0, len = particles.length; i < len; i++ ) {
var particle = particles[i];
particle.render(proxy.ctx);
}
this.ctx.drawImage(proxy.canvas, 0, 0);
};

Halftone.prototype.getCartesianGridParticles = function(channel, angle){
var particles = [];
var w = this.width;
var h = this.height;
var diag = Math.max( w, h ) * ROOT_2;
var gridSize = this.gridSize;
var cols = Math.ceil( diag / gridSize );
var rows = Math.ceil( diag / gridSize );
for ( var row = 0; row < rows; row++ ) {
for ( var col = 0; col < cols; col++ ) {
var x1 = ( col + 0.5 ) * gridSize;
var y1 = ( row + 0.5 ) * gridSize;
x1 -= ( diag - w ) / 2;
y1 -= ( diag - h ) / 2;
x1 -= w / 2;
y1 -= h / 2;
var x2 = x1 * Math.cos(angle) - y1 * Math.sin(angle);
var y2 = x1 * Math.sin(angle) + y1 * Math.cos(angle);
x2 += w / 2;
y2 += h / 2;
var particle = this.initParticle(channel, x2, y2);
if ( particle ) {
particles.push(particle);
}}}
return particles;
};
Halftone.prototype.getRadialGridParticles = function(channel, angle) {
var particles = [];
var w = this.width;
var h = this.height;
var diag = Math.max( w, h ) * ROOT_2;
var gridSize = this.gridSize;
var halfW = w / 2;
var halfH = h / 2;
var offset = gridSize;
var centerX = halfW + Math.cos( angle ) * offset;
var centerY = halfH + Math.sin( angle ) * offset;
var maxLevel = Math.ceil( ( diag + offset ) / gridSize );
for ( var level=0; level < maxLevel; level++ ) {
var max = level * 6 || 1;
for ( var j=0; j < max; j++ ) {
var theta = TAU * j / max + angle;
var x = centerX + Math.cos( theta ) * level * gridSize;
var y = centerY + Math.sin( theta ) * level * gridSize;
var particle = this.initParticle( channel, x, y );
if (particle){
particles.push( particle );
}}}
return particles;
};

Halftone.prototype.initParticle = function(channel, x, y){
var pixelChannelValue = this.getPixelChannelValue(x, y, channel);
if ( pixelChannelValue < this.options.dotSizeThreshold ){
return;
}
return new Particle({
channel: channel,
parent: this,
origin: new Vector( x, y ),
naturalSize: this.gridSize * ROOT_2 / 2,
friction: this.options.friction
});
};
var channelOffset ={red:0, green:1, blue:2};
Halftone.prototype.getPixelChannelValue = function(x, y, channel){
x = Math.round(x / this.imgScale);
y = Math.round(y / this.imgScale);
var w = this.imgWidth;
var h = this.imgHeight;
if (x < 0 || x > w || y < 0 || y > h){
return 0;
}
var pixelIndex = (x + y * w) * 4;
var value;
if (channel === 'lum'){value = this.getPixelLum( pixelIndex );}else{
var index = pixelIndex + channelOffset[channel];
value = this.imgData[ index ] / 255;
}
value = value || 0;
if (!this.options.isAdditiv ){
value = 1 - value;}
return value;
};
Halftone.prototype.getPixelLum = function(pixelIndex){
var r = this.imgData[ pixelIndex + 0 ] / 255;
var g = this.imgData[ pixelIndex + 1 ] / 255;
var b = this.imgData[ pixelIndex + 2 ] / 255;
var max = Math.max( r, g, b );
var min = Math.min( r, g, b );
return ( max + min ) / 2;
};
/*Halftone.prototype.bindEvents = function(){};
Halftone.prototype.unbindEvents = function(){};*/
Halftone.prototype.destroy = function(){
this.isActive = false;
/*this.unbindEvents();*/
this.img.style.visibility = '';
this.img.style.display = '';
/*this.canvas.parentNode.removeChild( this.canvas );*/
};
Halftone.Vector = Vector;
Halftone.Particle = Particle;
window.BreathingHalftone = Halftone;
})(window);
