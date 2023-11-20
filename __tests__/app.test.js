const app = require("../app.js");
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const originalEndpoints = require("../endpoints.json");

afterAll(() => {
  db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("/api/topics", () => {
  test("GET:200 sends an array of topics to the client", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics.length).toBe(3);
        response.body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });

  test("GET:404 sends an appropriate status and error message when given a non-existent path", () => {
    return request(app)
      .get("/api/schrodinger")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("path does not exist");
      });
  });
});

describe("/api", () => {
  test("GET:200 sends a json object containing information about all endpoints to the client", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const endpoints = response.body.endpoints;
        expect(endpoints).toEqual(originalEndpoints)
      });
  });
});
