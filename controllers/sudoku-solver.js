import e from "cors"
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
    const puzzleRow = puzzleString.substring(row * 9, row * 9 + 9);

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

    // split puzzlEstring into an array
    let puzzleArray = puzzleString.split("");

    // extract array of things to change
    let changeArray = [];
    puzzleArray.forEach((el, index) => {

      // extract row and column
      const row = Math.floor(index / 9); // floor index over nine to get row
      const rowLetter = String.fromCharCode(row + 65); // add 65 to that number and get charcode (65 is A)

      let col = Number(((index / 9) * 10).toString()[3]) + 1; // take the number after the decimal point for column, add one so it's not zero based
      if (!col) col = 1; // if null then it divided by 9 completely, so first column

      const coord = rowLetter + col; // make coord from the rowletter and column letter so we can reuse the check functions

      // push every blank entry in the puzzle into an array with the index and coord
      if (el === ".") {
        changeArray.push({
          index, // index to refer back to position in puzzle string
          coord, // coord to pass to check functions
          validValues: [] // empty array that will have valid values pushed to it later
        });
      }
    });

    let n = 0;
    let limit = 30;

    // loop through single valid-value cells
    while (n <= limit) { // hard coding 30 to avoid never ending loop on harder puzzles
      changeArray.forEach((el, changeIndex) => {

        // try each number
        for (let val = 1; val <= 9; val++) { // for numbers 1-9
          let check = this.checkValuePlacement(puzzleArray.join(""), el.coord, val); // check if number is valid, passing in puzzleArray as i'll be modifying that
          if (!check.existsInRow && !check.existsInColumn && !check.existsInRegion) { // if it is valid
            el.validValues.push(val) // then push to the el valid value array
          }
        }

        // check how many valid values
        if (el.validValues.length === 1) {
          changeArray.splice(changeIndex, 1) // remove from changearray
          puzzleArray[el.index] = el.validValues[0]; // update puzzle array
        }

        // clear valid values array if not last run
         if (n < limit) el.validValues = []; 
      })
      n += 1;
    }

    if (changeArray.length === 0) { // if no changes left to be made
      return puzzleArray.join(""); // return solved puzzle array joined back to a string  
    } else {
      return "fail" // return fail if puzzle can't be solved (this will also pick up harder puzzles)
    }
/* recursive attempt, not working (skips )
    console.log("recursive puzzle is",puzzleArray)

    const recurse = (changeArray2, puzzleArray2) => {

      console.log("recurse accpeting input", puzzleArray2,changeArray2)

      if (changeArray2.length === 0) {
        return puzzleArray2
      }

      let newChangeArray = [...changeArray2]
      let newPuzzleArray = [...puzzleArray2]
      
      newChangeArray.forEach((el, changeIndex) => {
        console.log("valid values for " + el.coord, el.validValues)
        el.validValues.forEach(val => {
          let check = this.checkValuePlacement(newPuzzleArray.join(""), el.coord, val)
          if (!check.existsInRow && !check.existsInColumn && !check.existsInRegion) {
            newPuzzleArray[el.index] = val
            newChangeArray.splice(changeIndex, 1)
            recurse(newChangeArray, newPuzzleArray)
          }
        })
        console.log("broke out of valid values array for each")
        return false
      })
      return false

    }

    const result = recurse(changeArray, puzzleArray)

    console.log(result)
*/
  }
}

module.exports = SudokuSolver;

