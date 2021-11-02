'use strict';

const fs = require(`fs`).promises;
const Utils = require(`../../utils`);
const chalk = require(`chalk`);
const {ExitCode} = require(`../../constants`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

const MAX_PUBLICATIONS = 1000;

const CURRENT_DATE = Date.now();
const ONE_MONTH_UNIX = 2670658033;

const Dates = {
  MIN: CURRENT_DATE - (ONE_MONTH_UNIX * 3),
  MAX: CURRENT_DATE,
};

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;

const createRandomFullText = (sentencesArray) => {
  const text = [];
  for (let i = 0; i < sentencesArray.length; i += 1) {
    text.push(sentencesArray[Utils.getRandomInt(0, sentencesArray.length - 1)]);
  }

  return text.join(` `);
};

const readContent = async (filePath) => {
  const content = await fs.readFile(filePath, `utf8`);
  return content.trim().split(`\n`);
};

const generatePublications = (count, textData) => (
  Array(count).fill({}).map(() => ({
    title: textData.titles[Utils.getRandomInt(0, textData.titles.length - 1)],
    announce: Utils.shuffle(textData.sentences).slice(0, Utils.getRandomInt(1, 6)).join(` `),
    fullText: createRandomFullText(textData.sentences),
    createdDate: Utils.formatDate(new Date(Utils.getRandomInt(Dates.MIN, Dates.MAX))),
    category: Utils.shuffle(textData.categories).slice(0, Utils.getRandomInt(1, textData.categories.length)),
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const textData = {};

    try {
      textData.sentences = await readContent(FILE_SENTENCES_PATH);
      textData.titles = await readContent(FILE_TITLES_PATH);
      textData.categories = await readContent(FILE_CATEGORIES_PATH);
    } catch (err) {
      console.error(chalk.red(err));
      process.exit(ExitCode.FAIL);
      return;
    }

    const [count] = args;
    const countPublications = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countPublications > MAX_PUBLICATIONS) {
      console.error(chalk.red(`Не больше ${MAX_PUBLICATIONS} публикаций.`));
      process.exit(ExitCode.FAIL);
      return;
    }

    const content = JSON.stringify(generatePublications(countPublications, textData));

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
