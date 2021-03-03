const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  suite("Solve", () => {
    test("Solve a puzzle with valid puzzle string: POST request to /api/solve", done => {
      let input = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      let solution = "769235418851496372432178956174569283395842761628713549283657194516924837947381625";
      chai.request(server)
        .post("/api/solve")
        .send({ puzzle: input })
        .end((err, res) => {
          assert.equal(res.status, 200, "Should respond");
          assert.equal(res.body.solution, solution, "valid puzzle should solve");
          done();
        });
    });

    test("Solve a puzzle with missing puzzle string: POST request to /api/solve", done => {
      let input = "";
      chai.request(server)
        .post("/api/solve")
        .send({ puzzle: input })
        .end((err, res) => {
          assert.equal(res.status, 200, "Should respond");
          assert.equal(res.body.error, "Required field missing", "No puzzle should return error");
          done();
        });
    });

    test("Solve a puzzle with invalid characters: POST request to /api/solve", done => {
      let input = "s.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      chai.request(server)
        .post("/api/solve")
        .send({ puzzle: input })
        .end((err, res) => {
          assert.equal(res.status, 200, "Should respond");
          assert.equal(res.body.error, "Invalid characters in puzzle", "Invalid chars should return error");
          done();
        });
    });

    test("Solve a puzzle with incorrect length: POST request to /api/solve", done => {
      let input = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..1";
      chai.request(server)
        .post("/api/solve")
        .send({ puzzle: input })
        .end((err, res) => {
          assert.equal(res.status, 200, "Should respond");
          assert.equal(res.body.error, "Expected puzzle to be 81 characters long", "Wrong length puzzle should return error");
          done();
        });
    });

    test("Solve a puzzle that cannot be solved: POST request to /api/solve", done => {
      let input = "6.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      chai.request(server)
        .post("/api/solve")
        .send({ puzzle: input })
        .end((err, res) => {
          assert.equal(res.status, 200, "Should respond");
          assert.equal(res.body.error, "Puzzle cannot be solved", "Invalid puzzle should return error");
          done();
        });
    });
  });

  suite("Check", () => {

    test("Check a puzzle placement with all fields: POST request to /api/check", done => {
      let puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      let coordinate = "A1";
      let value = "7";
      chai.request(server)
        .post("/api/check")
        .send({ puzzle, coordinate, value })
        .end((err, res) => {
          assert.equal(res.status, 200, "Should respond");
          assert.hasAnyKeys(res.body, ["valid", "error"], "Check should return valid or error")
          done();
        })
    });

    test("Check a puzzle placement with single placement conflict: POST request to /api/check", done => {
      let puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      let coordinate = "A1";
      let value = "3";
      chai.request(server)
        .post("/api/check")
        .send({ puzzle, coordinate, value })
        .end((err, res) => {
          assert.equal(res.status, 200, "Should respond");
          assert.equal(res.body.conflict.length, 1, "Check should return conflict array with one entry for a single position error")
          done();
        })
    });

    test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", done => {
      let puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      let coordinate = "A1";
      let value = "4";
      chai.request(server)
        .post("/api/check")
        .send({ puzzle, coordinate, value })
        .end((err, res) => {
          assert.equal(res.status, 200, "Should respond");
          assert.isAbove(res.body.conflict.length, 1, "Check should return conflict array with more than one entry with multiple position errors");
          done();
        })
    });

    test("Check a puzzle placement with all placement conflicts: POST request to /api/check", done => {
      let puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      let coordinate = "B3";
      let value = "2";
      chai.request(server)
        .post("/api/check")
        .send({ puzzle, coordinate, value })
        .end((err, res) => {
          assert.equal(res.status, 200, "Should respond");
          assert.equal(res.body.conflict.length, 3, "Check should return conflict array three entries for checks with row region and column error");
          done();
        })
    });

    test("Check a puzzle placement with missing required fields: POST request to /api/check", done => {
      let puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      let coordinate = "B3";
      let value = "";
      chai.request(server)
        .post("/api/check")
        .send({ puzzle, coordinate, value })
        .end((err, res) => {
          assert.equal(res.status, 200, "Should respond");
          assert.equal(res.body.error, "Required field(s) missing", "Missing a field should throw error");
          done();
        })
    });

    test("Check a puzzle placement with invalid characters: POST request to /api/check", done => {
      let puzzle = "s.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      let coordinate = "B3";
      let value = "7";
      chai.request(server)
        .post("/api/check")
        .send({ puzzle, coordinate, value })
        .end((err, res) => {
          assert.equal(res.status, 200, "Should respond");
          assert.equal(res.body.error, "Invalid characters in puzzle", "Invalid chars in puzzle");
          done();
        })
    });

    test("Check a puzzle placement with incorrect length: POST request to /api/check", done => {
      let puzzle = "1..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      let coordinate = "B3";
      let value = "7";
      chai.request(server)
        .post("/api/check")
        .send({ puzzle, coordinate, value })
        .end((err, res) => {
          assert.equal(res.status, 200, "Should respond");
          assert.equal(res.body.error, "Expected puzzle to be 81 characters long", "Invalid length puzzle");
          done();
        })
    });

    test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", done => {
      let puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      let coordinate = "Z3";
      let value = "7";
      chai.request(server)
        .post("/api/check")
        .send({ puzzle, coordinate, value })
        .end((err, res) => {
          assert.equal(res.status, 200, "Should respond");
          assert.equal(res.body.error, "Invalid coordinate", "Invalid coordinates should be picked up");
          done();
        })
    });

    test("Check a puzzle placement with invalid placement value: POST request to /api/check", done => {
      let puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      let coordinate = "B3";
      let value = "10";
      chai.request(server)
        .post("/api/check")
        .send({ puzzle, coordinate, value })
        .end((err, res) => {
          assert.equal(res.status, 200, "Should respond");
          assert.equal(res.body.error, "Invalid value", "Invalid value should be picked up on ");
          done();
        })
    });

  });

});

