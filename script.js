const SIZE = 15;
let isGameOver = false;
const X = "X", O = "O";
let currPlayer = X;
let board;

// resets the board back to an empty 15x15 board.
function resetBoard() {
    board = [];
    for (let i = 0; i < SIZE; i++) {
        board.push([]);
        for (let j = 0; j < SIZE; j++) {
            board[i].push(null);
        }
    }
}

/** Checks for winning condition, and returns the winning player (if a win is found) 
 * or false (if a win is not found). Note: this function implements a more efficient way 
 * of checking where the entire board doesn't have to be scanned -- instead, only the 
 * corresponding horizontal, vertical, and diagonal lines of the player's last move are scanned.
 */
function checkWin(x, y) {
    // vertical
    for (let i = 0; i < SIZE - 4; i++) {
        if (board[i][y] && board[i+1][y] === board[i][y] && board[i+2][y] === board[i][y]
                        && board[i+3][y] === board[i][y] && board[i+4][y] === board[i][y]) {
            return currPlayer;
        }
    }
    // horizontal
    for (let i = 0; i < SIZE - 4; i++) {
        if (board[x][i] && board[x][i+1] === board[x][i] && board[x][i+2] === board[x][i]
                        && board[x][i+3] === board[x][i] && board[x][i+4] === board[x][i]) {
            return currPlayer;
        }
    }
    // diagonal
    // ...
    return false;
}

/* returns true if the next move results in a win, false otherwise */
function move(x, y) {
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            if (i === x && j === y) {
                board[i][j] = currPlayer;
                if (checkWin(x, y)) return true;
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
    #lastClickedCell;
    #lastClickedCellColour;
    constructor() {
        this.#box = document.querySelector(".box");
        this.#cells = document.querySelectorAll(".cell");
        this.#text = document.querySelector(".text");
        this.#reset = document.querySelector("button");
        this.#lastClickedCell = null;
        this.#lastClickedCellColour = null;
    }

    
    // creates 15x15 HTML elements for the board.
    buildBoard() {
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                const cell = document.createElement("div");
                cell.setAttribute("class", "cell");
                // pad rows and cols to 2 digits for id parsing (i.e., 5 becomes 05, 11 stays as 11)
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
        resetBoard();
    }

    // draws 'X' or 'O' if a cell is clicked. Need buildBoard() to be called first.
    cellOnClick() {
        this.#cells.forEach(cell => {
            cell.addEventListener("click", () => {
                if (!cell.innerHTML && !isGameOver) {
                    this.#nextCellColour(cell);
                    // draw X or O on the board
                    cell.innerHTML = currPlayer;
                    const id = cell.id;
                    let moveX = +(id[0] + id[1]), moveY = +(id[2] + id[3]);
                    if (move(moveX, moveY)) {
                        // if currPlayer wins
                        this.#text.innerHTML = `Player ${currPlayer} wins!`;
                        isGameOver = true;
                    } else {
                        // if no one wins yet
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
            resetBoard();
            this.#cells.forEach(cell => {
                cell.innerHTML = "";
            });
            this.#text.innerHTML = "";
            currPlayer = X;
            isGameOver = false;
            // convert previous cell's colour back to the its default colour
            this.#nextCellColour(null);
        });
    }

    /* -------------------- PRIVATE METHODS -------------------- */
    
    /* convert last clicked cell's colour back to the its default colour,
    and the next cell's colour to yellow (if exists). */
    #nextCellColour(nextCell) {
        if (this.#lastClickedCell && this.#lastClickedCellColour) {
            this.#lastClickedCell.style.backgroundColor = this.#lastClickedCellColour;
        }
        
        if (nextCell) {
            this.#lastClickedCell = nextCell;
            let style = getComputedStyle(nextCell);
            this.#lastClickedCellColour = style.backgroundColor;
            nextCell.style.backgroundColor = "var(--last-move)";  // --last-move is yellow (roughly)
        }
    }
}


// MAIN
let front = new Front();
front.buildBoard();
front.cellOnClick();
front.resetOnClick();