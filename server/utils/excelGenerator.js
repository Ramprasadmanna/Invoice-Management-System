import ExcelJs from "exceljs";

const excelGenerator = async ({ workSheetName, header, data }) => {
  const workbook = new ExcelJs.Workbook();
  const worksheet = workbook.addWorksheet(workSheetName);
  worksheet.columns = header;
  worksheet.addRow();
  data.forEach((elem) => {
    worksheet.addRow(elem);

    if (elem.items) {
      elem.items.forEach((i) => {
        worksheet.addRow(i);
      });
    }
  });

  worksheet.addRow();
  worksheet.addRow(["Total Count", data?.length]);
  worksheet.addRow(["From", data[data.length - 1]?.createdAt || "---"]);
  worksheet.addRow(["To", data[0]?.createdAt] || "---");

  return await workbook.xlsx.writeBuffer();
};

const salesExcelGenerator = async ({ workSheetName, header, data }) => {
  const workbook = new ExcelJs.Workbook();
  const worksheet = workbook.addWorksheet(workSheetName);
  worksheet.columns = header;
  worksheet.addRow();
  data.forEach((elem) => {
    worksheet.addRow(elem);

    if (elem.items) {
      elem.items.forEach((i) => {
        worksheet.addRow(i);
      });
    }

    worksheet.addRow();
  });

  worksheet.addRow();
  worksheet.addRow(["Total Count", data.length]);
  worksheet.addRow(["From", data[data.length - 1].createdAt]);
  worksheet.addRow(["To", data[0].createdAt]);

  return await workbook.xlsx.writeBuffer();
};

export { excelGenerator, salesExcelGenerator };
