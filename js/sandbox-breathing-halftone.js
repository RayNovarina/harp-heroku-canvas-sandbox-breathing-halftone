/*===========================
  JS - https://simply4all.net/js/new/halftone.js
*/
/*! Breathing Halftone * http://breathing-halftone.desandro.com */

//----------------------------------------------------------
// anonymous function1()
(function(window) {
	'use strict';
	trr_log( { msg: " ..*1: anonFunc1()" } );
	var Halftone = window.BreathingHalftone = window.BreathingHalftone || {};

	function Vector( x, y ) {
		this.set(x || 0, y || 0);
	}

	Vector.prototype.set = function( x, y ) {
		this.x = x;
		this.y = y;
	};
	Vector.prototype.add = function( v ) {
		this.x += v.x;
		this.y += v.y;
	};
	Vector.prototype.subtract = function( v ){
		this.x -= v.x;
		this.y -= v.y;
	};
	Vector.prototype.scale = function( s ){
		this.x *= s;
		this.y *= s;
	};
	Vector.prototype.multiply = function( v ){
		this.x *= v.x;
		this.y *= v.y;
	};

	Object.defineProperty( Vector.prototype, 'magnitude',
												{ get: function() {
						 										 return Math.sqrt( this.x * this.x  + this.y * this.y );
															 }
												}
	);

	Vector.subtract = function( a, b ) {
		return new Vector( a.x - b.x, a.y - b.y ); // instance of " ..*1a: anonFunc1().Vector"
	};

	Vector.add = function( a, b ) {
		return new Vector( a.x + b.x, a.y + b.y ); // instance of " ..*1a: anonFunc1().Vector"
	};

	Vector.copy = function( v ) {
		return new Vector( v.x, v.y ); // instance of " ..*1a: anonFunc1().Vector"
	};

	Halftone.Vector = Vector;
})(window); // end anonymous function1()

//----------------------------------------------------------
// anonymous function2()
(function(window) {
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
		this.velocity = new Vector(); // instance of " ..*1a: anonFunc1().Vector"
		this.acceleration = new Vector();  // instance of " ..*1a: anonFunc1().Vector"
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
		//trr_log( { msg: " ..*2a: create Particle() for origin.x '" + properties.origin.x +
		//								"'. origin.y '" + properties.origin.y + "'",
		//					 this: this, onlyIf: { particleInitTrace: true } } );
	} // end: function Particle()

	Particle.prototype.applyForce = function( force ) {
		//trr_log( { msg: " ..*2b: Particle.applyForce()", this: this, onlyIf: { animationTrace: true } } );
		this.acceleration.add(force);
	};

	Particle.prototype.update = function() {
		if ( !this.isVisible && Math.random() > 0.03) {
			trr_log( { msg: " ..*2c: Particle.update() REJECTED", this: this, onlyIf: { animationTrace: true } } );
			return;
		}
		//trr_log( { msg: " ..*2c.1: Particle.update()", this: this, onlyIf: { animationTrace: true } } );
		this.isVisible = true;
		this.applyOriginAttraction();
		this.velocity.add( this.acceleration );
		this.velocity.scale( 1 - this.friction );
		this.position.add( this.velocity );
		this.acceleration.set( 0, 0 );
		this.calculateSize();
	};

	Particle.prototype.render = function( ctx, channelIndex, particleIndex ) {
		trr_log( { msg: " ..*2d: Particle.render() position.x = " + this.position.x +
									  ". position.y = " + this.position.y + ". channelIndex = " +
										channelIndex + ". particleIndex = " + particleIndex,
										this: this, outerIndex: channelIndex, innerIndex: particleIndex,
										onlyIf: { animationTrace: true } } );
		var size = this.size * this.oscSize;
		var initSize = Math.cos(this.initSize * TAU / 2) * -0.5 + 0.5;
		size *= initSize;
		size = Math.max(0, size);
		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, size, 0, TAU);
		ctx.fill();
		ctx.closePath();
	};

	Particle.prototype.calculateSize = function() {
		//trr_log( { msg: " ..*2e: Particle.calculateSize()", this: this, onlyIf: { animationTrace: true } } );
		if (this.initSize !== 1) {
			this.initSize += this.initSizeVelocity;
			this.initSize = Math.min(1, this.initSize);
		}
		var targetSize = this.naturalSize * this.getR_or_g_or_bValue();
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

	Particle.prototype.getR_or_g_or_bValue = function() {
		//trr_log( { msg: " ..*2f: Particle.getR_or_g_or_bValue()", this: this, onlyIf: { animationTrace: true } } );
		var r_or_g_or_bValue;
		var position = this.parent.options.isChannelLens ? this.position : this.origin;
		if ( this.parent.options.isChannelLens ) {
			r_or_g_or_bValue = this.parent.getPixelR_or_g_or_bValue(position.x, position.y, this.channel);
		} else {
			if ( !this.originR_or_g_or_bValue ) {
				this.originR_or_g_or_bValue = this.parent.getPixelR_or_g_or_bValue(position.x, position.y, this.channel);
			}
			r_or_g_or_bValue = this.originR_or_g_or_bValue;
		}
		return r_or_g_or_bValue;
	};

	Particle.prototype.applyOriginAttraction = function() {
		//trr_log( { msg: " ..*2g: Particle.applyOriginAttraction()", this: this, onlyIf: { animationTrace: true } } );
		var attraction = Vector.subtract(this.position, this.origin);
		attraction.scale(-0.02);
		this.applyForce(attraction);
	};

	Halftone.Particle = Particle;
})(window); // end anonymous function2()

//---------------------------------------------------
// anonymous function3()
(function(window) {
	'use strict';
	trr_log( { msg: " ..*3: anonFunc3()" } );
	trr_log( { msg: " ..*3.1: ===== WHERE LIFE BEGINS =======" } );
	var TAU = Math.PI * 2;
	var ROOT_2 = Math.sqrt(2);
	var objToString = Object.prototype.toString;
	var isArray = Array.isArray || function( obj ) {
		return objToString.call(obj) === '[object Array]';
	};

	function extend(a, b, isDeep) {
		for ( var prop in b ) {
			var value = b[ prop ];
			if (isDeep && typeof value === 'object' && !isArray(value)) {
				a[prop] = extend( a[ prop ] || {}, value, true );
			} else {
				a[prop] = value;
			}
		}
		return a;
	}

	function insertAfter( elem, afterElem ) {
		var parent = afterElem.parentNode;
		var nextElem = afterElem.nextElementSibling;
		if ( nextElem ) {
			parent.insertBefore( elem, nextElem );
		} else {
			parent.appendChild( elem );
		}
	}

	var supports = {};

	// anonymous function3a()
	(function() {
		trr_log( { msg: " ..*3a: anonFunc3a()" } );
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext && canvas.getContext('2d');
		// NOTE: supports.canvas: just check if DOM supports canvas.getContext() method.
		supports.canvas = !!ctx;
		if ( !supports.canvas ) {
			return;
		}
		// NOTE: supports.darker: check if first pixell of canvas is changed to darker value?
		canvas.width = 1;
		canvas.height = 1;
		ctx.globalCompositeOperation = 'darker';
		ctx.fillStyle = '#F00';
		ctx.fillRect( 0, 0, 1, 1 );
		ctx.fillStyle = '#999';
		ctx.fillRect( 0, 0, 1, 1 );
		var imgData = ctx.getImageData( 0, 0, 1, 1 ).data;
		supports.darker = imgData[0] === 153 && imgData[1] === 0;
	})(); // end anonymous function3a()

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
	if (!requestAnimationFrame || !cancelAnimationFrame) {
		requestAnimationFrame = function(callback) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = setTimeout( function() {
				callback( currTime + timeToCall );
			}, timeToCall );
			lastTime = currTime + timeToCall;
			return id;
		};
		cancelAnimationFrame = function( id ) {
			clearTimeout( id );
		};
	} else {
		//trr_log( { msg: " ..*3b: anonFunc3(): have request or cancelAnimationFrame()." } );
		trr_log( { msg: " ..*3b.1 ======= LOADED AND WAITING for button to be clicked =====" } );
	}

	var _Halftone = window.BreathingHalftone || {};
	var Vector = _Halftone.Vector;
	var Particle = _Halftone.Particle;

	// 1) Get here via 'new BreathingHalftone( el_img, {options} )'
	function Halftone(img, options){
		trr_log( { msg: " ..*3.1: creating Halftone() *" } );
		this.options = extend({}, this.constructor.defaults, true);
		extend(this.options, options, true);
		this.img = img;
		if (!supports.canvas){
			return;
		}
		this.create(); // " ..*3.3: Halftone.create() *"
	}

	Halftone.defaults = {
		logLevel: 'none',
		dotsColor: 'calculated',
		dotSize: 1/40,
		dotSizeThreshold: 0.05,
		initVelocity: 0.02,
		oscPeriod: 3,
		oscAmplitude: 0.2,
		isAdditive: false,
		globalCompositeOperation: 'darker',
		isRadial: false,
		channels: [ 'red', 'green', 'blue' ],
		isChannelLens: true,
		friction: 0.06,
		hoverDiameter: 0.3,
		hoverForce: -0.02,
		activeDiameter: 0.6,
		activeForce: 0.01,
		photoType: 'color',
		photoTag: 'none',
		effectType: 'halftone',
		canvasBackgroundColor: 'black',
		isJustOne: false,
		isJustCopy: false,
	};

	function makeCanvasAndCtx() {
		trr_log( { msg: " ..*3.2: makeCanvasAndCtx() *" } );
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		return { canvas:canvas,
						 ctx:ctx
		};
	}

	// 2) Get here via 'this.create()'
	// Inputs:
	//   this.options = {}
	//   this.img = <img src=xxx>
	Halftone.prototype.create = function() {
		this.isActive = true;
		this.tracingParticleInitialization = false;
		this.tracingAnimation = false;
		this.particleInitLogLines = 0;
		this.animationLogLines = 0;
		this.maxAnimationLogLines = 2000;
		this.animateCycles = 0;
		this.maxAnimateCycles = ( this.options.maxAnimationCycles == 'calculated' )
				? 400 : this.options.maxAnimationCycles;
		trr_log( { msg: " ..*3.3: Halftone.create() isJustCopy:" + this.options.isJustCopy +
								". isJustOne:" + this.options.isJustOne +
								". From " + this.options.photoType +
								" Photo to " + (this.options.channels[0] == 'lum'
										? 'white'
										: this.options.effectType == 'halftone_copy'
												? 'copied'
												: this.options.channels[0]) +
								" Halftone particles on a " + this.options.canvasBackgroundColor + " Background. *", this: this } );
		var canvasAndCtx = makeCanvasAndCtx(); // " ..*3.2: makeCanvasAndCtx() *"
		this.canvas = canvasAndCtx.canvas;
		this.ctx = canvasAndCtx.ctx;
		this.canvas.className = this.img.className;
		this.canvas.id = "idh";
		// <canvas> is inserted after <img> and image is hidden so we can show
		// what we draw on the canvas.
		insertAfter(this.canvas, this.img);
		this.img.style.visibility = 'hidden';
		this.channels = !this.options.isAdditive && !supports.darker ?
			[ 'lum' ] : this.options.channels;
		this.proxyCanvases = {};
		for (var i=0, len = this.channels.length; i < len; i++) {
			var channel = this.channels[i];
			this.proxyCanvases[ channel ] = makeCanvasAndCtx();
		}

		trr_log( { msg: " ..*3.3a: Halftone.create() " +
								"  isAdditive: " + this.options.isAdditive + ". supports.darker: " + supports.darker +
								". dotSize: " + this.options.dotSize + ". dotSizeThreshold = " + this.options.dotSizeThreshold +
								" *", this: this } );

		// NOTE: after loadImage() loads the image file, it continues on
		// and does a .initParticles() and .animate().
		this.loadImage(); // " ..*3.6: Halftone.loadImage() "
		this.canvasPosition = new Vector(); // instance of " ..*1a: anonFunc1().Vector"
		this.getCanvasPosition(); // " ..*3.4: Halftone.getCanvasPosition() *"
		this.cursors = {};
	};

	Halftone.prototype.getCanvasPosition = function() {
		var rect = this.canvas.getBoundingClientRect();
		var x = rect.left + window.pageXOffset;
		var y = rect.top + window.pageYOffset;
		trr_log( { msg: " ..*3.4: Halftone.getCanvasPosition(): BoundingClientRect x: " + x + " y: " + y + " *", this: this } );
		this.canvasPosition.set( x, y );
		this.canvasScale = this.width ? this.width / this.canvas.offsetWidth  : 1;
	};

	// 3) Get here via 'this.loadImage'
	Halftone.prototype.loadImage = function() {
		var src = this.img.getAttribute('data-src');
		trr_log( { msg: " ..*3.6: Halftone.loadImage(): src = '" + src + "' *", this: this } );
		var loadingImg = new Image();
		loadingImg.onload = function() {
			this.onImgLoad();
		}.bind( this );
		loadingImg.src = src;
		if ( this.img.src !== src ) {
			this.img.src = src;
		}
	};

	// 4) Get here via 'this.onImgLoad'
	Halftone.prototype.onImgLoad = function() {
		trr_log( { msg: " ..*3.7: Halftone.onImgLoad() calls getImgData thru animate() *", this: this } );
		this.getImgData(); " ..*3.8: Halftone.getImgData() *"
		this.resizeCanvas(); " ..*3.9: Halftone.resizeCanvas() *"
		this.getCanvasPosition(); // " ..*3.4: Halftone.getCanvasPosition() *"
		this.img.style.display = 'none';
		this.getCanvasPosition(); // " ..*3.4: Halftone.getCanvasPosition() *"
		this.initParticles(); // " ..*3.10: Halftone.initParticles() ""
		this.animate(); // " ..*3.11: Halftone.animate() *"
	};

	Halftone.prototype.getImgData = function() {
		trr_log( { msg: " ..*3.8: Halftone.getImgData() *", this: this } );
		var canvasAndCtx = makeCanvasAndCtx();
		var imgCanvas = canvasAndCtx.canvas;
		var ctx = canvasAndCtx.ctx;
		this.imgWidth = imgCanvas.width = this.img.naturalWidth;
		this.imgHeight = imgCanvas.height = this.img.naturalHeight;
		ctx.drawImage( this.img, 0, 0 );
		// ImageData.data Is a Uint8ClampedArray representing a one-dimensional
		// array containing the data in the RGBA order, with integer values between
		// 0 and 255 (included). sarah.jpg imgData.len = '582400'
		this.imgData = ctx.getImageData( 0, 0, this.imgWidth, this.imgHeight ).data;
		this.imgDataBackgroundRGBA = "rgba( "    + this.imgData[0] + ", " + this.imgData[1] +
																 ", " + this.imgData[2] + ", " + this.imgData[3] +
																 " )";
		trr_log( { msg: " ..*3.8a: Halftone.getImgData(): imgData.character.len = '" + this.imgData.length +
								"'. imgData.RGBA_arrayCells = '" + this.imgData.length / 4 +
								"'. imgWidth = '" + this.imgWidth + "'. imgHeight = '" + this.imgHeight +
								"'. Background RGBA() = '" + this.imgDataBackgroundRGBA + "' *", this: this } );
	};

	Halftone.prototype.resizeCanvas = function() {
		var w = this.width = this.img.offsetWidth;
		var h = this.height = this.img.offsetHeight;
		this.diagonal = Math.sqrt( w*w + h*h );
		this.imgScale = this.width / this.imgWidth;
		this.gridSize = this.options.dotSize * this.diagonal;
		trr_log( { msg: " ..*3.9: Halftone.resizeCanvas(): Begin canvas.width = " + this.canvas.width +
		           "px. canvas.height = " + this.canvas.height +
							 "px. img.offsetWidth = " + this.img.offsetWidth + "px. img.offsetHeight = " + this.img.offsetHeight +
							 "px. diagonal = " + this.diagonal + "px. scale = " + this.imgScale * 100 +
							 "%. dotSize = " + this.options.dotSize +
							 ". gridSize = " + this.gridSize + "px per perCent? " +
							 " *", this: this } );
		for ( var prop in this.proxyCanvases ) {
			var proxy = this.proxyCanvases[ prop ];
			proxy.canvas.width = w;
			proxy.canvas.height = h;
		}
		this.canvas.width = w;
		this.canvas.height = h;
		trr_log( { msg: " ..*3.9a: Halftone.resizeCanvas(): End canvas.width = " + this.canvas.width +
		            ". canvas.height = " + this.canvas.height + ". *", this: this } );
	};

	// 5) Get here via 'this.initParticles'
	Halftone.prototype.initParticles = function() {
		trr_log( { msg: " ..*3.10: Halftone.initParticles() BEGIN for channels = '" + this.channels +
										"'. isJustCopy: " + this.options.isJustCopy + ". isJustOne: " +
										this.options.isJustOne, this: this } );

		var getParticlesMethod = this.options.isJustCopy ? 'getJustCopyParticles'
					: this.options.isJustOne ? 'getJustOneParticle'
					: this.options.isRadial  ? 'getRadialGridParticles'
							: 'getCartesianGridParticles';
		this.particles = [];
		this.channelParticles = {};
		this.getParticlesMethod = getParticlesMethod;
		this.particlesRejectedBecauseParticleIsOutOfBounds = 0;
		this.particlesRejectedBecausePixelValueLessThanDotSizeThreshold = 0;
		var angles = { red: 1, green: 2.5, blue: 5, lum: 4 };
		for (var i=0, len = this.channels.length; i < len; i++) {
			var channel = this.channels[i];
			var angle = angles[ channel ];
			trr_log( { msg: " ..*3.10a: Halftone.initParticles(): get particles[] via method '" + getParticlesMethod + "()' *", this: this } );
			var particles = this[ getParticlesMethod ]( channel, angle ); // " ..*3.14: Halftone.getCartesianGridParticles()
			this.channelParticles[ channel ] = particles;
			this.particles = this.particles.concat( particles );
		}
		trr_log( { msg: " ..*3.10b: Halftone.initParticles(): DONE: channels.len = '" + this.channels.length +
								"'. particles.len = '" + this.particles.length + "' *", this: this } );
	};

	// 6) Get here via 'this.animate'
	Halftone.prototype.animate = function() {
		trr_log( { msg: " ..*3.11: Halftone.animate() Cycle = " + (this.animateCycles + 1) + "*", this: this, onlyIf: { animationTrace: true } } );
		if ( !this.isActive ) {
			return;
		}
		this.animateCycles += 1;
		this.update(); // " ..*3.12: Halftone.update() "
		this.render(); // " ..*3.12a: Halftone.render() "
		requestAnimationFrame(this.animate.bind( this));
	};

	Halftone.prototype.update = function() {
		if ( this.options.isJustCopy || this.options.isJustOne ) {
			return;
		}
		trr_log( { msg: " ..*3.12: Halftone.update() animate cycle " + this.animateCycles + ": Start update loop for " + this.particles.length + " particles *" , this: this, onlyIf: { animationTrace: true } } );
		for (var i=0, len = this.particles.length; i < len; i++) {
			var particle = this.particles[i];
			particle.update(); // " ..*2c: Particle.update()"
		}
	};

	Halftone.prototype.render = function() {
		if ( this.options.isJustCopy ) {
			this.renderJustCopy();
			return;
		} else if ( this.options.isJustOne ) {
			this.renderJustOne();
			return;
		}
		this.ctx.globalCompositeOperation = 'source-over';
		// NOTE: ?? seems to need to be 'black' if we set canvas.backgroundColor to 'white' earlier.
		// was: this.options.isAdditive ? 'black' : 'white';
		this.ctx.fillStyle = this.options.canvasBackgroundColor == 'white'
				? 'black'
				: this.options.isAdditive ? 'black' : 'white';
		this.ctx.fillRect( 0, 0, this.width, this.height );
		this.ctx.globalCompositeOperation = this.options.isAdditive ? 'lighter' : 'darker';
		var loop_limit = this.channels.length;
		trr_log( { msg: " ..*3.12a: Halftone.render() animate cycle " + this.animateCycles + ": Start render loop for " + this.channels.length + " channels *" , this: this, onlyIf: { animationTrace: true } } );
		for ( var i=0; i < loop_limit; i++ ) {
			var channel = this.channels[i];
			this.renderGrid( channel, i ); // " ..*3.13: Halftone.renderGrid() *"
		}
	};

	var channelFillStyles = {
		additive: {
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
		}
	};

	Halftone.prototype.renderGrid = function( channel, channelIndex ) {
		// trr_log( { msg: " ..*3.13: Halftone.renderGrid() *" , this: this, onlyIf: { animationTrace: true } } );
		var proxy = this.proxyCanvases[ channel ];
		// NOTE: init canvas with one color, i.e. the 'canvasBackgroundColor'
		// this.imgDataBackgroundRGBA
		// was: this.options.isAdditive ? 'black' : 'white';
		proxy.ctx.fillStyle = this.options.canvasBackgroundColor == 'copied'
				? this.imgDataBackgroundRGBA
				: this.options.canvasBackgroundColor;
		proxy.ctx.fillRect( 0, 0, this.width, this.height );
		var blend = this.options.isAdditive ? 'additive' : 'subtractive';
		// NOTE: set the color of the dots for the halftone. i.e. dotsColor
		// was: proxy.ctx.fillStyle = channelFillStyles[ blend ][ channel ];
		proxy.ctx.fillStyle = this.options.dotsColor == 'calculated'
				? channelFillStyles[ blend ][ channel ] : this.options.dotsColor;
		var particles = this.channelParticles[ channel ];

		trr_log( { msg: " ..*3.13a: Halftone.renderGrid() LOOP START for animate cycle " + this.animateCycles + ": channel '" + channel + "'. For " + particles.length + " particles. *" , this: this, onlyIf: { animationTrace: true } } );
		var loop_limit = particles.length;
		this.maxRenderGridOuterIndex = this.channels.length -1;
		this.maxRenderGridInnerIndex = loop_limit;
		for ( var i=0; i < loop_limit; i++ ) {
			var particle = particles[i];
			particle.render(proxy.ctx, channelIndex, i); // " ..*2d: Particle.render()"
		}
		trr_log( { msg: " ..*3.13b: Halftone.renderGrid() LOOP END for animate cycle " + this.animateCycles + ": going to call 'this.ctx.drawImage(proxy.canvas, 0, 0)' *" , this: this, onlyIf: { animationTrace: true } } );
		this.ctx.drawImage(proxy.canvas, 0, 0);
		//trr_log( { msg: " ..*3.13c: Halftone.renderGrid() DONE *" , this: this, onlyIf: { animationTrace: true } } );
	};

	Halftone.prototype.getCartesianGridParticles = function(channel, angle) {
		trr_log( { msg: " ..*3.14: Halftone.getCartesianGridParticles() for channel '" + channel + "'. angle '" + angle + "' *", this: this } );
		var particles = [];
		var w = this.width,
			  h = this.height,
				gridSize = this.gridSize,
				diag = Math.max( w, h ) * ROOT_2,
				cols = Math.ceil( diag / gridSize ),
				rows = Math.ceil( diag / gridSize );
		this.maxNumOfParticles =  rows * cols;
		this.maxParticlesInitOuterIndex = rows -1;
		this.maxParticlesInitInnerIndex = cols -1;
		trr_log( { msg: " ..*3.14a: CartesianGridParticles(): BEGIN LOOP: gridSize = " + this.gridSize +
							  ". rows = " + rows + ". columns = " + cols +
								". Max number of particles = " + this.maxNumOfParticles +
								". *", this: this } );
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
				// Returns null if rejected. Else returns Particle.
        // NOTE: rejected particle locations just stay whatever the canvas
        // background/fill color is.
				var particle = this.initParticle(channel, x2, y2, row, col); // " ..*3.15: Halftone.initParticle()"
				if ( particle ) {
					particles.push(particle);
				}
			}
		}
		trr_log( { msg: " ..*3.14b: CartesianGridParticles(): END LOOP: particles[].len = " +
								particles.length + ". Out of " + this.maxNumOfParticles + " possible. " +
								"Particles Rejected Because Particle Is Out Of Bounds = '" + this.particlesRejectedBecauseParticleIsOutOfBounds +
								"'. Particles Rejected Because Pixel Value Less Than Dot Size Threshold = '" + this.particlesRejectedBecausePixelValueLessThanDotSizeThreshold +
								"'. *", this: this } );
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
				var particle = this.initParticle( channel, x, y, level, j );
				if (particle){
					particles.push( particle );
				}
			}
		}
		return particles;
	};

	Halftone.prototype.initParticle = function(channel, x, y, outer_index, inner_index) {
		trr_log( { msg: " ..*3.15: Halftone.initParticle() for channel '" +
										channel + "'. x '" + x + "'. y '" + y +
										"'. outer_index: '" + outer_index + "'. inner_index: '" + inner_index + "'. *" ,
							 this: this, outer_index: outer_index, inner_index: inner_index,
							 onlyIf: { particleInitTrace: true }
						 } );
		var pixelR_or_g_or_bValue = this.getPixelR_or_g_or_bValue(x, y, channel);
		if ( pixelR_or_g_or_bValue == 0 ) {
			return;
		}
		// Returns null if rejected. Else returns Particle.
		// NOTE: rejected particle locations just remain whatever the canvas
		// background/fill color is.
		if ( pixelR_or_g_or_bValue < this.options.dotSizeThreshold ) {
			this.particlesRejectedBecausePixelValueLessThanDotSizeThreshold += 1;
			return;
		}
		return new Particle( { // make instance of " ..*2a: create Particle()"
			channel: channel,
			parent: this,
			origin: new Vector( x, y ),  // instance of " ..*1a: anonFunc1().Vector"
			naturalSize: this.gridSize * ROOT_2 / 2,
			friction: this.options.friction
		});
	};

	var channelOffset ={red:0, green:1, blue:2};

	Halftone.prototype.getPixelR_or_g_or_bValue = function(x, y, channel) {
		x = Math.round(x / this.imgScale);
		y = Math.round(y / this.imgScale);
		var w = this.imgWidth;
		var h = this.imgHeight;
		if (x < 0 || x > w || y < 0 || y > h) {
			this.particlesRejectedBecauseParticleIsOutOfBounds += 1;
			return 0;
		}
		// this.imgData Is a Uint8ClampedArray representing a one-dimensional
		// array containing the data in the RGBA order, with integer values between
		// 0 and 255 (included). sarah.jpg imgData.len = '582400'
		var pixelIndex = (x + y * w) * 4;
		var value;
		if (channel === 'lum') {
			value = this.getPixelLum( pixelIndex );
		} else {
			var index = pixelIndex + channelOffset[channel];
			value = this.imgData[ index ] / 255;
		}
		value = value || 0;
		if (!this.options.isAdditiv ) {
			value = 1 - value;
		}
		return value;
	};

	Halftone.prototype.getPixelLum = function(pixelIndex) {
		var r = this.imgData[ pixelIndex + 0 ] / 255;
		var g = this.imgData[ pixelIndex + 1 ] / 255;
		var b = this.imgData[ pixelIndex + 2 ] / 255;
		var max = Math.max( r, g, b );
		var min = Math.min( r, g, b );
		return ( max + min ) / 2;
	};

	/*Halftone.prototype.bindEvents = function(){};
	Halftone.prototype.unbindEvents = function(){};*/
	Halftone.prototype.destroy = function() {
		this.isActive = false;
		/*this.unbindEvents();*/
		this.img.style.visibility = '';
		this.img.style.display = '';
		/*this.canvas.parentNode.removeChild( this.canvas );*/
	};

	Halftone.Vector = Vector;
	Halftone.Particle = Particle;
	window.BreathingHalftone = Halftone;
})(window); // end anonymous function3()

function trr_log( args ) {
	if ( args.this == undefined ) {
		console.log( args.msg );
		return;
	}
	var pluginThis = null,
			particleThis = null;
	if ( args.this.parent !== undefined ) {
		// being called from Particle.
		particleThis = args.this;
		pluginThis = particleThis.parent;
	} else if ( args.this.options !== undefined ) {
		// being called by BreathingHalftone method.
		pluginThis = args.this;
	}
	if ( !pluginThis ) {
		console.log( args.msg );
		return;
	}
	// logLevel: 'none', 'info', 'debug', 'all',
	// onlyIf: 	 'particleInitTrace', 'animationTrace'
	var logLevel = pluginThis.options.logLevel,
			onlyIf = args.onlyIf || null;

	if ( logLevel == 'none' ) {
		return;
	}
	if ( !onlyIf || logLevel == 'debug' || logLevel == 'all' ) {
		console.log( args.msg );
		return;
	}
	//-----------------------------------------
	if ( onlyIf.particleInitTrace ) {
		//---------------------------------------
		if ( logLevel !== 'particleInitTrace' ) {
			return;
		}
		pluginThis.tracingParticleInitialization = true;
		if ( args.outer_index == undefined ) {
			console.log( args.msg );
			return;
		}
		if ( pluginThis.getParticlesMethod == 'getCartesianGridParticles' ) {
			var continueTracing = false;
			// Only trace first and last 5 particle inits for every 4 loops.
			if ( args.outer_index == 0 ||
			     args.outer_index == pluginThis.maxParticlesInitOuterIndex ||
				 	 args.outer_index % 4 == 0 ) {
				if ( args.inner_index < 5 ||
			 		 	 args.inner_index >  pluginThis.maxParticlesInitInnerIndex - 4 ) {
					continueTracing = true;
				}
				if ( args.inner_index == 0 ||
			 		   args.inner_index ==  pluginThis.maxParticlesInitInnerIndex - 4 ) {
				  console.log( "                                      .............." );
			  }
			}
			if ( !continueTracing ) {
				return;
			}
			pluginThis.particleInitLogLines += 1;
		}
	//------------------------------------------------
	} else if ( onlyIf.animationTrace ) {
		//----------------------------------------------
		if ( pluginThis.tracingParticleInitialization ||
				 pluginThis.animateCycles > pluginThis.maxAnimateCycles ) {
			console.log( "**** STOPPED ANIMATION because " + (pluginThis.tracingParticleInitialization
											? "we were tracing Particle Initialization"
											: "we have made " + pluginThis.animateCycles + " animate() cycles. Max is set to " + pluginThis.maxAnimateCycles) +
									 ". ****");
			pluginThis.isActive = false;
			return;
		}
		if ( logLevel !== 'animationTrace' ) {
			return;
		}
		pluginThis.tracingAnimation = true;
		if ( args.outerIndex == undefined ) {
			console.log( args.msg );
			return;
		}
		var continueTracing = false;
		// Only trace first 5 particle animation updates for every 50 particles.
		if ( (args.innerIndex < 5 || args.innerIndex > pluginThis.maxRenderGridInnerIndex - 4) ||  // first 5 or last 5
				 args.innerIndex % 50 == 0 ) { // every 50
			continueTracing = true;
		}
		if ( args.innerIndex == 0 ) {
				console.log( "                                      .............." );
		}
		if ( !continueTracing ||
				 pluginThis.animationLogLines > pluginThis.maxAnimationLogLines ) {
			return;
		}
		pluginThis.animationLogLines += 1;
	}
	console.log( args.msg );
};

// sarah_400x364_72dpi.jpg:
var petrospap_breathing_halftone_image_info = [

{ image_name: 'sarah_400x364_72dpi_jpeg',
  // ..*3.8a: Halftone.getImgData(): imgData.len = '582400'. imgWidth = '400'. imgHeight = '364' *
  image_data_as_uri:
"data:image/jpeg;base64,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"
},

];
