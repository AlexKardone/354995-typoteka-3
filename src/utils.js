'use strict';

const {nanoid} = require(`nanoid`);

const {MAX_ID_LENGTH} = require(`./constants`);

class Utils {
  static getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static shuffle(someArray) {
    for (let i = someArray.length - 1; i > 0; i--) {
      const randomPosition = Math.floor(Math.random() * i);
      [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
    }

    return someArray;
  }

  static formatDate(date) {
    const dateISO = date.toISOString().split(`T`);
    return `${dateISO[0]} ${dateISO[1].split(`.`)[0]}`;
  }

  static getRandomArrayPart(arr) {
    return arr.slice(this.getRandomInt(0, (arr.length - 1) / 2), this.getRandomInt((arr.length - 1) / 2, arr.length - 1));
  }

  static generateComments(count, comments) {
    return (
      Array(count).fill({}).map(() => ({
        id: nanoid(MAX_ID_LENGTH),
        text: this.getRandomArrayPart(this.shuffle(comments)).join(` `),
      }))
    );
  }
}

module.exports = Utils;
