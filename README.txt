cd /users/raynovarina/sites/AtomProjects/harp/canvas-petrospap-breathing-halftone/

per: https://codepen.io/SylvaShadow/pen/vEjRde

Created and initialized harp app:

$ cd /users/raynovarina/sites/AtomProjects/harp/
$ mkdir canvas-bubbles-plume
$ cd canvas-bubbles-plume/
$ md js
$ md css
$ echo "This is /harp/canvas-bubbles-plume/index.html via localhost:9002" > index.html

Start harp server:
$ harp server -p 9003

Access via localhost:9003
============================

Add package.json and Procfile files for Heroku deploy:
  package.json:

    {
      "name": "harp-heroku-canvas-bubbles-plume",
      "version": "0.0.1",
      "description": "Harp server App: javascript/canvas/animated bubbles",
      "dependencies": {
        "harp": "*"
      }
    }

  Procfile:

    web: harp server --port $PORT

At github account, create new repository: harp-heroku-canvas-bubbles-plume and then
locally.
  $ git init
  $ git remote add origin https://github.com/RayNovarina/harp-heroku-canvas-bubbles-plume.git

Create Heroku app:
  $ heroku create harp-canvas-bubbles-plume-9403

$ git remote -v
  heroku  https://git.heroku.com/harp-canvas-bubbles-plume-9403.git (fetch)
  heroku  https://git.heroku.com/harp-canvas-bubbles-plume-9403.git (push)
  origin  https://github.com/RayNovarina/harp-heroku-canvas-bubbles-plume.git (fetch)
  origin  https://github.com/RayNovarina/harp-heroku-canvas-bubbles-plume.git (push)

Deploy changes to github and heroku:
  $ git add .
  $ git commit -am "First Harp + Heroku commit"
  $ git push origin master
  $ git push heroku master

View on Heroku:

  https://harp-canvas-bubbles-plume-9403.herokuapp.com shows:

  Welcome to harp/canvas-bubbles-plume.
  Deployed locally at http://localhost:9002/
  Deployed on Heroku at https://harp-canvas-bubbles-plume-9403.herokuapp.com/

------------------------------
Replace with github exploding exploding profiles code and redeploy working
version to Heroku.

Erase all harp files except for package.json, Procfile.
Clone from github exploding-effects repository into projects/exploding-effects
folder and move those folder into harp/canvas-dots.

Because we have no layout.jade file, hard seems to set the app root at
harp/canvas-dots.

Load app as is from localhost:9000/pages/management.html

Fixup a lot of problems.
harp less preprocessor seems to only be able to find management.less file if
it is at app root (harp/canvas-dots). Gets converted to a .css file when
loaded.

commit and push fixed version to github.
push to heroku.

load heroku version via https://harp-canvas-bubbles-plume-94037.herokuapp.com/pages/management.html

===============================

LOGIC TRACE:

--------------------------
1) page load:
--------------------------
..*3a: anonFunc3a()                                                               modified-breathing-halftone.js:206:3
..*3a.1: anonFunc3a(). Created <canvas> imgData.len = '4'                         modified-breathing-halftone.js:222:3
..*3b: anonFunc3(): have request or cancelAnimationFrame().                       modified-breathing-halftone.js:252:3
..*3b.1 ======= loaded and waiting for button to be clicked =====                 modified-breathing-halftone.js:253:3
..*0: html.jQuery(document).ready().                                              localhost:9003:26:4
..*1: anonFunc1()                                                                 modified-breathing-halftone.js:10:2
..*2: anonFunc2()                                                                 modified-breathing-halftone.js:65:2
..*3: anonFunc3()                                                                 modified-breathing-halftone.js:171:2
..*3.1: ===== WHERE LIFE BEGINS =======                                           modified-breathing-halftone.js:172:2

====== AT THIS POINT: ========
  we are looking at the loaded page with a color pic in the animation container.

---------------------------
2) Click on 'Blue' button:
---------------------------
..*0e: html.$('#blue').click() *                                                  localhost:9003:72:5
..*0b: html.removeHalftone() *                                                    localhost:9003:38:5
..*0a: html.addHalftone() for channel 'blue'. *                                   localhost:9003:26:5

//------------------------------------------------------------------------------
// ..*3.1: creating Halftone() *                                                  modified-breathing-halftone.js:262:3
//------------------------------------------------------------------------------
	// 1) Get here via 'new BreathingHalftone( el_img, {options} )'
	function Halftone(img, options){
		console.log(" ..*3.1: creating Halftone() *");
		this.options = extend({}, this.constructor.defaults, true);
		extend(this.options, options, true);
		this.img = img;
		if (!supports.canvas){
			return;
		}
		this.create(); // " ..*3.3: Halftone.create() *"
	}

..*3.3: Halftone.create() *                                                       modified-breathing-halftone.js:303:3
	// 2) Get here via 'this.create()'
	// Inputs:
	//   this.options = {}
	//   this.img = <img src=xxx>
	Halftone.prototype.create = function() {
		console.log(" ..*3.3: Halftone.create() *");
		this.isActive = true;
		var canvasAndCtx = makeCanvasAndCtx(); // ..*3.2: makeCanvasAndCtx() *
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
			this.proxyCanvases[ channel ] = makeCanvasAndCtx(); // ..*3.2: makeCanvasAndCtx() *
		}
		this.loadImage(); // " ..*3.6: Halftone.loadImage() "
		this.canvasPosition = new Vector(); // instance of " ..*1a: anonFunc1().Vector"
		this.getCanvasPosition(); // " ..*3.4: Halftone.getCanvasPosition() *"
		this.cursors = {};
    // return and wait for user input/click on action button.
	};

  ..*3.2: makeCanvasAndCtx() *                                                      modified-breathing-halftone.js:290:3

  	function makeCanvasAndCtx() {
  		console.log(" ..*3.2: makeCanvasAndCtx() *");
  		var canvas = document.createElement('canvas');
  		var ctx = canvas.getContext('2d');
  		return { canvas:canvas,
  						 ctx:ctx
  		};
  	}

  ..*3.6: Halftone.loadImage(): src = './images/sarah.jpg' *                        modified-breathing-halftone.js:337:3
  	// 3) Get here via 'this.loadImage'
  	Halftone.prototype.loadImage = function() {
  		var src = this.img.getAttribute('data-src') || this.img.src;
  		console.log(" ..*3.6: Halftone.loadImage(): src = '" + src + "' *");
  		var loadingImg = new Image();
  		loadingImg.onload = function() {
  			this.onImgLoad();
  		}.bind( this );
  		loadingImg.src = src;
  		if ( this.img.src !== src ) {
  			this.img.src = src;
  		}
  	};
  ..*1a: anonFunc1().Vector                                                         modified-breathing-halftone.js:14:3
  ..*3.4: Halftone.getCanvasPosition(): BoundingClientRect x: 412 y: 8 *            modified-breathing-halftone.js:329:3

    //------------------------------------------------------------------------------
    ..*3.7: Halftone.onImgLoad() calls getImgData thru animate() *                    modified-breathing-halftone.js:350:3
    // 4) Get here via 'this.onImgLoad'
	   Halftone.prototype.onImgLoad = function() {
		   console.log(" ..*3.7: Halftone.onImgLoad() calls getImgData thru animate() *");
		   this.getImgData(); " ..*3.8: Halftone.getImgData() *"
		   this.resizeCanvas(); " ..*3.9: Halftone.resizeCanvas() *"
		   this.getCanvasPosition(); // " ..*3.4: Halftone.getCanvasPosition() *"
		   this.img.style.display = 'none';
		   this.getCanvasPosition(); // " ..*3.4: Halftone.getCanvasPosition() *"
		   this.initParticles(); // " ..*3.10: Halftone.initParticles() ""
		   this.animate(); // " ..*3.11: Halftone.animate() *"
	  };

    ..*3.8: Halftone.getImgData() *                                                   modified-breathing-halftone.js:361:3
	  Halftone.prototype.getImgData = function() {
		  console.log(" ..*3.8: Halftone.getImgData() *");
		  var canvasAndCtx = makeCanvasAndCtx();
		  var imgCanvas = canvasAndCtx.canvas;
		  var ctx = canvasAndCtx.ctx;
		  this.imgWidth = imgCanvas.width = this.img.naturalWidth;
		  this.imgHeight = imgCanvas.height = this.img.naturalHeight;
		  ctx.drawImage( this.img, 0, 0 );
		  this.imgData = ctx.getImageData( 0, 0, this.imgWidth, this.imgHeight ).data;
		  console.log(" ..*3.8a: Halftone.getImgData(): imgData.len = '" + this.imgData.length +
			  					"'. imgWidth = '" + this.imgWidth + "'. imgHeight = '" + this.imgHeight + "' *");
	  };
    ..*3.2: makeCanvasAndCtx() *                                                  modified-breathing-halftone.js:290:3
    ..*3.8a: Halftone.getImgData(): imgData.len = '582400'.
                                    imgWidth = '400'. imgHeight = '364' *         modified-breathing-halftone.js:369:3

  ..*3.9: Halftone.resizeCanvas(): Begin canvas.width = 300.
                                         canvas.height = 150.
                                         img.offsetWidth = 400.
                                         img.offsetHeight = 364. *                modified-breathing-halftone.js:379:3
  // 5) Get here via 'this.resizeCanvas'
  	Halftone.prototype.resizeCanvas = function() {
  		console.log(" ..*3.9: Halftone.resizeCanvas() *");
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
     ..*3.9a: Halftone.resizeCanvas(): End canvas.width = 400.
                                           canvas.height = 364. *                 modified-breathing-halftone.js:389:3

    ..*3.4: Halftone.getCanvasPosition(): BoundingClientRect x: 412 y: 8 *        modified-breathing-halftone.js:329:3
    ..*1a: anonFunc1().Vector.prototype.set( 412, 8).                             modified-breathing-halftone.js:18:3
    ..*3.4: Halftone.getCanvasPosition(): BoundingClientRect x: 8 y: 8 *          modified-breathing-halftone.js:329:3
    ..*1a: anonFunc1().Vector.prototype.set( 8, 8).                               modified-breathing-halftone.js:18:3

//------------------------------------------------------------------------------
..*3.10: Halftone.initParticles() BEGIN for channels = 'blue' *                   modified-breathing-halftone.js:391:62
  // 6) Get here via 'this.initParticles'
  Halftone.prototype.initParticles = function() {
    console.log(" ..*3.10: Halftone.initParticles() BEGIN *"); console.log("for channels = '" + this.channels + "'");

    var getParticlesMethod = this.options.isRadial ?
      'getRadialGridParticles' : 'getCartesianGridParticles';
    this.particles = [];
    this.channelParticles = {};
    var angles = { red: 1, green: 2.5, blue: 5, lum: 4 };
    for (var i=0, len = this.channels.length; i < len; i++) {
      var channel = this.channels[i];
      var angle = angles[ channel ];
      console.log(" ..*3.10a: Halftone.initParticles(): get particles[] via method '" + getParticlesMethod + "()' *");
      var particles = this[ getParticlesMethod ]( channel, angle );
      this.channelParticles[ channel ] = particles;
      this.particles = this.particles.concat( particles );
    }
    console.log(" ..*3.10b: Halftone.initParticles(): DONE: channels.len = '" + this.channels.length +
                "'. particles.len = '" + this.particles.length + "' *");
  };

..*3.10a: Halftone.initParticles(): get particles[] via
                                          method 'getCartesianGridParticles()' *  modified-breathing-halftone.js:401:4
 ..*3.14: Halftone.getCartesianGridParticles() for channel 'blue'. angle '5' *    modified-breathing-halftone.js:475:3
 	Halftone.prototype.getCartesianGridParticles = function(channel, angle) {
 		console.log(" ..*3.14: Halftone.getCartesianGridParticles() for channel '" + channel + "'. angle '" + angle + "' *");
 		var particles = [];
 		var w = this.width;
 		var h = this.height;
 		var diag = Math.max( w, h ) * ROOT_2;
 		var gridSize = this.gridSize;
 		var cols = Math.ceil( diag / gridSize );
 		var rows = Math.ceil( diag / gridSize );

 		console.log(" ..*3.14a: CartesianGridParticles(): BEGIN LOOP: rows = " + rows + ". columns = " + cols + ". gridSize = " + gridSize + ". *");
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
 				var particle = this.initParticle(channel, x2, y2); // " ..*3.15: Halftone.initParticle()"
 				if ( particle ) {
 					particles.push(particle);
 				}
 			}
 		}
 		console.log(" ..*3.14b: CartesianGridParticles(): END LOOP: particles[].len = " + particles.length + ". *");
 		return particles;
 	};
     ..*3.14a: CartesianGridParticles(): BEGIN LOOP:
                                            rows = 105.
                                            columns = 105.
                                            gridSize = 5.408289933056474. *       modified-breathing-halftone.js:484:3

        ..*3.15: Halftone.initParticle() for channel 'blue'. x '-148.0963909447492'
                                                   y '371.166954360984' modified-breathing-halftone.js:528:3
        // 7) Get here via this.initParticle(channel, x2, y2);
        	Halftone.prototype.initParticle = function(channel, x, y) {
        		//console.log(" ..*3.15: Halftone.initParticle() for channel '" + channel +"'. x '" + x + "'. y '" + y + "'. *");
        		var pixelRgbChannelValue = this.getPixelRgbChannelValue(x, y, channel);
            // Returns null if rejected. Else returns Particle.
            // NOTE: rejected particle locations just stay whatever the canvas
            // background/fill color is.
            if ( pixelRgbChannelValue < this.options.dotSizeThreshold ){
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

          ..*2a: create Particle() for origin.x '385.42463643120624'.
                                 origin.y '359.7907094750392'                     modified-breathing-halftone.js:76:3
          function Particle( properties ) {
                               		//console.log(" ..*2a: create Particle() for origin.x '" + properties.origin.x + "'. origin.y '" + properties.origin.y + "'");
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
            } // end: function Particle()


    ..*1a: anonFunc1().Vector.prototype.set( 385.42463643120624,
                                             359.7907094750392).                  modified-breathing-halftone.js:18:3
        ..*3.15: Halftone.initParticle() for channel 'blue'. x '-146.5622636027196'.
                                                     y '365.98081385975985'. *    modified-breathing-halftone.js:528:3
    ..*2a: create Particle() ....
    ..*1a: anonFunc1().Vector.prototype.set() ...
        ..*3.15: Halftone.initParticle() for channel 'blue'. x '-145.02813626069008'.
                                                     y '360.79467335853576'. *    modified-breathing-halftone.js:528:3
    ..*2a: create Particle() ....
    ..*1a: anonFunc1().Vector.prototype.set() ...
        ..*3.15: Halftone.initParticle() for channel 'blue'. x '-143.49400891866048'.
                                                     y '355.6085328573116'. *     modified-breathing-halftone.js:528:3
    ..*2a: create Particle() ....
    ..*1a: anonFunc1().Vector.prototype.set() ...
        ..*3.15: Halftone.initParticle() for channel 'blue'. x '-141.95988157663095'.
                                                     y '350.4223923560875'. *     modified-breathing-halftone.js:528:3
    ..*2a: create Particle() ....
    ..*1a: anonFunc1().Vector.prototype.set() ...
        ..*3.15: Halftone.initParticle() for channel 'blue'. x '-140.42575423460136'.
                                                     y '345.2362518548633'. *     modified-breathing-halftone.js:528:3
    ..*2a: create Particle() ....
    ..*1a: anonFunc1().Vector.prototype.set() ...
        ..*3.15: Halftone.initParticle() for channel 'blue'. x '-138.89162689257182'.
                                                     y '340.05011135363924'. *    modified-breathing-halftone.js:528:3
    ..*2a: create Particle() ....
    ..*1a: anonFunc1().Vector.prototype.set() ...
        ..*3.15: Halftone.initParticle() for channel 'blue'. x '-137.35749955054223'.
                                                     y '334.8639708524151'. *     modified-breathing-halftone.js:528:3
    ..*2a: create Particle() ....
    ..*1a: anonFunc1().Vector.prototype.set() ...

      ..............

        ..*3.15: Halftone.initParticle() for channel 'blue'. x '549.2773374116058'.
    ..*2a: create Particle() for origin.x '385.42463643120624'.
                                 origin.y '359.7907094750392'                     modified-breathing-halftone.js:76:3
    ..*1a: anonFunc1().Vector.prototype.set()
        ..*3.15: Halftone.initParticle() for channel 'blue'. x '550.8114647536354'.
                                                     y '-8.642414195250979'. *    modified-breathing-halftone.js:526:3
    ..*2a: create Particle() for origin.x '385.42463643120624'.
                                 origin.y '359.7907094750392'                     modified-breathing-halftone.js:76:3
    ..*1a: anonFunc1().Vector.prototype.set()

     ..*3.14b: Halftone.initParticles(): DONE: channels.len = '1'.
                                               particles.len = '3878' *           modified-breathing-halftone.js:406:3

//------------------------------------------------------------------------------
..*3.11: Halftone.animate() *                                                     modified-breathing-halftone.js:412:3
// NOTE: set breakpoint at 3.13c

	// 8) Get here via 'this.animate'
	Halftone.prototype.animate = function() {
		console.log(" ..*3.11: Halftone.animate() *");
		if (!this.isActive){return;}
		this.update(); // " ..*3.12: Halftone.update() "
		this.render(); // " ..*3.12a: Halftone.render() "
		requestAnimationFrame(this.animate.bind( this));
	};

  ..*3.12: Halftone.update() 3878 particles *                                     modified-breathing-halftone.js:420:3

  	Halftone.prototype.update = function() {
  		//console.log(" ..*3.12: Halftone.update() " + this.particles.length + " particles *");
  		for (var i=0, len = this.particles.length; i < len; i++){
  			var particle = this.particles[i];
  			particle.update(); // " ..*2b: Particle.update()"
  		}
  	};

      ..*2b: Particle.update()                                                    modified-breathing-halftone.js:104:3

      	Particle.prototype.update = function() {
      		if ( !this.isVisible && Math.random() > 0.03) {
      			return;
      		}
      		//console.log(" ..*2b: Particle.update()");
      		this.isVisible = true;
      		this.applyOriginAttraction();
      		this.velocity.add( this.acceleration );
      		this.velocity.scale( 1 - this.friction );
      		this.position.add( this.velocity );
      		this.acceleration.set( 0, 0 );
      		this.calculateSize();
      	};

  ..*3.12a: Halftone.render() 1 channels *  modified-breathing-halftone.js:428:3

  	Halftone.prototype.render = function() {
  		//console.log(" ..*3.12a: Halftone.render() " + this.channels.length + " channels *");
  		this.ctx.globalCompositeOperation = 'source-over';
  		this.ctx.fillStyle = this.options.isAdditive ? 'black' : 'white';
  		this.ctx.fillRect( 0, 0, this.width, this.height );
  		this.ctx.globalCompositeOperation = this.options.isAdditive ? 'lighter' : 'darker';

  		for ( var i=0, len = this.channels.length; i < len; i++ ) {
  			var channel = this.channels[i];
  			this.renderGrid( channel ); " ..*3.13: Halftone.renderGrid() *"
  		}
  	};

      //------------------------------------------------------------------------
      ..*3.13: Halftone.renderGrid() *                                            modified-breathing-halftone.js:456:3
      	Halftone.prototype.renderGrid = function( channel ) {
      		console.log(" ..*3.13: Halftone.renderGrid() *");
      		var proxy = this.proxyCanvases[ channel ];
      		proxy.ctx.fillStyle = this.options.isAdditive ? 'black' : 'white';
      		proxy.ctx.fillRect( 0, 0, this.width, this.height );
      		var blend = this.options.isAdditive ? 'additive' : 'subtractive';
      		proxy.ctx.fillStyle = channelFillStyles[ blend ][ channel ];
      		var particles = this.channelParticles[ channel ];

      		console.log(" ..*3.13a: Halftone.renderGrid() LOOP START: channel '" + channel + "'. For " + particles.length + " particles. *");
      		for ( var i=0, len = particles.length; i < len; i++ ) {
      			var particle = particles[i];
      			particle.render(proxy.ctx); // " ..*2c: Particle.render()"
      		}
      		console.log(" ..*3.13b: Halftone.renderGrid() LOOP END: going to call 'this.ctx.drawImage(proxy.canvas, 0, 0)' *");
      		this.ctx.drawImage(proxy.canvas, 0, 0);
      		console.log(" ..*3.13c: Halftone.renderGrid() DONE *");
      	};
      ..*3.13a: Halftone.renderGrid() LOOP START: channel 'blue'.
                                                  For 3878 particles. *           modified-breathing-halftone.js:464:3

          ..*2c: Particle.render()                                                modified-breathing-halftone.js:115:3

          	Particle.prototype.render = function(ctx) {
          		//console.log(" ..*2c: Particle.render()");
          		var size = this.size * this.oscSize;
          		var initSize = Math.cos(this.initSize * TAU / 2) * -0.5 + 0.5;
          		size *= initSize;
          		size = Math.max(0, size);
          		ctx.beginPath();
          		ctx.arc(this.position.x, this.position.y, size, 0, TAU);
          		ctx.fill();
          		ctx.closePath();
          	};


      ..*3.13b: Halftone.renderGrid() LOOP END: going to call 'this.ctx.drawImage(proxy.canvas, 0, 0)' *  modified-breathing-halftone.js:469:3
      ..*3.13c: Halftone.renderGrid() DONE *  modified-breathing-halftone.js:471:3


====== we hit breakpoint: AT THIS POINT: ========
  we are looking at blank black canvas animation container.

  Loop continues till breakpoint:

  ..*3.11: Halftone.animate() *  modified-breathing-halftone.js:412:3
 ..*3.12: Halftone.update() 3878 particles *  modified-breathing-halftone.js:420:3
 ..*2b: Particle.update() modified-breathing-halftone.js:104:3
 ..*3.12a: Halftone.render() 1 channels *  modified-breathing-halftone.js:428:3
 ..*3.13: Halftone.renderGrid() *  modified-breathing-halftone.js:456:3
 ..*3.13a: Halftone.renderGrid() LOOP START: channel 'blue'. For 3878 particles. *  modified-breathing-halftone.js:464:3
 ..*2c: Particle.render() modified-breathing-halftone.js:115:3
 ..*3.13b: Halftone.renderGrid() LOOP END: going to call 'this.ctx.drawImage(proxy.canvas, 0, 0)' *  modified-breathing-halftone.js:469:3
 ..*3.13c: Halftone.renderGrid() DONE *  modified-breathing-halftone.js:471:3
 ..*3.11: Halftone.animate() *  modified-breathing-halftone.js:412:3
 ..*3.12: Halftone.update() 3878 particles *  modified-breathing-halftone.js:420:3
 ..*2b: Particle.update() modified-breathing-halftone.js:104:3
 ..*3.12a: Halftone.render() 1 channels *  modified-breathing-halftone.js:428:3
 ..*3.13: Halftone.renderGrid() *  modified-breathing-halftone.js:456:3
 ..*3.13a: Halftone.renderGrid() LOOP START: channel 'blue'. For 3878 particles. *  modified-breathing-halftone.js:464:3
 ..*2c: Particle.render() modified-breathing-halftone.js:115:3
 ..*3.13b: Halftone.renderGrid() LOOP END: going to call 'this.ctx.drawImage(proxy.canvas, 0, 0)' *  modified-breathing-halftone.js:469:3
 ..*3.13c: Halftone.renderGrid() DONE *  modified-breathing-halftone.js:471:3


 ====== we hit breakpoint: AT THIS POINT: ========
   we are looking at partially filled in canvas animation container with blue halftones.
