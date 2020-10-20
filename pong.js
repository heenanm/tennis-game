 //set consts
 const PADDLE_WIDTH = 10;
 const PADDLE_HEIGHT = 100;
 const WINNING_SCORE = 10;

 // set game stop boolean

 let gameOver = false;

 // declare canvas and ball variables
 let canvas;
 let canvasContext;
 let ballX = 100;
 let ballSpeedX = 5;
 let ballY = 100;
 let ballSpeedY = 5;
 let ballDiameter = 20;

 // set player variables
 let paddle1Y = 210;
 let paddle1X = 1;
 let playerScore = 0;

 // declare CPU player variables
 let paddle2Y;
 let paddle2X;
 let paddleSpeed = 8;
 let player2Score = 0;
 
 // Run function after page is rendered
 window.onload = function() {
     canvas = document.getElementById('gameCanvas');
     canvasContext = canvas.getContext('2d');
     
     // event listeners
     // set player paddle y with mouse position
     canvas.addEventListener('mousemove', 
         function(evt) {
             let mousePos = calculateMousePos(evt);
             paddle1Y = mousePos.y - PADDLE_HEIGHT/2;
     });

     canvas.addEventListener('mousedown', handleMouseClick);

     function handleMouseClick(evt) {
         if(gameOver) {
             playerScore = 0;
             player2Score = 0;
             gameOver = false;
         }
     }
     
    // set initial CPU paddle position
    paddle2Y = canvas.height/2 - PADDLE_HEIGHT/2;
    paddle2X = canvas.width - (PADDLE_WIDTH + 1);


     // set refresh rate of the game loop
     var framesPerSecond = 60;
     setInterval(function() {
         moveEverything();
         drawEverything();
     }, 1000/framesPerSecond);
 }

 // functions

 function drawNet() {
     for(var i = 10; i<canvas.height; i+=40) {
         drawRect(canvas.width/2 - 1, i, 2, 20, 'white')
     }
 }

 function computerMovement() {
     if(paddle2Y + PADDLE_HEIGHT/2 < ballY - 35){
         paddle2Y += paddleSpeed;
     } else if(paddle2Y + PADDLE_HEIGHT/2 > ballY + 35){
         paddle2Y -= paddleSpeed;
     }
 }

 function moveEverything() {
     if(gameOver) {
         return;
     }
     computerMovement();

     ballX += ballSpeedX;
     ballY += ballSpeedY;
     if(ballX < 0 + PADDLE_WIDTH + 1) {
         if(ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
             ballSpeedX = -ballSpeedX;

             let deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
             ballSpeedY = deltaY * 0.35;
         } 
     }

     if(ballX < 0 + 3)
     {
         player2Score += 1;
         ballReset();
     }
    
     if(ballX > canvas.width - (PADDLE_WIDTH + 1)) {
         if(ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
             ballSpeedX = -ballSpeedX;

             let deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
             ballSpeedY = deltaY * 0.35;
         } 
     }

     if(ballX > canvas.width - 3) {
         playerScore += 1;
         ballReset();
     }
    
     if(ballY > canvas.height - ballDiameter/2 || ballY < 0 + ballDiameter/2) {
         ballSpeedY = -ballSpeedY;
     }
 } 

 function drawEverything() {
     // next line blanks out the screen with black
     drawRect(0,0, canvas.width,canvas.height, 'black');
     // check for game over
     if(gameOver) {
         canvasContext.fillStyle = 'white';
         canvasContext.font = "bold 30px Helvetica, Arial, sans-serif";
         canvasContext.textAlign = 'center';
         if(playerScore >= WINNING_SCORE) {
             canvasContext.fillText("You Win!", canvas.width/2, 50);
         } else {
             canvasContext.fillText("You Lose!", canvas.width/2, 50);
         };
         canvasContext.fillText("Click to play again", canvas.width/2, 100);
         return;
     }
     drawNet();
     // next line draws left player paddle
     drawRect(paddle1X, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
     // draw AI paddle
     drawRect(paddle2X, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT);
     // next line draws the ball
     drawCircle(ballX,ballY, ballDiameter/2, 'white')
     canvasContext.font = "bold 30px Helvetica, Arial, sans-serif";
     canvasContext.fillText(playerScore, canvas.width/3, 50);
     canvasContext.fillText(player2Score, canvas.width - canvas.width/3, 50);

 }

  // reset if out of bounds
  function ballReset() {
         if(playerScore >= WINNING_SCORE || player2Score >= WINNING_SCORE ) {
             gameOver = true;
         }

         ballSpeedX = -ballSpeedX;
         ballSpeedY = 5;
         ballX = canvas.width/2;
         ballY = canvas.height/2;
     }

 function calculateMousePos(evt) {
     let rect = canvas.getBoundingClientRect();
     let root = document.documentElement;
     let mouseX = evt.clientX - rect.left - root.scrollLeft;
     let mouseY = evt.clientY - rect.top - root.scrollTop;
     return {
         x: mouseX,
         y: mouseY
     };
 }


 function drawRect(leftX, TopY, width, height, drawColor) {
     canvasContext.fillStyle = drawColor;
     canvasContext.fillRect(leftX,TopY, width,height);
 }

 function drawCircle(centerX,centerY, radius, color) {
     canvasContext.fillStyle = color;
     canvasContext.beginPath();
     canvasContext.arc(centerX,centerY, radius, 0, Math.PI*2, true );
     canvasContext.fill();
 }