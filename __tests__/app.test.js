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
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic.slug).toEqual(expect.any(String));
          expect(topic.description).toEqual(expect.any(String));
        });
      });
  });

  test("GET:404 sends an appropriate status and error message when given a non-existent path", () => {
    return request(app)
      .get("/api/schrodinger")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET:200 sends a single article to the client", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body: { article: responseArticle } }) => {
        const expectedArticle = {
          article_id: 2,
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          author: "icellusedkars",
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          created_at: "2020-10-16T05:03:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 0
        };
        expect(responseArticle).toEqual(expectedArticle);
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
  test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-article")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
});

describe("/api", () => {
  test("GET:200 sends a json object containing information about all endpoints to the client", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(originalEndpoints);
      });
  });
});

describe("GET /api/articles", () => {
  test("GET:200 sends an array of articles to the client", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(data.articleData.length);
        articles.forEach((article) => {
          expect(article.article_id).toEqual(expect.any(Number));
          expect(article.author).toEqual(expect.any(String));
          expect(article.title).toEqual(expect.any(String));
          expect(article.topic).toEqual(expect.any(String));
          expect(article.created_at).toEqual(expect.any(String));
          expect(article.votes).toEqual(expect.any(Number));
          expect(article.article_img_url).toEqual(expect.any(String));
          expect(article.comment_count).toEqual(expect.any(Number));
          expect(article).not.toHaveProperty("body");
        });
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("GET:200 sends an array of comments to the client", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        const expectedNumberOfComments = data.commentData.filter(
          (comment) => comment.article_id === 1
        ).length;
        expect(comments.length).toBe(expectedNumberOfComments);
        comments.forEach((comment) => {
          expect(comment.comment_id).toEqual(expect.any(Number));
          expect(comment.author).toEqual(expect.any(String));
          expect(comment.body).toEqual(expect.any(String));
          expect(comment.created_at).toEqual(expect.any(String));
          expect(comment.votes).toEqual(expect.any(Number));
          expect(comment.article_id).toEqual(expect.any(Number));
        });
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
  test("GET:200 sends an empty array to the client when passed an article_id for an article that has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(0);
      });
  });

  test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-article/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("PATCH:200 increments an article's votes by the amount in the req object", () => {
    return request(app)
      .patch("/api/articles/5")
      .send({ inc_votes: 23 })
      .expect(200)
      .then(
        ({
          body: {
            article: { votes },
          },
        }) => {
          expect(votes).toBe(23);
        }
      )
      .then(() => {
        return request(app)
          .get("/api/articles/5")
          .expect(200)
          .then(
            ({
              body: {
                article: { votes },
              },
            }) => {
              expect(votes).toBe(23);
            }
          );
      });
  });

  test("PATCH:400 responds with an appropriate status and error message when provided with a bad req object ", () => {
    return request(app)
      .patch("/api/articles/10")
      .send({})
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      })
      .then(() => {
        return request(app)
          .patch("/api/articles/10")
          .send({ inc_votes: "gerrymandering" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
          });
      });
  });
  test("PATCH:404 sends an appropriate status and error message when given a valid but non-existent article id", () => {
    return request(app)
      .patch("/api/articles/999")
      .send({ inc_votes: 11 })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
  test("PATCH:400 sends an appropriate status and error message when given an invalid article id", () => {
    return request(app)
      .patch("/api/articles/not-an-article")
      .send({ inc_votes: 11 })
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("POST:201 inserts a new comment to the db and sends the new comment back to the client", () => {
    const newComment = {
      username: "arizard",
      body: "I don't think it's fair to say Mitch is the only inspirational thought leader in Manchester - there is also John, Nick, Kirsty and Saleh",
    };
    return request(app)
      .post("/api/articles/10/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment.comment_id).toEqual(expect.any(Number));
        expect(comment.body).toBe(
          "I don't think it's fair to say Mitch is the only inspirational thought leader in Manchester - there is also John, Nick, Kirsty and Saleh"
        );
        expect(comment.article_id).toBe(10);
        expect(comment.author).toBe("arizard");
        expect(comment.votes).toBe(0);
        expect(comment.created_at).toEqual(expect.any(String));
      })
      .then(() => {
        return request(app)
          .get("/api/articles/10/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(
              comments.some(
                (comment) =>
                  comment.body ===
                  "I don't think it's fair to say Mitch is the only inspirational thought leader in Manchester - there is also John, Nick, Kirsty and Saleh"
              )
            ).toBe(true);
          });
      });
  });
  test("POST:400 responds with an appropriate status and error message when provided with a bad comment (missing keys)", () => {
    const badComment = {
      body: "I'm sure I had a name once",
    };

    return request(app)
      .post("/api/articles/10/comments")
      .send(badComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
  test("POST:404 responds with an appropriate status and error message when provided with an incorrect username)", () => {
    const incorrectUsernameComment = {
      username: "rumpelstiltskin",
      body: "I bet my name wasn't in your database",
    };

    return request(app)
      .post("/api/articles/10/comments")
      .send(incorrectUsernameComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
  test("POST:404 sends an appropriate status and error message when given a valid but non-existent article id", () => {
    const commentOnNonExistentArticle = {
      username: "rogersop",
      body: "I love commenting on articles that don't exist",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(commentOnNonExistentArticle)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
  test("POST:400 sends an appropriate status and error message when given an invalid article id", () => {
    const commentOnNonExistentArticle = {
      username: "rogersop",
      body: "I love commenting on articles that don't exist",
    };
    return request(app)
      .post("/api/articles/not-an-article/comments")
      .send(commentOnNonExistentArticle)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("DELETE:204 deletes the specified comment and sends no body back", () => {
    return request(app)
      .delete("/api/comments/7")
      .expect(204)
      .then(() => {
        return request(app)
          .get("/api/articles/1/comments")
          .then(({ body: { comments } }) => {
            expect(comments.some((comment) => comment.comment_id === 7)).toBe(
              false
            );
          });
      });
  });
  test("DELETE:404 responds with an appropriate status and error message when given a non-existent id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
  test("DELETE:400 responds with an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .delete("/api/comments/no-comment")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
});

describe("GET:200 /api/users", () => {
  test("GET:200 sends an array of users to the client", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(5);
        users.forEach((user) => {
          expect(user.username).toEqual(expect.any(String));
          expect(user.name).toEqual(expect.any(String));
          expect(user.avatar_url).toEqual(expect.any(String));
        });
      });
  });
});
