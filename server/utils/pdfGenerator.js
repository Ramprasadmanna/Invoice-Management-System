import fs from "fs/promises";
import html_to_pdf from "html-pdf-node";
import Handlebars from "handlebars";
import { ToWords } from "to-words";

const toWords = new ToWords({
  localeCode: "en-IN",
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      // can be used to override defaults for the selected locale
      name: "Rupee",
      plural: "Rupees",
      symbol: "₹",
      fractionalUnit: {
        name: "Paisa",
        plural: "Paise",
        symbol: "",
      },
    },
  },
});

Handlebars.registerHelper("increment", function (value) {
  return `${value + 1}`.padStart(2, "0");
});

Handlebars.registerHelper("format", function (dateTime) {
  const dateUTC = new Date(dateTime);

  const options = {
    timeZone: "Asia/Kolkata",
    hour12: true,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
  };

  const indianDateTime = dateUTC.toLocaleString("en-IN", options);

  return indianDateTime;
});

Handlebars.registerHelper("formatAmount", function (amount) {
  const formattedAmount = Number(amount).toLocaleString("en-IN", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formattedAmount;
});

Handlebars.registerHelper("towords", function (value) {
  return toWords.convert(+value, { currency: true });
});

Handlebars.registerHelper("formatDate", function (date) {
  const dateUTC = new Date(date);
  const options = {
    timeZone: "Asia/Kolkata",
    hour12: true,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const indianDateTime = dateUTC.toLocaleString("en-IN", options);
  return indianDateTime;
});

Handlebars.registerHelper("getGstSlab", function (items, type) {
  if (type == "cgst") {
    return items[0].gstSlab / 2;
  }
  if (type == "sgst") {
    return items[0].gstSlab / 2;
  }
  if (type == "igst") {
    return items[0].gstSlab;
  }
});

Handlebars.registerHelper("and", function (a, b) {
  return a && b;
});

Handlebars.registerHelper("check", function (data) {
  return data === "NA" ? false : true;
});

const pdfGenerator = async ({
  filePath,
  data,
  scale = 0.5,
  landscape = true,
}) => {
  const fileContent = await fs.readFile(filePath, "utf8");
  const template = Handlebars.compile(fileContent);
  const htmlContent = template({ data });

  let options = {
    format: "a4",
    landscape,
    scale,
    printBackground: true,
    displayHeaderFooter: true,
    margin: {
      top: 60,
      right: 20,
      bottom: 20,
      left: 20,
    },
    headerTemplate: `
        <div
    style="
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 8px;
      width:100%;
      padding:0 16px;
    ">
    <header class="title"></header>
    <div style="display: flex; gap: 4px">
      <p>Page Number :</p>
      <p class="pageNumber"></p>
    </div>
    <div  style="display: flex; gap: 4px">
      <p>Total Pages :</p>
      <p class="totalPages"></p>
    </div>
  </div>
    `,
  };
  let file = { content: htmlContent };
  return await html_to_pdf.generatePdf(file, options);
};

const invoicePdfGenerator = async (filePath, data) => {
  const fileContent = await fs.readFile(filePath, "utf8");
  const template = Handlebars.compile(fileContent);
  const htmlContent = template({ data });

  let options = {
    format: "a4",
    landscape: false,
    scale: 1,
    printBackground: true,
    displayHeaderFooter: false,
    margin: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    },
  };
  let file = { content: htmlContent };
  return await html_to_pdf.generatePdf(file, options);
};

export default pdfGenerator;
export { pdfGenerator, invoicePdfGenerator };
