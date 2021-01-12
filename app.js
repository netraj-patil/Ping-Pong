const cvs = document.getElementById("pingPong");
const context = cvs.getContext("2d");
const PlayPause = document.getElementById("PlayPause");
var MenuItems = document.getElementById("MenuItems");

//user paddle
const user = {
    x:0,
    y: cvs.height/2 - 100/2,
    width : 10,
    height : 100,
    color : "white",
    score : 0
}

//computer paddle
const comp = {
    x : cvs.width-10,
    y: cvs.height/2 - 100/2,
    width : 10,
    height : 100,
    color : "white",
    score : 0
}

// ball
const ball = {
    x : cvs.width/2,
    y : cvs.height/2,
    radius : 10,
    speed : 5,
    velocityX : 5,
    velocityY : 5,
    color : "white"
}



//net
const net ={
    x : cvs.width/2 -1,
    y : 0,
    width : 2,
    height : 10,
    color : "white"
}

function drawNet(){
    for(let i =0; i<= cvs.height; i+=15){
        drawRectangle(net.color, net.x, net.y+i, net.width, net.height);
    }
}

function drawRectangle(color, x, y, w, h){
    context.fillStyle = color;
    context.fillRect(x,y,w,h);
}

function drawCircle(x, y, r, color){
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI *2, false);
    context.closePath();
    context.fill(); 
}

function drawText(text,x,y,color){
    context.fillStyle= color;
    context.font='45px fantasy';
    context.fillText(text, x, y);
}

//render function
function render(){
    //clearing the canvas
    drawRectangle("#008f01", 0,0,cvs.clientWidth, cvs.clientHeight);

    drawNet();

    drawText(user.score, cvs.width/4, cvs.height/4, "white");
    drawText(comp.score, 3*cvs.width/4, cvs.height/4, "white");

    //paddles
    drawRectangle(user.color,user.x, user.y, user.width, user.height);
    drawRectangle( comp.color,comp.x, comp.y, comp.width, comp.height);

    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// control paddle of user
cvs.addEventListener("mousemove", movePaddle);

function movePaddle(event){
    //The getBoundingClientRect() method returns the size of an element and its position relative to the viewport.
    let rect = cvs.getBoundingClientRect();

    user.y = event.clientY - rect.top - user.height/2;
}

//collission
function collission(ba, pl){
    ba.top = ball.y - ball.radius;
    ba.bottom = ball.y + ball.radius;
    ba.left = ball.x - ball.radius;
    ba.right = ball.x + ball.radius;

    pl.top = pl.y;
    pl.bottom = pl.y + pl.height;
    pl.left = pl.x;
    pl.right = pl.x + pl.width;

    if(ba.right > pl.left && ba.bottom > pl.top && ba.left < pl.right && ba.top < pl.bottom)
        return true;
    else
        return false;
}

// reset

function resetBall(){
    ball.x = cvs.width/2;
    ball.y = cvs.height/2;
    ball.speed =  5;
    ball.velocityX = -ball.velocityX;
}

//update
function update(){
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    //control the computer paddle
    let compLevel = 0.1;
    comp.y += (ball.y- (comp.y +comp.height/2)) * compLevel;

    if(ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0){
        ball.velocityY = - ball.velocityY;
    }

    let player = (ball.x < cvs.width/2)? user : comp;

    if(collission(ball, player)){
        let collidePoint = ball.y - (player.y + player.height/2);

        collidePoint = collidePoint/(player.height/2);

        //calculate the angle
        let angle = collidePoint * Math.PI/4;

        let dir = (ball.x < cvs.width/2)? 1 : -1;
        //change the velocity x and y
        ball.velocityX = dir * ball.speed * Math.cos(angle);
        ball.velocityY = dir * ball.speed * Math.sin(angle);
        
        ball.speed += 0.5;
    }

    //update the score
    if(ball.x - ball.radius < 0){
        comp.score++;
        resetBall();
    }else if(ball.x + ball.radius > cvs.width){
        user.score++;
        resetBall();
    }
}

//game
function game(){
    update();
    render();
}

let setGame;
function handlePlayPause(str){
    if(str === "play"){
        PlayPause.innerHTML = `<button onclick="handlePlayPause('pause')">Pause</button>
            <button onclick="handleReset()">Reset</button>`;
        setGame = setInterval(game, 1000/50);
    }else{
        PlayPause.innerHTML = `<button onclick="handlePlayPause('play')">Play</button>
            <button onclick="handleReset()">Reset</button>`;
        clearInterval(setGame);
    }
}

MenuItems.style.maxHeight = "0px";      //sets the max height of the menu  bar to 0 px i.e. it dissappers
function menutoggle(){
    if(MenuItems.style.maxHeight == "0px")
    {
        MenuItems.style.maxHeight = "200px";
    }
    else
    {
        MenuItems.style.maxHeight = "0px";
    }
}

function handleReset(){
    resetBall();
    
    user.score = 0;
    comp.score = 0;
    user.y = cvs.height/2 - 100/2;
    comp.y = cvs.height/2 - 100/2;
    clearInterval(setGame);
    render();
    PlayPause.innerHTML = `<button onclick="handlePlayPause('play')">Play</button>
            <button onclick="handleReset()">Reset</button>`;
}
render();

