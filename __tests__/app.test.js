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
        };
        expect(responseArticle).toMatchObject(expectedArticle);
      });
  });
  test("GET:200 article contains a comment_count key with the correct value", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body: { article: responseArticle } }) => {
        expect(responseArticle).toMatchObject({
          comment_count: 0,
        });
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

describe("/api/articles", () => {
  test("GET:200 sends an array of articles to the client", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
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
  test("GET:200 allows the client to use a query to filter the results by topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.every((article) => article.topic === "cats")).toBe(
          true
        );
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent query topic", () => {
    return request(app)
      .get("/api/articles?topic=crosseyedcyclops")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
  test("GET:200 sends an empty array to the client when passed a topic query that has no associated articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(0);
      });
  });
  test("GET:200 allows the client to sort results by any of the columns in the table", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("votes");
      });
  });
  test("GET:400 prevents the client from using invalid sort queries", () => {
    return request(app)
      .get("/api/articles?sort_by=droptablearticles")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("invalid sort query");
      });
  });
  test("GET:400 prevents the client from using invalid order queries", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=selectallfromusers")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("invalid order query");
      });
  });
  test("GET:200 accept pagination queries, defaulting to page 1 limit 10 if a pagination query is not included", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(10);
        expect(articles[0].article_id).toBe(1);
        expect(articles[9].article_id).toBe(10);
      })
      .then(() => {
        return request(app)
          .get("/api/articles?sort_by=article_id&order=asc&limit=5&p=2")
          .expect(200);
      })
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(5);
        expect(articles[0].article_id).toBe(6);
        expect(articles[4].article_id).toBe(10);
      });
  });
  test("GET:400 prevents the client from using invalid pagination queries", () => {
    return request(app)
      .get("/api/articles?limit=droptablearticles")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("invalid limit query");
      })
      .then(() => {
        return request(app)
          .get("/api/articles?p=droptablearticles")
          .expect(400);
      })
      .then(({ body: { msg } }) => {
        expect(msg).toBe("invalid page query");
      });
  });
  test("GET:200 returns an empty array when passed a number higher than the maximum number of pages", () => {
    return request(app)
      .get("/api/articles?p=9999")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(0);
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET:200 sends an array of comments to the client", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
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
  test("GET:200 accept pagination queries, defaulting to page 1 limit 10 if a pagination query is not included", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length > 10).toBe(false);
      })
      .then(() => {
        return request(app)
          .get("/api/articles/1/comments?limit=5&p=2")
          .expect(200);
      })
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(5);
      });
  });
  test("GET:400 prevents the client from using invalid pagination queries", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=droptablearticles")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("invalid limit query");
      })
      .then(() => {
        return request(app)
          .get("/api/articles/1/comments?p=droptablearticles")
          .expect(400);
      })
      .then(({ body: { msg } }) => {
        expect(msg).toBe("invalid page query");
      });
  });
  test("GET:200 returns an empty array when passed a number higher than the maximum number of pages", () => {
    return request(app)
      .get("/api/articles/1/comments?p=9999")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(0);
      });
  });
});

describe("/api/articles/:article_id", () => {
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
        return request(app).get("/api/articles/5").expect(200);
      })
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
          .expect(400);
      })
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
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

describe("/api/articles/:article_id/comments", () => {
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
        return request(app).get("/api/articles/10/comments").expect(200);
      })
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

describe("/api/comments/:comment_id", () => {
  test("DELETE:204 deletes the specified comment and sends no body back", () => {
    return request(app)
      .delete("/api/comments/7")
      .expect(204)
      .then(() => {
        return request(app).get("/api/articles/1/comments");
      })
      .then(({ body: { comments } }) => {
        expect(comments.some((comment) => comment.comment_id === 7)).toBe(
          false
        );
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

describe("/api/users", () => {
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

describe("/api/users/:username", () => {
  test("GET:200 sends a single user to the client", () => {
    return request(app)
      .get("/api/users/arizard")
      .expect(200)
      .then(({ body: { user: responseUser } }) => {
        const expectedUser = {
          username: "arizard",
          name: "ari",
          avatar_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        };
        expect(responseUser).toMatchObject(expectedUser);
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent username", () => {
    return request(app)
      .get("/api/users/rumpelstiltskin")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("PATCH:200 increments an comment's votes by the amount in the req object", () => {
    return request(app)
      .patch("/api/comments/4")
      .send({ inc_votes: 55 })
      .expect(200)
      .then(
        ({
          body: {
            comment: { votes },
          },
        }) => {
          expect(votes).toBe(-45);
        }
      )
      .then(() => {
        return request(app).get("/api/articles/1/comments").expect(200);
      })
      .then(({ body: { comments } }) => {
        expect(comments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              comment_id: 4,
              votes: -45,
            }),
          ])
        );
      });
  });
  test("PATCH:400 responds with an appropriate status and error message when provided with a bad req object ", () => {
    return request(app)
      .patch("/api/comments/5")
      .send({})
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      })
      .then(() => {
        return request(app)
          .patch("/api/comments/5")
          .send({ inc_votes: "gerrymandering" })
          .expect(400);
      })
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
  test("PATCH:404 sends an appropriate status and error message when given a valid but non-existent comment id", () => {
    return request(app)
      .patch("/api/comments/999")
      .send({ inc_votes: 11 })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
  test("PATCH:400 sends an appropriate status and error message when given an invalid comment id", () => {
    return request(app)
      .patch("/api/comments/no-comment")
      .send({ inc_votes: 11 })
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
});

describe("/api/articles", () => {
  test("POST:201 inserts a new article to the db and sends the new article back to the client", () => {
    const newArticle = {
      author: "arizard",
      title: "The Shortest Word in the English Language",
      body: "I",
      topic: "paper",
      article_img_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/IPA_Unicode_0x026A.svg/1200px-IPA_Unicode_0x026A.svg.png",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article.title).toBe("The Shortest Word in the English Language");
        expect(article.body).toBe("I");
        expect(article.author).toBe("arizard");
        expect(article.topic).toBe("paper");
        expect(article.article_img_url).toBe(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/IPA_Unicode_0x026A.svg/1200px-IPA_Unicode_0x026A.svg.png"
        );
        expect(article.article_id).toEqual(expect.any(Number));
        expect(article.votes).toBe(0);
        expect(article.created_at).toEqual(expect.any(String));
        return article.article_id;
      })
      .then((article_id) => {
        return request(app).get(`/api/articles/${article_id}`).expect(200);
      })
      .then(({ body: { article } }) => {
        expect(article.title).toBe("The Shortest Word in the English Language");
        expect(article.body).toBe("I");
        expect(article.author).toBe("arizard");
        expect(article.topic).toBe("paper");
        expect(article.article_img_url).toBe(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/IPA_Unicode_0x026A.svg/1200px-IPA_Unicode_0x026A.svg.png"
        );
        expect(article.article_id).toEqual(expect.any(Number));
        expect(article.votes).toBe(0);
        expect(article.created_at).toEqual(expect.any(String));
        expect(article.comment_count).toBe(0);
      });
  });
  test("POST:201 adds a default image url if one is not provided in the request body", () => {
    const newArticle = {
      author: "arizard",
      title: "My Design Shortcomings",
      body: "I always struggle to find a good image to go with my articles",
      topic: "paper",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("POST:400 responds with an appropriate status and error message when provided with a bad comment (missing keys)", () => {
    const badArticle = {
      auhthor: "I have a terrible habit of submitting incomplete articl",
    };

    return request(app)
      .post("/api/articles")
      .send(badArticle)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
  test("POST:404 responds with an appropriate status and error message when provided with an incorrect username)", () => {
    const incorrectUsernameArticle = {
      author: "rumpelstiltskin",
      title: "Can you find my name?",
      body: "No",
      topic: "paper",
    };

    return request(app)
      .post("/api/articles")
      .send(incorrectUsernameArticle)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
});

describe("/api/topics", () => {
  test("POST:201 inserts a new topic to the db and sends the new topic back to the client", () => {
    const newTopic = {
      slug: "existence",
      description: "I console.log, therefore I am",
    };

    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(201)
      .then(({ body: { topic } }) => {
        expect(topic.slug).toBe("existence");
        expect(topic.description).toBe("I console.log, therefore I am");
      })
      .then(() => {
        return request(app).get(`/api/topics`).expect(200);
      })
      .then(({ body: { topics } }) => {
        expect(topics).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              slug: "existence",
              description: "I console.log, therefore I am",
            }),
          ])
        );
      });
  });
  test("POST:400 responds with an appropriate status and error message when provided with a bad topic req object (missing keys)", () => {
    const badTopic = {
      description:
        "I couldn't think of a slug so I didn't include one, hope that's ok?",
    };

    return request(app)
      .post("/api/topics")
      .send(badTopic)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("DELETE:204 deletes the specified article and sends no body back", () => {
    return request(app)
      .delete("/api/articles/6")
      .expect(204)
      .then(() => {
        return request(app).get("/api/articles/6").expect(404);
      });
  });
  test("DELETE:404 responds with an appropriate status and error message when given a non-existent id", () => {
    return request(app)
      .delete("/api/articles/999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
  test("DELETE:400 responds with an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .delete("/api/articles/no-article")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
});
