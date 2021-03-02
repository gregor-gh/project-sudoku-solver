'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {

      // get puzzle, coordinate and value from request body
      const puzzle = req.body.puzzle;
      const coordinate = req.body.coordinate;
      const value = req.body.value;

      // if any fields are missing then return error
      if (!puzzle||!coordinate||!value) {
        return res.json({ error: "Required field(s) missing" });
      }

      // validate the puzzle
      const valid = solver.validate(puzzle);

      // then check returned value and respond with errors if appropriate
      if (valid === "not 81") {
        return res.json({ error: "Expected puzzle to be 81 characters long" });
      } else if (valid === "invalid char") {
        return res.json({ error: "Invalid characters in puzzle" });
      }
      
      // set regex for next check
      const letterRegex = /[A-I]/i
      const numberRegex = /[0-9]/

      // check if coord is 2 chars, first is letter and second is number, return error if not
      if (coordinate.length !== 2||!coordinate[0].match(letterRegex) || !coordinate[1].match(numberRegex)) {
        return res.json({ error: "Invalid coordinate" });
      }

      // check if the value is one char and is number, reuse number regex from coord check
      if (value.length !== 1 || !value.match(numberRegex)) {
        return res.json({ error: "Invalid value" });
      }

      // check row placement first
      const check = solver.checkValuePlacement(puzzle, coordinate, value);

      // if all three exists props are false then placement is valid
      if (!check.existsInRow && !check.existsInColumn && !check.existsInRegion) {
        return res.json({ valid: true });
      }

      // otherwise build conflict array
      let conflict = [];
      check.existsInRow && conflict.push("row");
      check.existsInColumn && conflict.push("column");
      check.existsInRegion && conflict.push("region");
      
      // and return valid false plus conflict array
      return res.json({ valid: false, conflict });

    });
    
  app.route('/api/solve')
    .post((req, res) => {

      // get submitted puzzle from request body
      const puzzle = req.body.puzzle;

      // if no puzzle is provided then return error
      if (!puzzle) {
        return res.json({ error: "Required field missing" });
      }

      // validate the puzzle
      const valid = solver.validate(puzzle);

      // then check returned value and respond with errors if appropriate
      if (valid === "not 81") {
        return res.json({ error: "Expected puzzle to be 81 characters long" });
      } else if (valid === "invalid char") {
        return res.json({ error: "Invalid characters in puzzle" });
      }

    });
};
