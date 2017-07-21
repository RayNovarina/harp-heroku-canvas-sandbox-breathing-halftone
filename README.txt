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
<div class="canvas-col" style="display: inline-block;">
  <img id="dragcp" class="halftone" src="./images/mike_stern_CC_600x620.jpg" data-src="./images/mike_stern_CC_600x620.jpg" />

  <div class="buttons-row" style="">
    <div class="profile-buttons" style="display: inline-block; width: 100px;">
      <div id="buttons">
        <a class="if_image_link_clicked" photoTag="mike" action="new_photo"
           type="color" imgSrc="./images/mike_stern_CC_600x620.jpg"
        >Mike</a>
      </div>
      <div id="buttons">
        <a class="if_image_link_clicked" photoTag="mike" action="new_photo"
           type="halftone" imgSrc="./images/mike_stern_CC_halftone.png"
        >as Halftone</a>
      </div>
    </div>

    <div class="buttons-row" style="">
      <div class="profile-buttons" style="display: inline-block; width: 100px;">
        <div id="buttons">
          <a class="if_image_link_clicked" photoTag="meg" action="new_photo"
             type="color" imgSrc="./images/meg_CC_422x436.jpg"
          >Meg</a>
        </div>
        <div id="buttons">
          <a class="if_image_link_clicked" photoTag="meg" action="new_photo"
             type="halftone" imgSrc="./images/meg_makalou_CC_halftone.png"
          >as Halftone</a>
        </div>
      </div>
    </div>

    <div class="profile-buttons" style="display: inline-block; width: 100px; border-left: 2px black solid;">
      <div id="buttons">
        <a id="blue" style="color: red;">Blue</a>
      </div>
      <div id="buttons">
        <a id="black" style="color: red;">Black</a>
      </div>
    </div>

    <div class="profile-buttons" style="display: inline-block; width: 100px; border-left: 2px black solid;">
      <div id="buttons">
        <a id="removehalftone">Remove<br/>&nbsp;Halftone</a>
      </div>
    </div>
  </div>

</div>
