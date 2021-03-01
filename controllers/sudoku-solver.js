import puzzlesAndSolutions from "./puzzle-strings.js"

class SudokuSolver {



  validate(puzzleString) {
    // first validate length
    if (puzzleString.length !== 81) return "not 81"

    // now check for incorrect characters
    const regex = /([0-9]|\.){81}/
    if (!puzzleString.match(regex)) return "invalid char"

    // otherwise puzzle should be valid
    return "valid"

  }

  checkRowPlacement(puzzleString, row, column, value) {

  }

  checkColPlacement(puzzleString, row, column, value) {

  }

  checkRegionPlacement(puzzleString, row, column, value) {

  }

  solve(puzzleString) {

  }
}

module.exports = SudokuSolver;

