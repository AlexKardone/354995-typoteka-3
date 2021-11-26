'use strict';

const {Router} = require(`express`);
const router = new Router();

const mainRoutes = require(`./main-routes`);
const myRoutes = require(`./my-routes`);
const articlesRoutes = require(`./articles-routes`);

router.use(`/`, mainRoutes);
router.use(`/my`, myRoutes);
router.use(`/articles`, articlesRoutes);

module.exports = router;
