const Axios = require("axios");
const Cheerio = require("cheerio");

async function WScrape() {
  try {
    const { data } = await Axios.get(
      "https://www.moneycontrol.com/markets/corporate-action/dividends_declared/"
    );
    const $ = Cheerio.load(data);

    const dividends = [];

    $(".lhsGrayCard_web_lhsGrayCard__RSkQw").each((i, el) => {
      const companyName = $(el)
        .find(".lhsGrayCard_web_title__B2NJA")
        .text()
        .trim();

      const dividend = $(el)
        .find(".lhsGrayCard_web_rhs__xLmyc")
        .first()
        .find("span")
        .eq(1)
        .text()
        .trim();

      const announcementDate = $(el)
        .find(
          ".lhsGrayCard_web_fourthRow__cfWu4 .lhsGrayCard_web_lhs__Bh6QQ span"
        )
        .eq(1)
        .text()
        .trim();

      const exDate = $(el)
        .find(
          ".lhsGrayCard_web_fourthRow__cfWu4 .lhsGrayCard_web_rhs__xLmyc span"
        )
        .eq(1)
        .text()
        .trim();

      dividends.push({
        companyName,
        announcementDate,
        exDate,
        dividend,
      });
    });

    return dividends;
  } catch (err) {
    console.error("Scraping failed:", err.message);
  }
}

getDividend = async (req, res) => {
  const resultArray = await WScrape();
  return res.status(200).json({ success: true, data: resultArray });
};

module.exports = { getDividend };
