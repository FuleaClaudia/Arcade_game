var canvas;
var canvasContext;
var ballX = 50; //position from left to right
var ballY = 50; //position from up to down

var ballSpeedX = 10;
var ballSpeedY = 4;

var paddle1Y = 250; //position of the paddle on the Y axe
var paddle2Y = 250;
const PADDLE_HEIGHT = 100; //constant stays the same while the var changes 

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;
var showWinScreen = false;


function calculateMousePosition(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}
function handleMouseClick(evt){
	if(showWinScreen){
		player1Score = 0;
		player2Score = 0; 
		showWinScreen = false;
	}
}

window.onload = function(){
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	
	var framesPerSecond = 30;
	setInterval(function(){
		drawEverything();
		moveEverything();
	}, 1000/framesPerSecond); //basic dynamic (motion)

	canvas.addEventListener('mousemove', 
		function(evt){
			var mousePos = calculateMousePosition(evt);
			paddle1Y = mousePos.y - (PADDLE_HEIGHT/2); //updating the paddle1Y position with the mouse
		});

	canvas.addEventListener('mousedown', handleMouseClick);
}	

function colorRect(leftX,topY,width, height, drawColor){
	canvasContext.fillStyle = drawColor; //set the color of the figure 
	canvasContext.fillRect(leftX, topY, width, height);//first two values represent the values from the top left corner(to the right and from the top down)
}
function colorCircle(centerX, centerY, radius, drawColor){
	//drawing the ball
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX,centerY, radius, 0, Math.PI*2, true) 
	canvasContext.fill();	
}

function drawNet(){
	for(var i=0; i< canvas.height; i+=40){
		colorRect(canvas.width/2 -1, i, 2, 20, 'white');
	}
}

function drawEverything(){
	//setting the canvas
	colorRect(0,0,canvas.width, canvas.height, 'CornflowerBlue');
	if(showWinScreen){
		canvasContext.fillStyle = 'white';
		if(player1Score >=WINNING_SCORE)
				canvasContext.fillText("Left player won", 350,200);
		else if (player2Score >= WINNING_SCORE)
				canvasContext.fillText("Right player won",350, 200);
		
		canvasContext.fillText("click to continue", 350, 500);
		return;
	}

	drawNet();
	//this is a left player paddle
	colorRect(0,paddle1Y,10, PADDLE_HEIGHT, 'white');
	
	//this is a right player paddle
	colorRect(canvas.width - 10,paddle2Y,10, PADDLE_HEIGHT, 'white');
	//drawing the ball
	colorCircle(ballX, ballY, 10, 'white');

	canvasContext.fillText(player1Score, 100,100);
	canvasContext.fillText(player2Score,canvas.width-100,100);
}
function computerMovement(){

	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
	if(paddle2YCenter < ballY -35 ){
		paddle2Y = paddle2Y +6;
	}else if(paddle2YCenter > ballY +35 ) {
		paddle2Y = paddle2Y -6;
	}
}

function moveEverything(){
	if(showWinScreen){
		return;
	}


	computerMovement();

	ballX = ballX + ballSpeedX;
	ballY = ballY + ballSpeedY;
	//ballSpeedX++; accelerate
	
	if(ballX > canvas.width-10){ // check if it leaves the canvas on the right side
		if(ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT){
				ballSpeedX= -ballSpeedX;
				
				var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2); //these lines are for ball control
				ballSpeedY = deltaY * 0.35;				

				}else {

						player1Score++;
						ballReset(); 
					}	


	}
	if(ballX < 10){ // check if it leaves the canvas on the left side
			if(ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT){
				ballSpeedX= -ballSpeedX;
				var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
				ballSpeedY = deltaY * 0.35;

				}else {
						player2Score ++;
						ballReset(); 
					}	
	}

	if(ballY > canvas.height){ // check if it leaves the canvas on the top side
 
		ballSpeedY = -ballSpeedY; 	
	}
	if(ballY < 0){ // check if it leaves the canvas on the bottom side

		ballSpeedY = -ballSpeedY; 
	}
}

function ballReset(){
	if(player1Score >=WINNING_SCORE || player2Score >= WINNING_SCORE){
		showWinScreen = true;
	}
	ballSpeedX = -ballSpeedX;
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}

