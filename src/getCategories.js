const axios = require("axios");
const { load } = require("cheerio");

const getCategories = async (baseUrl) => {
  try {
    const response = await axios.get(baseUrl);
    const $ = load(response.data);
    const categories = [];

    $(".side_categories > ul > li > ul > li > a").each((index, element) => {
      const singleSpaceRegex = /\s\s+/g;
      const name = $(element).text().replace(singleSpaceRegex, " ");
      const link = $(element).attr("href");
      const category = { name, link };
      categories.push(category);
    });
    return categories;
  } catch (error) {
    console.log(error);
  }
};

module.exports = getCategories;
