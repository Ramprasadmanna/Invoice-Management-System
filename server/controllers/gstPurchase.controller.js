import { prisma } from "#config/db.config.js";
import { excelGenerator } from "#utils/excelGenerator.js";
import ExcelJs from "exceljs";
import month from "#data/month.js";

/**
 * @desc  Create New GST Purchase
 * @route  POST /api/v1/gstPurchase/
 * @access  private/admin
 */
const addGstPurchase = async (req, res) => {
  const {
    item,
    purchaseDate,
    invoiceNumber,
    taxableAmount,
    gstSlab,
    gstAmount,
    cgst,
    sgst,
    igst,
    total,
    paymentMethod,
  } = req.body;

  const gstPurchase = await prisma.gstPurchases.create({
    data: {
      userId: req.user.id,
      itemId: item,
      purchaseDate: new Date(purchaseDate),
      invoiceNumber,
      taxableAmount,
      gstSlab,
      gstAmount,
      cgst,
      sgst,
      igst,
      total,
      paymentMethod,
    },
  });

  if (gstPurchase) {
    res.json(gstPurchase);
  } else {
    res.status(400);
    throw new Error("GST Purchase Creation Failed");
  }
};

/**
 * @desc		Get All GST Purchase
 * @route		GET /api/v1/gstPurchase
 * @access	private
 */
const getGstPurchases = async (req, res) => {
  const pageSize = +req.query.pageSize || 2;
  const pageNumber = +req.query.pageNumber || 1;

  const { keyword, fromDate, toDate } = req.query;

  const filter = {
    AND: [],
  };

  if (keyword) {
    filter.AND.push({
      OR: [
        { invoiceNumber: { contains: keyword } },
        { item: { companyName: { contains: keyword } } },
        { item: { name: { contains: keyword } } },
        { item: { gstNumber: { contains: keyword } } },
      ],
    });
  }

  if (fromDate && toDate) {
    filter.AND.push({
      invoiceDate: {
        gte: new Date(fromDate),
        lte: new Date(toDate),
      },
    });
  }

  const count = await prisma.gstPurchases.count({ where: filter });

  const gstPurchaseData = await prisma.gstPurchases.findMany({
    where: filter,
    include: {
      item: true,
      user: {
        select: {
          name: true,
          isAdmin: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: pageSize,
    skip: pageSize * (pageNumber - 1),
  });

  const pages = Math.ceil(count / pageSize);

  res.status(200).json({ gstPurchaseData, pageNumber, pages });
};

/**
 * @desc  Update GST Purchase
 * @route  PUT /api/v1/gstPurchase/:id
 * @access  private/admin
 */
const updateGstPurchase = async (req, res) => {
  const { id } = req.params;

  const gstPurchase = await prisma.gstPurchases.findUnique({
    where: { id: Number(id) },
  });

  if (!gstPurchase) {
    res.status(400);
    throw new Error("Gst Purchase Not Found.");
  }

  const {
    item,
    purchaseDate,
    invoiceNumber,
    taxableAmount,
    gstSlab,
    gstAmount,
    cgst,
    sgst,
    igst,
    total,
    paymentMethod,
  } = req.body;

  const updatedGstPurchase = await prisma.gstPurchases.update({
    where: { id: Number(id) },
    data: {
      itemId: item,
      purchaseDate: new Date(purchaseDate),
      invoiceNumber,
      taxableAmount,
      gstSlab,
      gstAmount,
      cgst,
      sgst,
      igst,
      total,
      paymentMethod,
    },
  });

  res.status(200).json(updatedGstPurchase);
};

/**
 * @desc  Delete GST Purchase
 * @route  DELETE /api/v1/gstPurchase/:id
 * @access  private/admin
 */
const deleteGstPurchase = async (req, res) => {
  const { id } = req.params;

  const gstPurchase = await prisma.gstPurchases.findUnique({
    where: { id: Number(id) },
  });

  if (!gstPurchase) {
    res.status(400);
    throw new Error("Gst Purchase Item Not Found.");
  }

  await prisma.gstPurchases.delete({ where: { id: Number(id) } });
  res.status(200).json({ message: "GST Purchase Deleted Sucessfully" });
};

/**
 * @desc		Downlaod Excel File
 * @route		POST /api/v1/gstPurchase/download/excel
 * @access	private/admin
 */
const downloadGstPurchaseExcel = async (req, res) => {
  const pageSize = +req.query.pageSize || 2;
  const pageNumber = +req.query.pageNumber || 1;

  const { keyword, fromDate, toDate } = req.query;

  const filter = {
    AND: [],
  };

  if (keyword) {
    filter.AND.push({
      OR: [
        { invoiceNumber: { contains: keyword } },
        { item: { companyName: { contains: keyword } } },
        { item: { name: { contains: keyword } } },
        { item: { gstNumber: { contains: keyword } } },
      ],
    });
  }

  if (fromDate && toDate) {
    filter.AND.push({
      invoiceDate: {
        gte: new Date(fromDate),
        lte: new Date(toDate),
      },
    });
  }

  const gstPurchaseData = await prisma.gstPurchases.findMany({
    where: filter,
    include: {
      item: true,
      user: {
        select: {
          name: true,
          isAdmin: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: pageSize,
    skip: pageSize * (pageNumber - 1),
  });

  const header = [
    { header: "PURCHASE DATE", key: "purchaseDate", width: 15 },
    { header: "ITEM NAME", key: "name", width: 15 },
    { header: "ITEM TYPE", key: "type", width: 15 },
    { header: "COMPANY NAME", key: "companyName", width: 15 },
    { header: "STATE", key: "state", width: 10 },
    { header: "GSTIN", key: "gstNumber", width: 10 },
    { header: "GST RATE", key: "gstSlab", width: 10 },
    { header: "TAXABLE AMOUNT", key: "taxableAmount", width: 10 },
    { header: "CGST", key: "cgst", width: 10 },
    { header: "SGST", key: "sgst", width: 10 },
    { header: "IGST", key: "igst", width: 10 },
    { header: "TOTAL", key: "total", width: 10 },
    { header: "PAYMENT METHOD", key: "paymentMethod", width: 10 },
  ];

  const refactoredGstPurchaseData = gstPurchaseData.map((elem) => {
    return {
      ...elem,
      name: elem?.item?.name,
      type: elem?.item?.type,
      companyName: elem?.item?.companyName,
      state: elem?.item?.state,
      gstNumber: elem?.item?.gstNumber,
    };
  });

  const excel = await excelGenerator({
    workSheetName: "GST Purchase",
    header,
    data: refactoredGstPurchaseData,
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "inline; filename=data.xlsx");
  res.send(excel);
};

/**
 * @desc		Get All GST Purchase Summary Company Wise
 * @route		GET /api/v1/gstPurchase/summary/company
 * @access	private
 */
const gstPurchaseCompanySummary = async (req, res) => {
  const keyword = req.query.companyId?.trim();
  const financialYear = Number(req.query.year);

  if (!financialYear) {
    res.status(400);
    throw new Error("Invalid Financial Year");
  }

  const startDate = `${financialYear}-04-01`;
  const endDate = `${financialYear + 1}-03-31`;
  const filter = keyword ? `${keyword}\%` : "";

  const pivotData = await prisma.$queryRaw`
  WITH MonthlyPurchases AS (
    SELECT
        gp.itemId AS item_id,  
        YEAR(gp.purchaseDate) AS year,
        MONTH(gp.purchaseDate) AS month,
        COUNT(*) AS total_purchase,
        SUM(gp.total) AS total_amount
    FROM invoice.gstPurchases gp
    WHERE
        gp.purchaseDate BETWEEN ${startDate} AND ${endDate}
    GROUP BY gp.itemId, YEAR(gp.purchaseDate), MONTH(gp.purchaseDate)
)

SELECT 
    gpi.id AS _id,  
    gpi.type AS type,
    gpi.name AS name,
    gpi.companyName AS companyName,
    gpi.state AS state,
    gpi.gstNumber AS gstNumber,
    COUNT(gp.id) AS total_purchase,
    COALESCE(SUM(gp.total), 0) AS total_amount,
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'year', mp.year,
                'month', mp.month,
                'total_purchase', mp.total_purchase,
                'total_amount', mp.total_amount,
                'data',
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            '_id', gp2.id,
                            'item', gp2.itemId,
                            'purchaseDate', gp2.purchaseDate,
                            'invoiceNumber', gp2.invoiceNumber,
                            'taxableAmount', gp2.taxableAmount,
                            'gstSlab', gp2.gstSlab,
                            'gstAmount', gp2.gstAmount,
                            'cgst', gp2.cgst,
                            'sgst', gp2.sgst,
                            'igst', gp2.igst,
                            'total', gp2.total,
                            'paymentMethod', gp2.paymentMethod,
                            'createdAt', gp2.createdAt,
                            'updatedAt', gp2.updatedAt
                        )
                    )
                    FROM invoice.gstPurchases gp2
                    WHERE gp2.itemId = gpi.id
                      AND YEAR(gp2.purchaseDate) = mp.year
                      AND MONTH(gp2.purchaseDate) = mp.month
                )
            )
        )
        FROM MonthlyPurchases mp
        WHERE mp.item_id = gpi.id
    ) AS monthly_data
FROM invoice.gstPurchases gp
INNER JOIN invoice.gstPurchaseItems gpi ON gp.itemId = gpi.id
WHERE
    gp.purchaseDate BETWEEN ${startDate} AND ${endDate}
    AND (
        ${filter} = ''
        OR gpi.id LIKE ${filter}
    )
GROUP BY gpi.id;
  `;

  const gstPurchaseProductSummary = JSON.parse(
    JSON.stringify(pivotData, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

  res.status(200).json(gstPurchaseProductSummary);
};

/**
 * @desc		Download All  GST Purchase Summary Company Wise
 * @route		POST /api/v1/gstPurchase/download/summary/company
 * @access	private/admin
 */
const downloadGstPurchaseCompanySummaryExcel = async (req, res) => {
  const keyword = req.query.companyId?.trim();
  const financialYear = Number(req.query.year);

  if (!financialYear) {
    res.status(400);
    throw new Error("Invalid Financial Year");
  }

  const startDate = `${financialYear}-04-01`;
  const endDate = `${financialYear + 1}-03-31`;
  const filter = keyword ? `${keyword}\%` : "";

  const pivotData = await prisma.$queryRaw`
  WITH MonthlyPurchases AS (
    SELECT
        gp.itemId AS item_id,  
        YEAR(gp.purchaseDate) AS year,
        MONTH(gp.purchaseDate) AS month,
        COUNT(*) AS total_purchase,
        SUM(gp.total) AS total_amount
    FROM invoice.gstPurchases gp
    WHERE
        gp.purchaseDate BETWEEN ${startDate} AND ${endDate}
    GROUP BY gp.itemId, YEAR(gp.purchaseDate), MONTH(gp.purchaseDate)
)

SELECT 
    gpi.id AS _id,  
    gpi.type AS type,
    gpi.name AS name,
    gpi.companyName AS companyName,
    gpi.state AS state,
    gpi.gstNumber AS gstNumber,
    COUNT(gp.id) AS total_purchase,
    COALESCE(SUM(gp.total), 0) AS total_amount,
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'year', mp.year,
                'month', mp.month,
                'total_purchase', mp.total_purchase,
                'total_amount', mp.total_amount,
                'data',
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            '_id', gp2.id,
                            'item', gp2.itemId,
                            'purchaseDate', gp2.purchaseDate,
                            'invoiceNumber', gp2.invoiceNumber,
                            'taxableAmount', gp2.taxableAmount,
                            'gstSlab', gp2.gstSlab,
                            'gstAmount', gp2.gstAmount,
                            'cgst', gp2.cgst,
                            'sgst', gp2.sgst,
                            'igst', gp2.igst,
                            'total', gp2.total,
                            'paymentMethod', gp2.paymentMethod,
                            'createdAt', gp2.createdAt,
                            'updatedAt', gp2.updatedAt
                        )
                    )
                    FROM invoice.gstPurchases gp2
                    WHERE gp2.itemId = gpi.id
                      AND YEAR(gp2.purchaseDate) = mp.year
                      AND MONTH(gp2.purchaseDate) = mp.month
                )
            )
        )
        FROM MonthlyPurchases mp
        WHERE mp.item_id = gpi.id
    ) AS monthly_data
FROM invoice.gstPurchases gp
INNER JOIN invoice.gstPurchaseItems gpi ON gp.itemId = gpi.id
WHERE
    gp.purchaseDate BETWEEN ${startDate} AND ${endDate}
    AND (
        ${filter} = ''
        OR gpi.id LIKE ${filter}
    )
GROUP BY gpi.id;
  `;

  const gstPurchaseProductSummary = JSON.parse(
    JSON.stringify(pivotData, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

  const workbook = new ExcelJs.Workbook();
  const worksheet = workbook.addWorksheet("Gst Purchase Company Summary");
  gstPurchaseProductSummary.forEach((elem) => {
    worksheet.addRow();
    worksheet.addRow([
      elem?.companyName,
      "",
      "Total Purchase",
      elem?.total_purchase,
      "",
      "Total Amount",
      elem?.total_amount,
    ]);

    elem.monthly_data.forEach((i) => {
      worksheet.addRow();
      worksheet.addRow([
        "",
        `${month[i.month]} ${i.year}`,
        "Total Purchase",
        i.total_purchase,
        "",
        "Total Amount",
        i.total_amount,
      ]);
      worksheet.addRow();
      worksheet.addRow([
        "",
        "",
        "PURCHASE DATE",
        "ITEM NAME",
        "INVOICE NUMBER",
        "COMPANY NAME",
        "STATE",
        "GSTIN",
        "ITEM TYPE",
        "GST %",
        "TAXABLE AMOUNT",
        "CGST",
        "SGST",
        "IGST",
        "GST AMOUNT",
        "TOTAL",
        "PAYMENT METHOD",
      ]);
      i.data.forEach((x) => {
        worksheet.addRow([
          "",
          "",
          x.purchaseDate,
          elem.name,
          x.invoiceNumber,
          elem.companyName,
          elem.state,
          elem.gstNumber,
          elem.type,
          x.gstSlab,
          x.taxableAmount,
          x.cgst,
          x.sgst,
          x.igst,
          x.gstAmount,
          x.total,
          x.paymentMethod,
        ]);
      });
    });
  });

  const excel = await workbook.xlsx.writeBuffer();
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "inline; filename=data.xlsx");
  res.send(excel);
};

export {
  addGstPurchase,
  getGstPurchases,
  updateGstPurchase,
  deleteGstPurchase,
  downloadGstPurchaseExcel,
  gstPurchaseCompanySummary,
  downloadGstPurchaseCompanySummaryExcel,
};
