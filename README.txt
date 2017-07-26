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
if ( isJustOne ) {
  onlyIf = onlyIf || {  };
  if ( onlyIf.justOne ) {
    if ( onlyIf.particleInitTrace == undefined &&
         onlyIf.animationTrace == undefined ) {

    }
  //onlyIf.particleInitTrace = true;
  onlyIf.animationTrace = true;
}

} else if ( onlyIf.animationTrace ) {
  //----------------------------------------------
  // Always check for animation loop limits. The only place we do check.
  if ( ( !isTracePixell && pluginThis.tracingParticleInitialization ) ||
    pluginThis.animateCycles > pluginThis.options.maxAnimationCycles ) {
    console.log( "**** STOPPED ANIMATION: " +
        ( pluginThis.tracingParticleInitialization
          ? "Because we were tracing Particle Initialization. "
          : "" ) +
        ( pluginThis.animateCycles > pluginThis.options.maxAnimationCycles
          ? "Because we have made " + pluginThis.animateCycles + " animate() cycles. Max is set to " + pluginThis.options.maxAnimationCycles
          : "" ) +
        ". Num Particles[]: " + pluginThis.particles.length +
        ". numParticlesRenderedAtTargetSize: " + pluginThis.numParticlesRenderedAtTargetSize,
        ". ****");
    pluginThis.isActive = false;
    return;
  }
  if ( !isTracePixell && args.animateCycles == undefined && logLevel !== 'animationTrace' ) {
    return;
  }

  =================
  var loggedAsParticleInitTrace = false;
	//-----------------------------------------
	if ( ( onlyIf.particleInitTrace && logLevel == 'particleInitTrace' ) ||
       ( logLevel == 'tracePixell' || logLevel == 'justCopy' ) ) {
		//---------------------------------------
		pluginThis.tracingParticleInitialization = true;
		var logIt = false;
		if ( args.outer_index == undefined ) {
			logIt = true;
		} else if ( pluginThis.getParticlesMethod == 'getCartesianGridParticles' ) {
			// Only trace first and last 5 particle inits for every 4 loops.
			if ( args.outer_index == 0 ||
			     args.outer_index == pluginThis.maxParticlesInitOuterIndex ||
				 	 args.outer_index % 4 == 0 ) {
				if ( args.inner_index < 5 ||
			 		 	 args.inner_index >  pluginThis.maxParticlesInitInnerIndex - 4 ) {
					logIt = true;
				}
				if ( args.inner_index == 0 ||
			 		   args.inner_index ==  pluginThis.maxParticlesInitInnerIndex - 4 ) {
				  console.log( "                                      .............." );
			  }
			}
		}
		if ( logIt ) {
			console.log( args.msg );
			loggedAsParticleInitTrace = true;
			pluginThis.particleInitLogLines += 1;
			return;
		}
	}

	var loggedAsAnimationTrace = false;
	if ( ( onlyIf.animationTrace && logLevel == 'animationTrace' ) ||
	     ( logLevel == 'tracePixell' || logLevel == 'justCopy' ) ) {
		var logIt = false;
		if ( args.outerIndex == undefined && args.animateCycles == undefined ) {
			logIt = true;
		} else {
			pluginThis.tracingAnimation = true;
			if ( args.animateCycles !== undefined ) {
				// Only trace first animation cycles of every 20 loops.
				if ( args.animateCycles % 20 == 1 ) {
					logIt = true;
				}
			} else if ( args.outerIndex !== undefined ) {
				// Only trace first 5 particle animation updates for every 50 particles.
				if ( (args.innerIndex < 5 || args.innerIndex > pluginThis.maxRenderGridInnerIndex - 4) ||  // first 5 or last 5
				 	  	args.innerIndex % 50 == 0 ) { // every 50
					logIt = true;
				}
				if ( args.innerIndex == 0 ) {
						console.log( "                                      .............." );
				}
			}
		}
		if ( logIt &&
				 pluginThis.animationLogLines < pluginThis.maxAnimationLogLines ) {
				 pluginThis.animationLogLines += 1;
				 loggedAsAnimationTrace = true;
			 	 console.log( args.msg );
				 return;
		}
	}
