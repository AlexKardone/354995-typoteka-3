'use strict';

const express = require(`express`);
const router = require(`./routes/router`);
const path = require(`path`);
const {HttpCode} = require(`../constants`);

const Dir = {
  PUBLIC: `public`,
  UPLOAD: `upload`,
};

const DEFAULT_PORT = 8080;

const app = express();

app.use(express.static(path.resolve(__dirname, Dir.PUBLIC)));
app.use(express.static(path.resolve(__dirname, Dir.UPLOAD)));

app.use((req, res) => res.status(HttpCode.BAD_REQUEST).render(`errors/404`));
app.use((err, _req, res, _next) => {
  res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`);
});

app.use(router);

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.listen(process.env.PORT || DEFAULT_PORT);
