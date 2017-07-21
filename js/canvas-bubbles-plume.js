var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");


var blobArray = [];

setInterval(draw, 20);

function draw() {
    //alert('Hello');
    var blob = {
        x: getRandomInt(200, 300),
        y: 500,
        xSpeed: getRandomInt(-1,2),
        ySpeed:  getRandomInt(-6,-1),
        r: getRandomInt(0, 0),
        g: getRandomInt(0, 150),
        b: getRandomInt(200, 255),
        CirSize: 5
        };
    blobArray.push(blob);


    ctx.clearRect(0, 0, 700, 800);

    for (var i = 0; i < blobArray.length; i++) {

        blob = blobArray[i];

        ctx.beginPath();
        ctx.arc(blob.x,blob.y,blob.CirSize,0,2*Math.PI);
        ctx.fillStyle = "rgb(" + blob.r + "," + blob.g + "," + blob.b + ")";
        ctx.strokeStyle="rgb(" + blob.r + "," + blob.g + "," + blob.b + ")";
        ctx.fill();
        ctx.stroke();



        blob.CirSize = blob.CirSize * 0.99
        blob.x = blob.xSpeed + blob.x + getRandomInt(-3,3);
        blob.y = blob.ySpeed + blob.y;
    }

}
function getRandomInt(min,max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
}
