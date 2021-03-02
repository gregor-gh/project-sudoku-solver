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

  checkValuePlacement(puzzleString, coordinate, value) {

    // get the row index by looking up the charcode of the capitalised first coord charcter and subtracting 65 (A is 65)
    const row = coordinate.toUpperCase().charCodeAt(0) - 65;

    // column is simpler, just subtract 1 from second coord character
    const column = Number(coordinate[1]) - 1;
    
    // now call row placement check using the supplied puzzle, value and calculated row/columns
    const existsInRow = this.checkRowPlacement(puzzleString, row, value);
    const existsInColumn = this.checkColPlacement(puzzleString, column, value);
    const existsInRegion = this.checkRegionPlacement(puzzleString, row, column, value);

    // return an object containing the true false values
    return { existsInRow, existsInColumn, existsInRegion };

    }


  checkRowPlacement(puzzleString, row, value) {

    // first extract the relevant row by multiplying the row by 9 (9 rows in a puzzle) and adding 8 to get 9 fields
    const puzzleRow = puzzleString.substring(row * 9, row * 9 + 8);

    // now check if value exists in that row
    if (puzzleRow.indexOf(value) === -1) {
      return false; // if value isn't found in the row return false
    } else {
      return true; // if value is found return true
    }
  }

  checkColPlacement(puzzleString, column, value) {

    // first extract the relevant column by extracting chracter column + i * 9
    let puzzleCol = "";
    for (let index = 0; index < 9; index++) {
      puzzleCol += puzzleString[column + index * 9];
    }

    // now check if value exists in that column
    if (puzzleCol.indexOf(value) === -1) {
      return false; // if value isn't found in the column return false
    } else {
      return true; // if value is found return true
    }
  }

  checkRegionPlacement(puzzleString, row, col, value) {

    // calculate the region starting field
    const regionRow = Math.floor(row / 3); // region row index
    const regionCol = Math.floor(col / 3); // region column index
    const regionStart = regionRow * 9 * 3 + regionCol * 3; // the starting index of the region

    let puzzleRegion = "";

    // get the 3 relevant digits from each row in a region
    for (let index = 0; index < 3; index++) {
      const rowIndex = regionStart + index * 9; // start index of the nth row
      
      puzzleRegion += puzzleString.substring(rowIndex, rowIndex + 3); // pull 3 characters out the main string
    }

    // finally check if value exists in that region
    if (puzzleRegion.indexOf(value) === -1) {
      return false; // if value isn't found in the region return false
    } else {
      return true; // if value is found return true
    }

  }

  solve(puzzleString) {

  }
}

module.exports = SudokuSolver;

