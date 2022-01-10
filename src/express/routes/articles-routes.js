'use strict';

const api = require(`../api`).getApi();
const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const UPLOAD_DIR = `../upload/img/`;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const articlesRouter = new Router();

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles/articles-by-category`));

articlesRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`new-post`, {categories});
});

articlesRouter.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const articleData = {
    title: body.title,
    announce: body.announcement,
    fullText: body.fullText,
    category: Array.isArray(body.category) ? body.category : [body.category]
  };

  if (file) {
    articleData.photo = file.filename;
  }

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`back`);
  }
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([api.getArticle(id), api.getCategories()]);
  res.render(`edit-post`, {article, categories});
});

articlesRouter.post(`/edit/:id`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;
  const article = await api.getArticle(id);

  const updateArticle = {
    title: body.title,
    announce: body.announcement,
    fullText: body.fullText,
    category: Array.isArray(body.category) ? body.category : [body.category]
  };

  if (file) {
    updateArticle.picture = file.filename;
  }

  const articleData = Object.assign(article, updateArticle);

  try {
    await api.updateArticle(articleData, id);
    res.redirect(`/my`);
  } catch (error) {
    console.error(error.message);
    res.redirect(`back`);
  }
});

articlesRouter.get(`/:id`, (req, res) => res.render(`articles/post-detail`));

module.exports = articlesRouter;
