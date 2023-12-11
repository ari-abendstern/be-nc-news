# NC News API

NC News API is a backend framework for a reddit-style news website. It contains several endpoints to allow a client to access information about the articles, comments, topics and users stored in its database.

The API is hosted at https://nc-news-8rz6.onrender.com/api

## Setup

In order to run the local development version of NC News, you'll need to make sure you're running Node.js version 8 or higher. If you're running node 14 or later, you'll need Postgres version 8.2 or higher. Then:

1. Fork and clone the repository at https://github.com/ari-abendstern/nc-news
2. Run `npm install` in the terminal to install all dependencies.

3. Create two environment variable files. These should be called `.env.development` and `.env.test`. Inside `.env.development`, set the PGDATABASE to nc-news by adding the line `PGDATABASE=nc_news`. Inside `.env.test`, set the PGDATABASE to nc-news-test with the line `PGDATABASE=nc_news_test`.
4. Create the local development database by running the command `npm run setup-dbs` and then seed it using the command `npm run seed`.

## Testing

The project has two test suites, one for the utility functions and one for the endpoints themselves. Both suites can be found in the `__tests__` directory. You can run all the tests using the command `npm t`, or run individual suites using `npm t __tests__/app.test.js` or `npm t __tests__/utils.test.js` respectively.
