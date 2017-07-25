cd /users/raynovarina/sites/AtomProjects/harp/canvas-sandbox-breathing-halftone/

per: https://codepen.io/SylvaShadow/pen/vEjRde
     From petrospap:
     "For my needs I have make some modifications in breathing-halftone.js" at
     https://simply4all.net/js/new/halftone.js

Created and initialized harp app my test respositories:
cd /users/raynovarina/sites/AtomProjects/harp/
$ git clone https://github.com/RayNovarina/harp-canvas-petrospap-breathing-halftone.git canvas-sandbox-breathing-halftone

Start harp server:
$ harp server -p 9004

Access via localhost:9004
============================

Modify package.json and Procfile files for Heroku deploy:
  package.json:

    {
      "name": "harp-canvas-sandbox-breathing-halftone",
      "version": "0.0.1",
      "description": "Harp server App: javascript/canvas/breathing halftone",
      "dependencies": {
        "harp": "*"
      }
    }

  Procfile:

    web: harp server --port $PORT

At github account, create new repository: harp-heroku-canvas-sandbox-breathing-halftone and then
locally.
  $ git init
  $ git remote add origin https://github.com/RayNovarina/harp-heroku-canvas-sandbox-breathing-halftone.git

Create Heroku app:
  $ heroku create harp-ctx2d-sandbox-bhalf-94037

$ git remote -v
  heroku  https://git.heroku.com/harp-ctx2d-sandbox-bhalf-94037.git (fetch)
  heroku  https://git.heroku.com/harp-ctx2d-sandbox-bhalf-94037.git (push)
  origin  https://github.com/RayNovarina/harp-heroku-canvas-sandbox-breathing-halftone.git (fetch)
  origin  https://github.com/RayNovarina/harp-heroku-canvas-sandbox-breathing-halftone.git (push)

Deploy changes to github and heroku:
  $ git add .
  $ git commit -am "First Harp + Heroku commit"
  $ git push origin master
  $ git push heroku master

View on Heroku:

  https://harp-harp-ctx2d-sandbox-bhalf-94037.herokuapp.com shows:

  Welcome to harp/canvas-sandbox-breathing-halftone.
  Deployed locally at http://localhost:9004/
  Deployed on Heroku at https://harp-harp-ctx2d-sandbox-bhalf-94037.herokuapp.com/

------------------------------
Replace with github exploding exploding profiles code and redeploy working
version to Heroku.

commit and push fixed version to github.
push to heroku.

load heroku version via https://harp-harp-ctx2d-sandbox-bhalf-94037.herokuapp.com/

===============================

		// overrides:
		if ( this.isJustCopy ) {

			// ----- Override: options.isAdditive ------------------------------------
			// this.ctx.fillStyle = this.options.isAdditive ? 'black' : 'white';
			// this.ctx.globalCompositeOperation = this.options.isAdditive ? 'lighter' : 'darker';
			//this.channels = !this.options.isAdditive && !supports.darker ?
			//	[ 'lum' ] : this.options.channels;
			this.options.isAdditive = false; // this.ctx.fillStyle = 'white';
																			 // this.ctx.globalCompositeOperation = 'darker';
																			 // this.channels = this.options.channels;

			// ------ Recalc: options.globalCompositeOperation -----------------------
			this.options.globalCompositeOperation = this.options.isAdditive ? 'lighter' : 'darker';

			// ------ Override: options.dotSizeThreshold -----------------------------
			this.options.dotSizeThreshold = 0; // never reject pixell value, i.e.
																				 //   pixelR_or_g_or_bValue < this.options.dotSizeThreshold

			// ------ Override: options.dotSize --------------------------------------
			this.options.dotSize = 1;	// this.gridSize = this.options.dotSize * this.diagonal;
		}

    Halftone.prototype.getCartesianGridParticles = function(channel, angle) {
  		trr_log( { msg: " ..*3.14: Halftone.getCartesianGridParticles() for channel '" + channel + "'. angle '" + angle + "' *", this: this } );
  		var particles = [];
  		var w = this.width,
  			  h = this.height,
  				gridSize = this.gridSize,
  				cols = 0,
  				rows = 0;
  		if (this.isJustCopy) {
  			cols = w;
  			rows = h;
  		} else {
  			var diag = Math.max( w, h ) * ROOT_2;
  			cols = Math.ceil( diag / gridSize );
  			rows = Math.ceil( diag / gridSize );
  		}

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
        } else if ( this.isJustCopy ) {
          value = this.imgData[ pixelIndex ];
        } else {
          var index = pixelIndex + channelOffset[channel];
          value = this.imgData[ index ] / 255;
        }
