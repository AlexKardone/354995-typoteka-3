'use strict';

const api = require(`../api`).getApi();
const {Router} = require(`express`);
const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`my`, {articles});
});
myRouter.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`my/comments`, {articles});
});

module.exports = myRouter;
