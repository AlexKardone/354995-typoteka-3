'use strict';

const api = require(`../api`).getApi();
const {Router} = require(`express`);
const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`main`, {articles});
});

mainRouter.get(`/register`, (req, res) => res.render(`main/sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`main/login`));
mainRouter.get(`/search`, async (req, res) => {
  const {search} = req.query;
  try {
    const results = await api.search(search);

    res.render(`search-1`, {results, search});
  } catch (error) {
    res.render(`search-1`, {results: [], search});
  }
});

mainRouter.get(`/categories`, (req, res) => res.render(`main/all-categories`));

module.exports = mainRouter;
