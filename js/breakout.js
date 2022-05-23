/* 
    Based on the MDN breakout game 
    https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript
*/

let breakoutRunning = false;

document.addEventListener('keyup', (e) => {
    if (e.target === document.body && e.key === '.') {
        document.body.innerHTML = '';
        
        if (!breakoutRunning) {
            breakoutRunning = true
            runBreakout();
        }
    }
});

function runBreakout() {
    let canvas = createCanvas();
    let ctx = canvas.getContext("2d");
    
    let lives = 3;
    let score = 0;

    let paddleHeight = 24;
    let paddleWidth = 144;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let rightPressed = false;
    let leftPressed = false;

    let brickWidth = 144;
    let brickHeight = 24;
    let brickPadding = 24;
    let brickColors = [ '#e84667', '#f19599', '#fad0b1', '#cdc6aa', '#83ae9b' ];
    let brickRowCount = Math.floor(canvas.width / (brickWidth + brickPadding));
    let brickColumnCount = 5;
    let brickOffsetTop = 48;
    let brickOffsetLeft = Math.floor((canvas.width + brickPadding - (brickRowCount * (brickWidth + brickPadding))) / 2);

    let bricks = [];
    for (var c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (var r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    let ballRadius = 12;
    let x = canvas.width / 2;
    let y = canvas.height - brickOffsetTop - 30;
    let dx = 8;
    let dy = -8;

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);
    window.addEventListener("resize",  resizeHandler, false);


    function resizeHandler(e) {
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;

        brickWidth = Math.floor((canvas.width - ((brickRowCount + 1) * brickPadding)) / brickRowCount);
        brickOffsetLeft = Math.floor((canvas.width + brickPadding - (brickRowCount * (brickWidth + brickPadding))) / 2);
    }

    function keyDownHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = true;
        }
        else if (e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = true;
        }
    }
    
    function keyUpHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = false;
        }
        else if (e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = false;
        }
    }

    function mouseMoveHandler(e) {
        let relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
          paddleX = relativeX - paddleWidth / 2;
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.rect(x - ballRadius, y - ballRadius, ballRadius * 2, ballRadius * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - brickOffsetTop - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status == 1) {
                    let brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
                    let brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = brickColors[c];
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function collisionDetection() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                let b = bricks[c][r];
                if (b.status == 1) {
                    if (
                        x > b.x &&
                        x < b.x + brickWidth &&
                        y > b.y &&
                        y < b.y + brickHeight
                    ) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        if (score == brickRowCount * brickColumnCount) {
                            alert("YOU WIN!");
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();

        collisionDetection();

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        
        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius - brickOffsetTop) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            } else {
                lives--;
                if (!lives) {
                    alert("GAME OVER");
                    document.location.reload();
                } else {
                    x = canvas.width / 2;
                    y = canvas.height - brickOffsetTop - 24;
                    dx = 8;
                    dy = -8;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }
        
        if (rightPressed) {
            paddleX += 12;
            if (paddleX + paddleWidth > canvas.width){
                paddleX = canvas.width - paddleWidth;
            }
        }
        else if (leftPressed) {
            paddleX -= 12;
            if (paddleX < 0){
                paddleX = 0;
            }
        }

        x += dx;
        y += dy;

        requestAnimationFrame(draw);
    }

    draw();
}


function createCanvas() {
    let canvas = document.createElement('canvas');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.style.position = 'absolute';
    canvas.style.top = '0px';
    canvas.style.left = '0px';
    document.body.appendChild(canvas);

    return canvas;
}
