import axios from "axios";
import cheerio from "cheerio";
async function fetchHtmlFromUrl(url) {
  try {
    const response = await axios.get(url);
    console.log(response.data);
    const html = response.data;
    const $ = cheerio.load(html);
    const monthItems = $(".month-item.table-responsive");

    const data = [];
    monthItems.each((index, element) => {
      const ausinfo = $(element).find(".ausinfo").first();
      const month = ausinfo.find("small").text().trim();
      const date = ausinfo.find(".h2").text().trim();
      const lunarDate = ausinfo.find("td:nth-child(3)").text().trim();

      data.push({ month, date, lunarDate });
    });
    const monthAndYear = monthItems.find("th").first().text().trim();
    data["monthAndYear"] = monthAndYear;

    return data;
  } catch (error) {
    console.error("Lỗi khi lấy HTML:", error);
    throw error; // Ném lỗi nếu có lỗi xảy ra
  }
}

export default fetchHtmlFromUrl;
