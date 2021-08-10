/*Variables*/
let lastRenderTime = 0
let paused = false
let gameOver = false
let bestScore = 0
let score = 0
const gameBoard = document.querySelector("#game-board")

/*Main function*/
function main(currentTime) {   
    if(gameOver){
		bestScore = localStorage.getItem("bestScore1")
        updateScore()
        if(confirm("You lost. Your score: " + score + ". Best score: " + bestScore + ". Press ok to restart")){
            location.reload(true)
        }
        return 
    }
    window.requestAnimationFrame(main)
    const secondsSinceLastRender = (currentTime - lastRenderTime) /1000
    if(secondsSinceLastRender < 1 / SNAKE_SPEED) return


    lastRenderTime = currentTime

    update()
    draw()
}
/*Call animation and function*/
window.requestAnimationFrame(main)



function update(){
    updateSnake()
    updateFood()
    checkDeath()
}

function draw(){
    gameBoard.innerHTML = ""
    drawSnake(gameBoard)
    drawFood(gameBoard)
}

function checkDeath(){
    gameOver = outsideGrid(getSnakeHead()) || snakeIntersection()
}

/*About Snake -----------------------*/
 let SNAKE_SPEED = 3
 let SPEED_HELP = 0
const snakeBody = [
    {x:11, y:11}
]
let newSegments = 0

 function updateSnake(){
    addSegments()
    const inputDirection = getInputDirection()
    for(let i = snakeBody.length - 2; i >=0; i--){
        snakeBody[i+1] = {...snakeBody[i] }
    }

    snakeBody[0].x += inputDirection.x
    snakeBody[0].y += inputDirection.y
}

 function drawSnake(gameBoard){
    snakeBody.forEach(segment =>{
        const snakeElement = document.createElement("div")
        snakeElement.style.gridRowStart = segment.y
        snakeElement.style.gridColumnStart = segment.x
        snakeElement.classList.add("snake")
        gameBoard.appendChild(snakeElement)
    })
}

 function expandSnake(amout){
    newSegments += amout
    SNAKE_SPEED += 0.25
    addScore()
}

 function onSnake(position, {ignoredHead = false} = {}){
    return snakeBody.some((segment,index) =>{
        if(ignoredHead &&index ==0) return false
        return equalPositions(segment, position)
    })
}

 function getSnakeHead(){
    return snakeBody[0]
}

 function snakeIntersection(){
    return onSnake(snakeBody[0], { ignoredHead: true})
}

function equalPositions(pos1, pos2){
    return pos1.x === pos2.x && pos1.y === pos2.y
    
}

function addSegments() {
    for(let i=0; i< newSegments; i++){
        snakeBody.push({ ...snakeBody[snakeBody.length -1] })
    }

    newSegments = 0
}

/*Input---------------*/
let inputDirection = { x:0, y:0 }
let lastInputDirection = { x:0, y:0 }
window.addEventListener("keydown", e =>{
    switch(e.key) {
        case "ArrowUp":
        case "w":
        case "W":
            if(lastInputDirection.y!==0) break
            inputDirection = { x: 0, y: -1 }
            break
        case "ArrowDown":
        case "s":
        case "S":
            if(lastInputDirection.y!==0) break
            inputDirection = { x: 0, y: 1 }
            break
        case "ArrowLeft":
        case "a":
        case "A":
            if(lastInputDirection.x!==0) break
            inputDirection = { x: -1, y: 0 }
            break
        case "ArrowRight":
        case "d":
        case "D":
            if(lastInputDirection.x!==0) break
            inputDirection = { x: 1, y: 0 }
            break
        case "p":
        case "P":
            pause()
            break
    }
})

 function getInputDirection(){
    lastInputDirection = inputDirection
    return inputDirection
}

/*Grid and positions------------*/
const GRID_SIZE = 21

 function randomGridPosition(){
    return {
        x: Math.floor(Math.random()*GRID_SIZE) +1,
        y: Math.floor(Math.random()*GRID_SIZE) +1,
    }
}

 function outsideGrid(position){
    return(
        position.x<1 || position.x > GRID_SIZE || 
        position.y<1 || position.y > GRID_SIZE 
    )
}

/*Food points-------------------*/

let food = getRandomFoodPosition()
const EXPANSION_RATE = 1

 function updateFood(){
    if(onSnake(food)){
        expandSnake(EXPANSION_RATE)
        food = getRandomFoodPosition()
    }
}

 function drawFood(gameBoard){
        const foodElement = document.createElement("div")
        foodElement.style.gridRowStart = food.y
        foodElement.style.gridColumnStart = food.x
        foodElement.classList.add("food")
        gameBoard.appendChild(foodElement)
    
}

function getRandomFoodPosition(){
    let newFoodPosition
    while(newFoodPosition == null || onSnake(newFoodPosition)){
        newFoodPosition = randomGridPosition()
    }
    return newFoodPosition
}

/*Score*/
function updateScore() {
    if(score>bestScore){
        bestScore = score
        localStorage.setItem("bestScore1", bestScore);
    }
}

function addScore(){
    score += 1
    document.querySelector("#score").innerHTML = "Score: " + score;
}

/*Pause -------------*/

document.querySelector("#pause").addEventListener("click", event =>{
    pause()
})

function pause(){
    if(paused==false){
    SPEED_HELP = SNAKE_SPEED
    SNAKE_SPEED = 0
    paused = true
    document.querySelector("#pauseText").style.display = "flex"
        document.querySelector("#pause").innerText = "Start"
    }
    else{
        SNAKE_SPEED = SPEED_HELP
        SPEED_HELP = 0
        paused = false
        document.querySelector("#pauseText").style.display = "none"
        document.querySelector("#pause").innerText = "Pause"
    }
}