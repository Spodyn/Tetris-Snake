window.onload = function(){
    bestScore = localStorage.getItem("bestScore2");
    if(bestScore != null){
        document.querySelector('#max').innerText = "Best Score: " + bestScore;
    }
}

/*Variables*/
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let bestScore = 0;

const arena = createTable(10, 20);

const content = document.querySelector('#content');

/*Context out*/
const context = content.getContext('2d');

/*Scaling every element in the canvsas*/
context.scale(20, 20);

/*Create table of the game*/
function createTable(width, height) {
    const table = [];
    while (height--) {
        table.push(new Array(width).fill(0));
    }
    return table;
}

/*Spawning blocks*/
function spawn() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, content.width, content.height);

    spawntable(arena, {x: 0, y: 0});
    spawntable(player.table, player.pos);
}

function spawntable(table, offset) {
    table.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x,
                                 y + offset.y,
                                 1, 1);
            }
        });
    });
}


function deleteLines() {
    let rowCount = 1;
    outer: for (let y = arena.length -1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;

        player.score += rowCount * 10;
        rowCount *= 2;
    }
}

function collide(arena, player) {
    const m = player.table;
    const o = player.pos;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
               (arena[y + o.y] &&
                arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function rotate(table, dir) {
    for (let y = 0; y < table.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                table[x][y],
                table[y][x],
            ] = [
                table[y][x],
                table[x][y],
            ];
        }
    }

    if (dir > 0) {
        table.forEach(row => row.reverse());
    } else {
        table.reverse();
    }
}

function merge(arena, player) {
    player.table.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function blockDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        reset();
        deleteLines();
        updateScore();
    }
    dropCounter = 0;
}

function blockMove(offset) {
    player.pos.x += offset;
    if (collide(arena, player)) {
        player.pos.x -= offset;
    }
}

function playerRotate(keydown) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.table, keydown);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.table[0].length) {
            rotate(player.table, - keydown);
            player.pos.x = pos;
            return;
        }
    }
}

function reset() {
    const pieces = 'TJLOSZI';
    player.table = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) -
                   (player.table[0].length / 2 | 0);
    if (collide(arena, player)) {
        console.log(player.score);
        alert('Game Over. You score: ' + player.score + ' Click "OK" to play again.')
        arena.forEach(row => row.fill(0));
        player.score = 0;
        updateScore();
    }
}

/*Dropping blocks*/
function update(time = 0) {
    const deltaTime = time - lastTime;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        blockDrop();
    }
    lastTime = time;
    spawn();
    requestAnimationFrame(update);
}

function updateScore() {
    document.querySelector('#score').innerText = "Score: " + player.score;
    if(player.score>bestScore){
        bestScore = player.score;
        document.querySelector('#max').innerText ="Best Score: " + bestScore;
        localStorage.setItem("bestScore2", bestScore);
    }
}

function pause(){
    confirm("Paused")
}

const player = {
    pos: {x: 0, y: 0},
    table: null,
    score: 0,
};

const colors = [
    null,
    '#03eff1',
    '#0001f0',
    '#ef9f00',
    '#f0f001',
    '#00f000',
    '#a000f2',
    '#f00000'
];

/*Type of blocks*/
function createPiece(type)
{
    if (type === 'I') {
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ];
    } else if (type === 'L') {
        return [
            [0, 2, 0],
            [0, 2, 0],
            [0, 2, 2],
        ];
    } else if (type === 'J') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [3, 3, 0],
        ];
    } else if (type === 'O') {
        return [
            [4, 4],
            [4, 4],
        ];
    } else if (type === 'Z') {
        return [
            [5, 5, 0],
            [0, 5, 5],
            [0, 0, 0],
        ];
    } else if (type === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (type === 'T') {
        return [
            [0, 7, 0],
            [7, 7, 7],
            [0, 0, 0],
        ];
    }
}
document.querySelector('#pause').addEventListener('click', event =>{
    pause()
})
document.addEventListener('keydown', event => {
    
    switch(event.key){
        case "ArrowUp":
        case "w":
        case "W":
            playerRotate(1);
            break;
        case "ArrowRight":
        case "d":
        case "D":
            blockMove(1);            
            break;
        case "ArrowDown":
        case "s":
        case "S":
            blockDrop();
            break;
        case "ArrowLeft":
        case "a":
        case "A":
            blockMove(-1);
            break;
        case "p":
        case "P":
            pause();
            break;

   }
});


/*Just call a functions*/ 
reset();
updateScore();
update();