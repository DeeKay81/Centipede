let centipede = [];
let start = [4,4]
let scoreDisplay = document.querySelector('.scoreboard');
let score = 0;
let highscoreDisplay = document.querySelector('.highscoreboard');
let highscore = 0;
let head;
let apple;
let board = document.getElementById('game-area');
let currentDirection
let currentIntervalId
let direction = {
    // [row, col]
    "ArrowUp": [-1, 0],
    "ArrowDown": [1, 0],
    "ArrowLeft": [0, -1],
    "ArrowRight": [0, 1]
}
let allowedMoves = {
    "ArrowUp": ["ArrowLeft","ArrowRight"],
    "ArrowDown": ["ArrowLeft","ArrowRight"],
    "ArrowLeft": ["ArrowUp","ArrowDown"],
    "ArrowRight": ["ArrowUp","ArrowDown"]
}

let backgroundMusic = document.getElementById("backgroundMusic")

function play() {
    return backgroundMusic.paused ? backgroundMusic.play() : music_stop();
}

function music_stop() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}

function initBoard() {
    board.innerHTML = "";
    let area = ''
    for (let i = 0; i < 30; i++) {
        for (let j = 0; j < 30; j++) {
            area += '<div id=\'col-'+i+'-'+j+'\' class=\'col\'></div>';
        }
    }
    board.innerHTML = area;
}

function initGame() {
    initScore()
    centipede = [];
    centipede.push(start);
    initBoard();
    randomFoodPosition();
    drawBoard();
    document.addEventListener("keydown", startMove);
}

initGame();

function startMove(pressed){
    let key = pressed.code.toString()
    if ((!(currentDirection)) || (allowedMoves[currentDirection].includes(key))) {
        setTimeout(function (){currentDirection = key},125);
        if (currentIntervalId) {
            clearInterval(currentIntervalId);
        }
        currentIntervalId = setInterval(function () {
            movement(key);
        }, 125);
    }
}

function movement(key){
    let newPosition = [];
    if (key in direction) {
        head = centipede[0];
        newPosition.push(head[0] + direction[key][0]);
        newPosition.push(head[1] + direction[key][1]);
        centipede.unshift(newPosition);
        let result = collision(newPosition, currentIntervalId);
        if (result === 'pop') {
            centipede.pop();
            let removeCentipede = document.getElementById("col-" + newPosition[0] + "-" + newPosition[1]);
            removeCentipede.classList.remove("centipede");
        }
        drawBoard();
    }
}

function theScore() {
    scoreDisplay.innerHTML = ++score;
    if (score > highscore) {
        highscore = score;
        highscoreDisplay.innerHTML = '' + highscore;
    }
}

function collision(head, currentIntervalId){
    const equals = (head, apple) => JSON.stringify(head) === JSON.stringify(apple);
    let headMinX = Math.min(head[0]);
    let headMinY = Math.min(head[1]);
    let headMaxY = Math.max(head[1]);

    if (headMinX < 0 || headMinX > 29 || headMinY < 0 || headMaxY > 29){
        clearInterval(currentIntervalId);
        gameOver();
    } else if (equals(head,apple)) {
        eat();
        return "eat";
    } else {
        centipede.forEach(function(element, index){
            if (index>0) {
                const equalsSelf = (head, element) => JSON.stringify(head) === JSON.stringify(element);

                if (equalsSelf(head,element)) {
                    clearInterval(currentIntervalId);
                    gameOver();
                }
            }
        })
        return "pop";
    }
}

function eat(){
    let appleElement = document.getElementById("col-"+apple[0]+"-"+apple[1]);
    appleElement.classList.remove("apple");
    theScore();
    randomFoodPosition();
}

function randomFoodPosition(){
    do {
        apple = [Math.floor(Math.random() * 30), Math.floor(Math.random() * 30)];
        element = document.getElementById("col-" + apple[0]+"-"+apple[1]);
    }
    while (element.classList.contains("centipede"));
}

function resetGame(){
    currentDirection = false;
    initGame();
}

function gameOver(){
    alert("Game Over! Press OK to restart!");
    resetGame();

}

function drawBoard(){
    initBoard();
    centipede.forEach(element =>{
        let elementId = "col-" + element[0] + "-" + element[1];
        let centipedePart = document.getElementById(elementId);
        centipedePart.classList.add("centipede");
    });
    let appleElement = document.getElementById("col-"+apple[0]+"-"+apple[1])
    appleElement.classList.add('apple');

}

function initScore() {
    scoreDisplay.innerHTML = 0;
    score = 0;
}