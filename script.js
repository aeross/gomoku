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
                cell.setAttribute("id", `${i}${j}`);  // id[0] is row, id[1] is col
                this.#box.appendChild(cell);
            }
        }
        this.#cells = document.querySelectorAll(".cell");
    }

    // draws 'X' or 'O' if a cell is clicked. Need buildBoard() to be called first.
    cellOnClick() {
        this.#cells.forEach(cell => {
            cell.addEventListener("click", () => {
                if (!cell.innerHTML && !isGameOver) {
                    cell.innerHTML = currPlayer;
                    const id = cell.id;
                    // if (move(+id[0], +id[1])) {
                    //     // if currPlayer wins
                    //     this.#text.innerHTML = `Player ${currPlayer} wins!`;
                    //     isGameOver = true;
                    // } else {
                        // otherwise, if no one wins, the game goes on
                        switch (currPlayer) {
                            case X: currPlayer = O; break;
                            case O: currPlayer = X; break;
                        }
                    // }
                }
            })
        });
    }

    // reset
    resetOnClick() {
        this.#reset.addEventListener("click", () => {
            reset(board);
            this.#cells.forEach(cell => {
                cell.innerHTML = "";
            });
            this.#text.innerHTML = "";
            currPlayer = X;
            isGameOver = false;
        });
    }
}

class Back {
    constructor() {}

    
}


// MAIN
reset();
let front = new Front();
front.buildBoard();
front.cellOnClick();
front.resetOnClick();