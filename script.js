const SIZE = 15;
let isGameOver = false;
const X = "X", O = "O";
let currPlayer = X;
let board;

// resets the board back to an empty 15x15 board.
function reset() {
    board = [];
    for (let i = 0; i < SIZE; i++) {
        board.push([]);
        for (let j = 0; j < SIZE; j++) {
            board[i].push(null);
        }
    }
}

/** Checks for winning condition, and returns the winning playern(if a win is found) 
 * or false (if a win is not found). Note: this function implements a more efficient way 
 * of checking where the entire board doesn't have to be scanned -- instead, only the 
 * corresponding horizontal, vertical, and diagonal lines of the player's last move.
 */
function checkWin(lastMove = null) {
    if (!lastMove) return false;
    let x = lastMove[0], y = lastMove[1];
    
    // vertical
    for (let i = 0; i < SIZE; i++) {
        if (board[i][y] && board[i+1][y] === board[i][y] && board[i+2][y] === board[i][y]
                        && board[i+3][y] === board[i][y] && board[i+4][y] === board[i][y]) {
            return currPlayer;
        }
    }
    // horizontal
    for (let i = 0; i < SIZE; i++) {
        if (board[x][i] && board[x][i+1] === board[x][i] && board[x][i+2] === board[x][i]
                        && board[x][i+3] === board[x][i] && board[x][i+4] === board[x][i]) {
            return currPlayer;
        }
    }
    // diagonal
    // let a = x - 4, b = y - 4, found = 1;
    // for (let i = 0; i < SIZE; i++) {
    //     if (board[a][b] && board[a+1][i+1] === board[a][b]) {
    //         found++;
    //     } else {
    //         found = 1;
    //     }
    //     if (found === 5) {
    //         return currPlayer;
    //     }
    //     a++; b++;
    // }
}

/* returns true if the next move results in a win, false otherwise */
function move(nextMove) {
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            if (i === nextMove[0] && j === nextMove[1]) {
                board[i][j] = currPlayer;
                if (checkWin(nextMove)) return true;
            }
        }
    }
    return false;
}

class Front {
    #box;
    #cells;
    #text;
    #reset;
    constructor() {
        this.#box = document.querySelector(".box");
        this.#cells = document.querySelectorAll(".cell");
        this.#text = document.querySelector(".text");
        this.#reset = document.querySelector("button");
    }

    // creates 15x15 HTML elements for the board.
    buildBoard() {
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                const cell = document.createElement("div");
                cell.setAttribute("class", "cell");
                // pad rows and cols to 2 digits (i.e., 5 becomes 05, 11 stays as 11)
                let row = String(i).padStart(2, '0');
                let col = String(j).padStart(2, '0');
                cell.setAttribute("id", `${row}${col}`);

                // beautify the board colours
                if ((((i + 1) * SIZE) + (j + 1)) % 2 === 0) {
                    cell.style.backgroundColor = "var(--cell1)";
                } else {
                    cell.style.backgroundColor = "var(--cell2)";
                }
                this.#box.appendChild(cell);
            }
        }
        this.#cells = document.querySelectorAll(".cell");
        reset();
    }

    // draws 'X' or 'O' if a cell is clicked. Need buildBoard() to be called first.
    cellOnClick() {
        this.#cells.forEach(cell => {
            cell.addEventListener("click", () => {
                if (!cell.innerHTML && !isGameOver) {
                    cell.innerHTML = currPlayer;
                    const id = cell.id;
                    let moveX = +(id[0] + id[1]), moveY = +(id[2] + id[3]);
                    if (move([moveX, moveY])) {
                        // if currPlayer wins
                        this.#text.innerHTML = `Player ${currPlayer} wins!`;
                        isGameOver = true;
                    } else {
                        // otherwise, if no one wins, the game goes on
                        switch (currPlayer) {
                            case X: currPlayer = O; break;
                            case O: currPlayer = X; break;
                        }
                    }
                }
            })
        });
    }

    // reset
    resetOnClick() {
        this.#reset.addEventListener("click", () => {
            reset();
            this.#cells.forEach(cell => {
                cell.innerHTML = "";
            });
            this.#text.innerHTML = "";
            currPlayer = X;
            isGameOver = false;
        });
    }
}


// MAIN
reset();
let front = new Front();
front.buildBoard();
front.cellOnClick();
front.resetOnClick();