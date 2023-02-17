const fs = require("fs");
const j2cp = require("json2csv").Parser;
const getCategories = require("./getCategories");
const getBooks = require("./getBooks");

const baseUrl = "https://books.toscrape.com/";

const scrape = async () => {
  try {
    const categories = await getCategories(baseUrl);
    const booksPromise = categories.map(async (category) => {
      const { name, link } = category;
      const absoluteLink = `${baseUrl}${link}`;
      const books = await getBooks(absoluteLink);
      books.forEach((book) => {
        book.category = name;
      });
      return books;
    });
    const books = await Promise.all(booksPromise);
    const sortedBooks = books
      .flat()
      .sort((a, b) => a.title.localeCompare(b.title));
    const parser = new j2cp();
    const csv = parser.parse(sortedBooks);
    fs.writeFileSync("books.csv", csv);
  } catch (error) {
    console.log(error);
  }
};

scrape();
