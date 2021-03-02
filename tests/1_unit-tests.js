const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('UnitTests', () => {

    test("Logic handles a valid puzzle string of 81 characters", done => {
        let input = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..2..";
        assert.equal(solver.validate(input), "valid", "Puzzle should be valid");
        done();
    });

    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", done => {
        let input = "..s..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..2..";
        assert.equal(solver.validate(input), "invalid char", "Puzzle should be valid");
        done();
    });

    test("Logic handles a puzzle string that is not 81 characters in length", done => {
        let input = "..19..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..2..";
        assert.equal(solver.validate(input), "not 81", "Puzzle should be valid");
        done();
    });

    test("Logic handles a valid row placement", done => {
        let input = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..2..";
        let value = 7
        assert.isFalse(solver.checkRowPlacement(input, 0,value), "Row placement should be valid");
        done();
    });

    test("Logic handles an invalid row placement", done => {
        let input = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..2..";
        let value = 6
        assert.isFalse(solver.checkRowPlacement(input, 0, value), "Row placement should handle incorrect values");
        done();
    });

    test("Logic handles a valid column placement", done => {
        let input = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..2..";
        let value = 7
        assert.isFalse(solver.checkRowPlacement(input, 0, value), "Column placement should be valid");
        done();
    });

    test("Logic handles an invalid column placement", done => {
        let input = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..2..";
        let value = 6
        assert.isFalse(solver.checkRowPlacement(input, 0, value), "Column placement should handle incorrect values");
        done();
    });

    test("Logic handles a valid region (3x3 grid) placement", done => {
        let input = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..2..";
        let value = 7
        assert.isFalse(solver.checkRowPlacement(input, 0, value), "Region placement should be valid");
        done();
    });

    test("Logic handles an invalid region (3x3 grid) placement", done => {
        let input = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..2..";
        let value = 6
        assert.isFalse(solver.checkRowPlacement(input, 0, value), "Region placement should handle incorrect values");
        done();
    });

    test("Valid puzzle strings pass the solver", done => {
        let input = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        let solution = "769235418851496372432178956174569283395842761628713549283657194516924837947381625"
        assert.equal(solver.solve(input), solution, "Should solve puzzle");
        done();
    })

    test("Invalid puzzle strings fail the solver", done => {
        let input = "1.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..2..";
        let solution = "fail"
        assert.equal(solver.solve(input), solution, "Should fail invalid puzzle");
        done();
    })

    test("Solver returns the the expected solution for an incomplete puzzzle", done => {
        let input = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        let solution = "769235418851496372432178956174569283395842761628713549283657194516924837947381625"
        assert.equal(solver.solve(input), solution, "Should solve puzzle");
        done();
    })
});
