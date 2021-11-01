'use strict';

const fs = require(`fs`).promises;
const Utils = require(`../../utils`);
const chalk = require(`chalk`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

const MAX_PUBLICATIONS = 1000;

const CURRENT_DATE = Date.now();
const ONE_MONTH_UNIX = 2670658033;

const Dates = {
  MIN: CURRENT_DATE - (ONE_MONTH_UNIX * 3),
  MAX: CURRENT_DATE,
};

const TITLES = [
  `Ёлки. История деревьев`,
  `Как перестать беспокоиться и начать жить`,
  `Как достигнуть успеха не вставая с кресла`,
  `Обзор новейшего смартфона`,
  `Лучшие рок-музыканты 20-века`,
  `Как начать программировать`,
  `Учим HTML и CSS`,
  `Что такое золотое сечение`,
  `Как собрать камни бесконечности`,
  `Борьба с прокрастинацией`,
  `Рок — это протест`,
  `Самый лучший музыкальный альбом этого года`,
];

const SENTENCES = [
  `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
  `Первая большая ёлка была установлена только в 1938 году.`,
  `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
  `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
  `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  `Собрать камни бесконечности легко, если вы прирожденный герой.`,
  `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
  `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  `Программировать не настолько сложно, как об этом говорят.`,
  `Простые ежедневные упражнения помогут достичь успеха.`,
  `Это один из лучших рок-музыкантов.`,
  `Он написал больше 30 хитов.`,
  `Из под его пера вышло 8 платиновых альбомов.`,
  `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
  `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
  `Достичь успеха помогут ежедневные повторения.`,
  `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  `Как начать действовать? Для начала просто соберитесь.`,
  `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
  `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
];

const CATEGORIES = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`,
];

const createRandomFullText = (sentencesArray) => {
  const text = [];
  for (let i = 0; i < sentencesArray.length; i += 1) {
    text.push(sentencesArray[Utils.getRandomInt(0, SENTENCES.length - 1)]);
  }

  return text.join(` `);
};

const generateOffers = (count) => (
  Array(count).fill({}).map(() => ({
    title: TITLES[Utils.getRandomInt(0, TITLES.length - 1)],
    announce: Utils.shuffle(SENTENCES).slice(0, Utils.getRandomInt(1, 6)).join(` `),
    fullText: createRandomFullText(SENTENCES),
    createdDate: Utils.formatDate(new Date(Utils.getRandomInt(Dates.MIN, Dates.MAX))),
    category: Utils.shuffle(CATEGORIES).slice(0, Utils.getRandomInt(1, CATEGORIES.length)),
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countPublications = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countPublications > MAX_PUBLICATIONS) {
      console.error(chalk.red(`Не больше ${MAX_PUBLICATIONS} публикаций.`));
      return;
    }

    const content = JSON.stringify(generateOffers(countPublications));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
