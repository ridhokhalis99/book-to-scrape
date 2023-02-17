const axios = require("axios");
const { load } = require("cheerio");

const getBooks = async (link) => {
  try {
    const response = await axios.get(link);
    const $ = load(response.data);
    const isThereNextPage = $(".next > a").attr("href");
    do {
      const books = [];
      const singleSpaceRegex = /\s\s+/g;
      $(".product_pod").each((index, element) => {
        const title = $(element).find("h3 > a").attr("title");
        const price = $(element).find(".price_color").text();
        const stock = $(element)
          .find(".instock")
          .text()
          .replace(singleSpaceRegex, " ");
        const book = { title, price, stock };
        books.push(book);
      });
      return books;
    } while (isThereNextPage);
  } catch (error) {
    console.log(error);
  }
};

module.exports = getBooks;
