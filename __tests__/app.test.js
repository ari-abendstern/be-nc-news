const app = require("../app.js");
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");

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

describe('/api/articles/:article_id', () => {
    test("GET:200 sends a single article to the client", () => {
        return request(app)
          .get("/api/articles/2")
          .expect(200)
          .then((response) => {
            const article = response.body.article
              expect(typeof article.author).toBe("string");
              expect(typeof article.title).toBe("string");
              expect(typeof article.article_id).toBe("number");
              expect(typeof article.body).toBe("string");
              expect(typeof article.topic).toBe("string");
              expect(typeof article.created_at).toBe("string");
              expect(typeof article.votes).toBe("number");
              expect(typeof article.article_img_url).toBe("string");
            });
          });
          test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
            return request(app)
              .get('/api/articles/999')
              .expect(404)
              .then((response) => {
                expect(response.body.msg).toBe('article does not exist');
              });
          });
          test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
            return request(app)
              .get('/api/articles/not-an-article')
              .expect(400)
              .then((response) => {
                expect(response.body.msg).toBe('bad request');
              });
          });
      });