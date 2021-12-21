'use strict';

const fs = require(`fs`).promises;
const Utils = require(`../../utils`);
const chalk = require(`chalk`);
const {MAX_ID_LENGTH, ExitCode} = require(`../../constants`);
const {nanoid} = require(`nanoid`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

const MAX_PUBLICATIONS = 1000;
const MAX_COMMENTS = 4;

const CURRENT_DATE = Date.now();
const ONE_MONTH_UNIX = 2670658033;

const Dates = {
  MIN: CURRENT_DATE - (ONE_MONTH_UNIX * 3),
  MAX: CURRENT_DATE,
};

const FilePath = {
  SENTENCES: `./data/sentences.txt`,
  TITLES: `./data/titles.txt`,
  CATEGORIES: `./data/categories.txt`,
  COMMENTS: `./data/comments.txt`,
};

const createRandomFullText = (sentencesArray) => {
  const text = [];
  for (let i = 0; i < sentencesArray.length; i += 1) {
    text.push(sentencesArray[Utils.getRandomInt(0, sentencesArray.length - 1)]);
  }

  return text.join(` `);
};

const readContent = async (filePath) => { // eslint-disable-line consistent-return
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    process.exit(ExitCode.FAIL);
  }
};

const generatePublications = (count, [sentences, titles, categories, comments]) => (
  Array(count).fill({}).map(() => ({
    title: titles[Utils.getRandomInt(0, titles.length - 1)],
    announce: Utils.shuffle(sentences).slice(0, Utils.getRandomInt(1, 6)).join(` `),
    fullText: createRandomFullText(sentences),
    createdDate: Utils.formatDate(new Date(Utils.getRandomInt(Dates.MIN, Dates.MAX))),
    category: Utils.getRandomArrayPart(categories),
    id: nanoid(MAX_ID_LENGTH),
    comments: Utils.generateComments(MAX_COMMENTS, comments),
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const data = await Promise.all([
      readContent(FilePath.SENTENCES), readContent(FilePath.TITLES),
      readContent(FilePath.CATEGORIES), readContent(FilePath.COMMENTS),
    ]);

    const [count] = args;
    const countPublications = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countPublications > MAX_PUBLICATIONS) {
      console.error(chalk.red(`Не больше ${MAX_PUBLICATIONS} публикаций.`));
      process.exit(ExitCode.FAIL);
    }

    const content = JSON.stringify(generatePublications(countPublications, data));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
      process.exit(ExitCode.SUCCESS);
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.FAIL);
    }
  }
};
