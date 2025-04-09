import path from "path";
import pdfGenerator, { invoicePdfGenerator } from "#utils/pdfGenerator.js";
import { salesExcelGenerator } from "#utils/excelGenerator.js";
import { sendSaleMail } from "#utils/mailSender.js";
import ExcelJs from "exceljs";
import month from "#data/month.js";
import { prisma } from "#config/db.config.js";

/**
 * @desc		Add GST Sales
 * @route		POST /api/v1/gstSale/
 * @access	private/admin
 */
const addGstSale = async (req, res) => {
  const {
    invoiceType,
    customer,
    orderNumber,
    invoiceDate,
    dueDate,
    items,
    taxableAmount,
    gstAmount,
    cgst,
    sgst,
    igst,
    shippingCharges,
    discount,
    otherAdjustments,
    total,
    advanceAmount,
    balanceDue,
    accountType,
    customerNote,
    termsAndCondition,
    sendMail,
  } = req.body;

  let { invoiceNumber } = req.body;

  const existingInvoiceNumber = await prisma.gstSales.findUnique({
    where: { invoiceNumber },
  });

  if (existingInvoiceNumber) {
    res.status(400);
    throw new Error("Duplicate Invoice Number");
  }

  if (items && items.length === 0) {
    res.status(404);
    throw new Error("No Order Items");
  }

  if (!invoiceNumber) {
    const lastSale = await prisma.gstSales.findFirst({
      orderBy: { invoiceNumber: "desc" },
      select: {
        invoiceNumber: true,
      },
    });

    const lastInvoiceNumber = lastSale ? lastSale.invoiceNumber : null;

    invoiceNumber = lastInvoiceNumber
      ? `A${Number(lastInvoiceNumber.substr(1)) + 1}`
      : "A1643";
  }

  const createdGstSale = await prisma.gstSales.create({
    data: {
      userId: req.user.id,
      invoiceType,
      customerId: customer,
      invoiceNumber,
      orderNumber,
      invoiceDate: new Date(invoiceDate),
      dueDate: new Date(dueDate),
      taxableAmount,
      gstAmount,
      cgst,
      sgst,
      igst,
      shippingCharges,
      discount,
      otherAdjustments,
      total,
      advanceAmount,
      balanceDue,
      accountType,
      customerNote,
      termsAndCondition,
      items: {
        create: items.map((item) => {
          return {
            itemId: item.id,
            type: item.type,
            name: item.name,
            validity: item.validity,
            startDate: item.startDate ? new Date(item.startDate) : null,
            endDate: item.endDate ? new Date(item.endDate) : null,
            hsnsacCode: item.hsnsacCode,
            gstSlab: item.gstSlab,
            rate: item.rate,
            cgst: item.cgst,
            sgst: item.sgst,
            igst: item.igst,
            gstAmount: item.gstAmount,
            total: item.total,
            description: item.description,
            quantity: item.quantity,
            taxableAmount: item.taxableAmount,
          };
        }),
      },
    },
    include: {
      customer: true,
      items: true,
    },
  });

  if (createdGstSale && sendMail) {
    await sendSaleMail({ saleData: createdGstSale, type: "gstSaleMail" });
  }

  res.status(200).json(createdGstSale);
};

/**
 * @desc		Update GST Sales
 * @route		PUT /api/v1/gstSale/:id
 * @access	private/admin
 */
const updateGstSale = async (req, res) => {
  const gstSale = await prisma.gstSales.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!gstSale) {
    res.status(404);
    throw new Error("Invoice Not Found");
  }

  const {
    invoiceType,
    customer,
    invoiceDate,
    dueDate,
    items,
    taxableAmount,
    gstAmount,
    cgst,
    sgst,
    igst,
    shippingCharges,
    discount,
    otherAdjustments,
    total,
    advanceAmount,
    balanceDue,
    accountType,
    customerNote,
    termsAndCondition,
    sendMail,
  } = req.body;

  if (items && items.length === 0) {
    res.status(404);
    throw new Error("No Order Items");
  }

  const updatedGstSale = await prisma.gstSales.update({
    where: { id: Number(req.params.id) },
    data: {
      invoiceType,
      customerId: customer,
      invoiceDate: new Date(invoiceDate),
      dueDate: new Date(dueDate),
      taxableAmount,
      gstAmount,
      cgst,
      sgst,
      igst,
      shippingCharges,
      discount,
      otherAdjustments,
      total,
      advanceAmount,
      balanceDue,
      accountType,
      customerNote,
      termsAndCondition,
      items: {
        deleteMany: {},
        create: items.map((item) => {
          return {
            itemId: item.id,
            type: item.type,
            name: item.name,
            validity: item.validity,
            startDate: item.startDate ? new Date(item.startDate) : null,
            endDate: item.endDate ? new Date(item.endDate) : null,
            hsnsacCode: item.hsnsacCode,
            gstSlab: item.gstSlab,
            rate: item.rate,
            cgst: item.cgst,
            sgst: item.sgst,
            igst: item.igst,
            gstAmount: item.gstAmount,
            total: item.total,
            description: item.description,
            quantity: item.quantity,
            taxableAmount: item.taxableAmount,
          };
        }),
      },
    },
    include: {
      customer: true,
      items: true,
    },
  });

  if (updatedGstSale && sendMail) {
    await sendSaleMail({ saleData: updatedGstSale, type: "gstSaleMail" });
  }

  res.status(200).json(updatedGstSale);
};

/**
 * @desc		GET All GST Sales
 * @route		GET /api/v1/gstSale/
 * @access	private
 */
const getGstSales = async (req, res) => {
  const pageSize = +req.query.pageSize || 2;
  const pageNumber = +req.query.pageNumber || 1;

  const { keyword, invoiceType, accountType, fromDate, toDate, balanceDue } =
    req.query;

  const filter = {
    AND: [],
  };

  if (keyword) {
    filter.AND.push({
      OR: [
        { customer: { firstName: { contains: keyword } } },
        { customer: { lastName: { contains: keyword } } },
        { customer: { businessLegalName: { contains: keyword } } },
        { customer: { gstNumber: { contains: keyword } } },
        { customer: { placeOfSupply: { contains: keyword } } },
        { invoiceNumber: { contains: keyword } },
        { orderNumber: { contains: keyword } },
        {
          items: {
            some: {
              OR: [
                { name: { contains: keyword } },
                { description: { contains: keyword } },
                { hsnsacCode: { contains: keyword } },
              ],
            },
          },
        },
      ],
    });
  }

  if (invoiceType) {
    filter.AND.push({ invoiceType });
  }

  if (accountType) {
    filter.AND.push({ accountType });
  }

  if (fromDate && toDate) {
    filter.AND.push({
      invoiceDate: {
        gte: new Date(fromDate),
        lte: new Date(toDate),
      },
    });
  }

  if (balanceDue) {
    filter.AND.push({
      balanceDue: balanceDue === "true" ? { gt: 0 } : 0,
    });
  }

  const count = await prisma.gstSales.count({ where: filter });

  const gstSalesData = await prisma.gstSales.findMany({
    where: filter,
    include: {
      customer: true,
      items: true,
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
  res.status(200).json({ gstSalesData, pageNumber, pages });
};

/**
 * @desc		Delete GST Sale
 * @route		DELETE  /api/v1/gstSale/:id
 * @access	private/admin
 */
const deleteGstSale = async (req, res) => {
  const { id } = req.params;

  const gstSale = await prisma.gstSales.findUnique({
    where: { id: Number(id) },
  });

  if (!gstSale) {
    res.status(404);
    throw new Error("Gst Sale Not Found");
  }

  await prisma.gstSales.delete({ where: { id: Number(id) } });
  res.status(200).json({ message: "Gst Sale Deleted Sucessfully" });
};

/**
 * @desc		Preview Gst Sale Invoice PDF
 * @route		GET /api/v1/gstSale/invoice/preview/:id
 * @access	private/admin
 */
const previewGstSaleInvoicePdf = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(404);
    throw new Error("Invalid Invoice Id");
  }

  try {
    const filePath = path.resolve("server/data/PdfTemplate/gstSaleInvoice.ejs");

    const invoiceData = await prisma.gstSales.findUnique({
      where: { id: Number(id) },
      include: {
        customer: true,
        items: true,
      },
    });

    const pdfBuffer = await invoicePdfGenerator(filePath, invoiceData);

    res.status(200);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=invoice.pdf",
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error({ message: "Preview Failed", error: error.message });
  }
};

/**
 * @desc		Downlaod Gst Sale Invoice PDF File
 * @route		GET /api/v1/gstSale/invoice/download/:id
 * @access	private/admin
 */
const downloadGstSaleInvoicePdf = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(404);
    throw new Error("Invalid Invoice Id");
  }

  try {
    const filePath = path.resolve("server/data/PdfTemplate/gstSaleInvoice.ejs");

    const invoiceData = await prisma.gstSales.findUnique({
      where: { id: Number(id) },
      include: {
        customer: true,
        items: true,
      },
    });

    const pdfBuffer = await invoicePdfGenerator(filePath, invoiceData);

    res.status(200);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${invoiceData.invoiceNumber}.pdf`,
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error({ message: "Download Failed", error: error.message });
  }
};

/**
 * @desc		Send Mail Gst Sale Invoice PDF File
 * @route		GET /api/v1/gstSale/invoice/sendMail/:id
 * @access	private/admin
 */
const sendInvoiceEmail = async (req, res) => {
  const { id } = req.params;
  try {
    const invoiceData = await prisma.gstSales.findUnique({
      where: { id: Number(id) },
      include: {
        customer: true,
        items: true,
      },
    });

    if (invoiceData) {
      await sendSaleMail({ saleData: invoiceData, type: "gstSaleMail" });
      res.status(200).json({ message: "Email Send Sucessfully" });
    } else {
      return res.status(404).json({ message: "Invoice not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error({ message: "Email Sending Failed", error: error.message });
  }
};

/**
 * @desc		Downlaod All Gst Sales List PDF File
 * @route		POST /api/v1/gstSale/download/pdf
 * @access	private/admin
 */
const downloadGstSalesListPdf = async (req, res) => {
  try {
    const filePath = path.resolve("server/data/PdfTemplate/GstSalesTable.ejs");

    const pageSize = +req.query.pageSize || 2;
    const pageNumber = +req.query.pageNumber || 1;

    const { keyword, invoiceType, accountType, fromDate, toDate, balanceDue } =
      req.query;

    const filter = {
      AND: [],
    };

    if (keyword) {
      filter.AND.push({
        OR: [
          { customer: { firstName: { contains: keyword } } },
          { customer: { lastName: { contains: keyword } } },
          { customer: { businessLegalName: { contains: keyword } } },
          { customer: { gstNumber: { contains: keyword } } },
          { customer: { placeOfSupply: { contains: keyword } } },
          { invoiceNumber: { contains: keyword } },
          { orderNumber: { contains: keyword } },
          {
            items: {
              some: {
                OR: [
                  { name: { contains: keyword } },
                  { description: { contains: keyword } },
                  { hsnsacCode: { contains: keyword } },
                ],
              },
            },
          },
        ],
      });
    }

    if (invoiceType) {
      filter.AND.push({ invoiceType });
    }

    if (accountType) {
      filter.AND.push({ accountType });
    }

    if (fromDate && toDate) {
      filter.AND.push({
        invoiceDate: {
          gte: new Date(fromDate),
          lte: new Date(toDate),
        },
      });
    }

    if (balanceDue) {
      filter.AND.push({
        balanceDue: balanceDue === "true" ? { gt: 0 } : 0,
      });
    }

    const gstSalesData = await prisma.gstSales.findMany({
      where: filter,
      include: {
        customer: true,
        items: true,
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

    const pdfBuffer = await pdfGenerator({
      filePath,
      data: gstSalesData,
      scale: 0.3,
    });

    res.status(200);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=CustomersList.pdf",
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error({ message: "Download Failed", error: error.message });
  }
};

/**
 * @desc		Downlaod All Gst Sales List Excel File
 * @route		POST /api/v1/gstSale/download/excel
 * @access	private/admin
 */
const downloadGstSalesListExcel = async (req, res) => {
  const pageSize = +req.query.pageSize || 2;
  const pageNumber = +req.query.pageNumber || 1;

  const { keyword, invoiceType, accountType, fromDate, toDate, balanceDue } =
    req.query;

  const filter = {
    AND: [],
  };

  if (keyword) {
    filter.AND.push({
      OR: [
        { customer: { firstName: { contains: keyword } } },
        { customer: { lastName: { contains: keyword } } },
        { customer: { businessLegalName: { contains: keyword } } },
        { customer: { gstNumber: { contains: keyword } } },
        { customer: { placeOfSupply: { contains: keyword } } },
        { invoiceNumber: { contains: keyword } },
        { orderNumber: { contains: keyword } },
        {
          items: {
            some: {
              OR: [
                { name: { contains: keyword } },
                { description: { contains: keyword } },
                { hsnsacCode: { contains: keyword } },
              ],
            },
          },
        },
      ],
    });
  }

  if (invoiceType) {
    filter.AND.push({ invoiceType });
  }

  if (accountType) {
    filter.AND.push({ accountType });
  }

  if (fromDate && toDate) {
    filter.AND.push({
      invoiceDate: {
        gte: new Date(fromDate),
        lte: new Date(toDate),
      },
    });
  }

  if (balanceDue) {
    filter.AND.push({
      balanceDue: balanceDue === "true" ? { gt: 0 } : 0,
    });
  }

  const gstSalesData = await prisma.gstSales.findMany({
    where: filter,
    include: {
      customer: true,
      items: true,
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
    { header: "INVOICE DATE", key: "invoiceDate", width: 15 },
    { header: "INVOICE NUMBER", key: "invoiceNumber", width: 15 },
    { header: "NAME", key: "name", width: 15 },
    { header: "BUSINESS LEGAL NAME", key: "businessLegalName", width: 30 },
    { header: "GSTIN", key: "gstNumber", width: 20 },
    { header: "B2B/B2C", key: "tradeType", width: 10 },
    { header: "STATE", key: "placeOfSupply", width: 10 },

    { header: "ITEM NAME", key: "itemName", width: 40 },
    { header: "ITEM DESCRIPTION", key: "description", width: 40 },
    { header: "ITEM TYPE", key: "type", width: 10 },
    { header: "HSNSAC", key: "hsnsacCode", width: 10 },
    { header: "GST %", key: "gstSlab", width: 10 },
    { header: "RATE", key: "rate", width: 10 },
    { header: "QUANTITY", key: "quantity", width: 5 },
    { header: "CGST", key: "cgst", width: 5 },
    { header: "SGST", key: "sgst", width: 5 },
    { header: "IGST", key: "igst", width: 5 },
    { header: "TAXABLE AMOUNT", key: "taxableAmount", width: 10 },
    { header: "TAX AMOUNT", key: "gstAmount", width: 10 },
    { header: "TOTAL AMOUNT", key: "total", width: 10 },

    { header: "TOTAL TAXABLE AMOUNT", key: "totalTaxableAmount", width: 10 },
    { header: "TOTAL CGST", key: "totalCgst", width: 10 },
    { header: "TOTAL SGST", key: "totalSgst", width: 10 },
    { header: "TOTAL IGST", key: "totalIgst", width: 10 },
    { header: "TOTAL TAX", key: "totalGstAmount", width: 10 },
    { header: "SHIPPING", key: "shippingCharges", width: 10 },
    { header: "DISCOUNT", key: "discount", width: 10 },
    { header: "ADJUSTMENT", key: "otherAdjustments", width: 10 },
    { header: "TOTAL AMOUNT", key: "finalAmount", width: 10 },
    { header: "ADVANCE PAID", key: "advanceAmount", width: 10 },
    { header: "BALANCE DUE", key: "balanceDue", width: 10 },
    { header: "ACCOUNT", key: "accountType", width: 10 },
    { header: "INVOICE STATUS", key: "invoiceType", width: 15 },
    { header: "ORDER NUMBER", key: "orderNumber", width: 15 },
    { header: "DUE DATE", key: "dueDate", width: 15 },
    { header: "CREATED BY", key: "createdBy", width: 15 },
    { header: "CREATED AT", key: "createdAt", width: 15 },
    { header: "UPDATED AT", key: "updatedAt", width: 15 },
  ];

  const refactoredGstSalesData = gstSalesData.map((elem) => {
    const items = elem.items.map((i) => ({
      itemName: i.name,
      description: i.description,
      type: i.type,
      hsnsacCode: i.hsnsacCode,
      gstSlab: i.gstSlab,
      rate: i.rate,
      quantity: i.quantity,
      cgst: i.cgst,
      sgst: i.sgst,
      igst: i.igst,
      taxableAmount: i.taxableAmount,
      gstAmount: i.gstAmount,
      total: i.total,
    }));

    return {
      invoiceDate: elem.invoiceDate,
      invoiceNumber: elem.invoiceNumber,
      name: `${elem.customer.salutation} ${elem.customer.firstName} ${elem.customer.lastName}`,
      businessLegalName: elem.customer.businessLegalName
        ? elem.customer.businessLegalName
        : "---",
      gstNumber: elem.customer.gstNumber ? elem.customer.gstNumber : "---",
      tradeType: elem.customer.gstNumber ? "B2B" : "B2C",
      placeOfSupply: elem.customer.placeOfSupply,
      items,
      totalTaxableAmount: elem.taxableAmount,
      totalCgst: elem.cgst,
      totalSgst: elem.sgst,
      totalIgst: elem.igst,
      totalGstAmount: elem.gstAmount,
      shippingCharges: elem.shippingCharges,
      discount: elem.discount,
      otherAdjustments: elem.otherAdjustments,
      finalAmount: elem.total,
      advanceAmount: elem.advanceAmount,
      balanceDue: elem.balanceDue,
      accountType: elem.accountType,
      invoiceType: elem.invoiceType,
      orderNumber: elem.orderNumber,
      dueDate: elem.dueDate,
      createdBy: `${elem.user.name} | Admin`,
      createdAt: elem.createdAt,
      updatedAt: elem.updatedAt,
    };
  });

  const excel = await salesExcelGenerator({
    workSheetName: "GST Sales",
    header,
    data: refactoredGstSalesData,
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "inline; filename=data.xlsx");
  res.send(excel);
};

/**
 * @desc		Get GST Sales Summary Customer Wise
 * @route		GET /api/v1/gstSales/summary/customer
 * @access	private
 */
const gstSalesCustomerSummary = async (req, res) => {
  const keyword = req.query.keyword?.trim();
  const financialYear = Number(req.query.year);

  if (!financialYear) {
    res.status(400);
    throw new Error("Invalid Financial Year");
  }

  const startDate = `${financialYear}-04-01`;
  const endDate = `${financialYear + 1}-03-31`;
  const filter = keyword ? `%${keyword}%` : "";

  const pivotData = await prisma.$queryRaw`
SELECT
    c.id AS customer_id,
    COUNT(DISTINCT g.id) AS total_purchase,
    COALESCE(SUM(g.taxableAmount), 0) AS total_taxable_amount,
    COALESCE(SUM(g.cgst), 0) AS total_cgst,
    COALESCE(SUM(g.sgst), 0) AS total_sgst,
    COALESCE(SUM(g.igst), 0) AS total_igst,
    COALESCE(SUM(g.total), 0) AS total_amount,
    (
        SELECT
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'year',
                    gs.year,
                    'month',
                    gs.month,
                    'total_purchase',
                    gs.total_purchase,
                    'total_taxable_amount',
                    gs.total_taxable_amount,
                    'total_cgst',
                    gs.total_cgst,
                    'total_sgst',
                    gs.total_sgst,
                    'total_igst',
                    gs.total_igst,
                    'total_amount',
                    gs.total_amount,
                    'data',
                    (
                        SELECT
                            JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'id',
                                    s.id,
                                    'invoiceNumber',
                                    s.invoiceNumber,
                                    'orderNumber',
                                    s.orderNumber,
                                    'invoiceType',
                                    s.invoiceType,
                                    'invoiceDate',
                                    s.invoiceDate,
                                    'dueDate',
                                    s.dueDate,
                                    'taxableAmount',
                                    s.taxableAmount,
                                    'cgst',
                                    s.cgst,
                                    'sgst',
                                    s.sgst,
                                    'igst',
                                    s.igst,
                                    'gstAmount',
                                    s.gstAmount,
                                    'shippingCharges',
                                    s.shippingCharges,
                                    'discount',
                                    s.discount,
                                    'otherAdjustments',
                                    s.otherAdjustments,
                                    'total',
                                    s.total,
                                    'advanceAmount',
                                    s.advanceAmount,
                                    'balanceDue',
                                    s.balanceDue,
                                    'accountType',
                                    s.accountType,
                                    'items',
                                    (
                                        SELECT
                                            JSON_ARRAYAGG(
                                                JSON_OBJECT(
                                                    'id',
                                                    si.id,
                                                    'name',
                                                    si.name,
                                                    'type',
                                                    si.type,
                                                    'description',
                                                    si.description,
                                                    'startDate',
                                                    si.startDate,
                                                    'endDate',
                                                    si.endDate,
                                                    'validity',
                                                    si.validity,
                                                    'hsnsacCode',
                                                    si.hsnsacCode,
                                                    'gstSlab',
                                                    si.gstSlab,
                                                    'rate',
                                                    si.rate,
                                                    'cgst',
                                                    si.cgst,
                                                    'sgst',
                                                    si.sgst,
                                                    'igst',
                                                    si.igst,
                                                    'quantity',
                                                    si.quantity,
                                                    'taxableAmount',
                                                    si.taxableAmount,
                                                    'gstAmount',
                                                    si.gstAmount,
                                                    'total',
                                                    si.total
                                                )
                                            )
                                        FROM
                                            GstSaleItems si
                                        WHERE
                                            si.gstSaleId = s.id
                                    )
                                )
                            )
                        FROM
                            GstSales s
                        WHERE
                            YEAR(s.invoiceDate) = gs.year
                            AND MONTH(s.invoiceDate) = gs.month
                            AND s.customerId = c.id
                    )
                )
            )
        FROM
            (
                SELECT
                    g.customerId AS cust_id,
                    YEAR(g.invoiceDate) AS year,
                    MONTH(g.invoiceDate) AS month,
                    COUNT(g.id) AS total_purchase,
                    SUM(g.taxableAmount) AS total_taxable_amount,
                    SUM(g.cgst) AS total_cgst,
                    SUM(g.sgst) AS total_sgst,
                    SUM(g.igst) AS total_igst,
                    SUM(g.total) AS total_amount
                FROM
                    GstSales g
                GROUP BY
                    g.customerId,
                    YEAR(g.invoiceDate),
                    MONTH(g.invoiceDate)
            ) gs
        WHERE
            gs.cust_id = c.id
    ) AS monthly_data,
    (
        SELECT
            JSON_OBJECT(
                'id',
                Customer.id,
                'customerType',
                Customer.customerType,
                'salutation',
                Customer.salutation,
                'firstName',
                Customer.firstName,
                'lastName',
                Customer.lastName,
                'email',
                Customer.email,
                'mobile',
                Customer.mobile,
                'gstNumber',
                Customer.gstNumber,
                'businessLegalName',
                Customer.businessLegalName,
                'placeOfSupply',
                Customer.placeOfSupply
            )
        FROM
            Customer
        WHERE
            Customer.id = c.id
    ) AS customer
FROM
    Customer c
    INNER JOIN GstSales g ON c.id = g.customerId
WHERE
    invoiceDate BETWEEN ${startDate}
    AND ${endDate}
    AND (
        ${filter} = ''
        OR c.id LIKE ${filter}
        OR c.firstName LIKE ${filter}
        OR c.lastName LIKE ${filter}
    )
GROUP BY
    c.id
`;

  const gstSalesCustomerSummary = JSON.parse(
    JSON.stringify(pivotData, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

  res.status(200).json(gstSalesCustomerSummary);
};

/**
 * @desc		Download All GST Sales Summary Customer Wise
 * @route		POST /api/v1/gstSales/download/summary/customers
 * @access	private/admin
 */
const downloadGstSalesCustomerSummaryExcel = async (req, res) => {
  const keyword = req.query.keyword?.trim();
  const financialYear = Number(req.query.year);

  if (!financialYear) {
    res.status(400);
    throw new Error("Invalid Financial Year");
  }

  const startDate = `${financialYear}-04-01`;
  const endDate = `${financialYear + 1}-03-31`;
  const filter = keyword ? `%${keyword}%` : "";

  const pivotData = await prisma.$queryRaw`
SELECT
    c.id AS customer_id,
    COUNT(DISTINCT g.id) AS total_purchase,
    COALESCE(SUM(g.taxableAmount), 0) AS total_taxable_amount,
    COALESCE(SUM(g.cgst), 0) AS total_cgst,
    COALESCE(SUM(g.sgst), 0) AS total_sgst,
    COALESCE(SUM(g.igst), 0) AS total_igst,
    COALESCE(SUM(g.total), 0) AS total_amount,
    (
        SELECT
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'year',
                    gs.year,
                    'month',
                    gs.month,
                    'total_purchase',
                    gs.total_purchase,
                    'total_taxable_amount',
                    gs.total_taxable_amount,
                    'total_cgst',
                    gs.total_cgst,
                    'total_sgst',
                    gs.total_sgst,
                    'total_igst',
                    gs.total_igst,
                    'total_amount',
                    gs.total_amount,
                    'data',
                    (
                        SELECT
                            JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'id',
                                    s.id,
                                    'invoiceNumber',
                                    s.invoiceNumber,
                                    'orderNumber',
                                    s.orderNumber,
                                    'invoiceType',
                                    s.invoiceType,
                                    'invoiceDate',
                                    s.invoiceDate,
                                    'dueDate',
                                    s.dueDate,
                                    'taxableAmount',
                                    s.taxableAmount,
                                    'cgst',
                                    s.cgst,
                                    'sgst',
                                    s.sgst,
                                    'igst',
                                    s.igst,
                                    'gstAmount',
                                    s.gstAmount,
                                    'shippingCharges',
                                    s.shippingCharges,
                                    'discount',
                                    s.discount,
                                    'otherAdjustments',
                                    s.otherAdjustments,
                                    'total',
                                    s.total,
                                    'advanceAmount',
                                    s.advanceAmount,
                                    'balanceDue',
                                    s.balanceDue,
                                    'accountType',
                                    s.accountType,
                                    'items',
                                    (
                                        SELECT
                                            JSON_ARRAYAGG(
                                                JSON_OBJECT(
                                                    'id',
                                                    si.id,
                                                    'name',
                                                    si.name,
                                                    'type',
                                                    si.type,
                                                    'description',
                                                    si.description,
                                                    'startDate',
                                                    si.startDate,
                                                    'endDate',
                                                    si.endDate,
                                                    'validity',
                                                    si.validity,
                                                    'hsnsacCode',
                                                    si.hsnsacCode,
                                                    'gstSlab',
                                                    si.gstSlab,
                                                    'rate',
                                                    si.rate,
                                                    'cgst',
                                                    si.cgst,
                                                    'sgst',
                                                    si.sgst,
                                                    'igst',
                                                    si.igst,
                                                    'quantity',
                                                    si.quantity,
                                                    'taxableAmount',
                                                    si.taxableAmount,
                                                    'gstAmount',
                                                    si.gstAmount,
                                                    'total',
                                                    si.total
                                                )
                                            )
                                        FROM
                                            GstSaleItems si
                                        WHERE
                                            si.gstSaleId = s.id
                                    )
                                )
                            )
                        FROM
                            GstSales s
                        WHERE
                            YEAR(s.invoiceDate) = gs.year
                            AND MONTH(s.invoiceDate) = gs.month
                            AND s.customerId = c.id
                    )
                )
            )
        FROM
            (
                SELECT
                    g.customerId AS cust_id,
                    YEAR(g.invoiceDate) AS year,
                    MONTH(g.invoiceDate) AS month,
                    COUNT(g.id) AS total_purchase,
                    SUM(g.taxableAmount) AS total_taxable_amount,
                    SUM(g.cgst) AS total_cgst,
                    SUM(g.sgst) AS total_sgst,
                    SUM(g.igst) AS total_igst,
                    SUM(g.total) AS total_amount
                FROM
                    GstSales g
                GROUP BY
                    g.customerId,
                    YEAR(g.invoiceDate),
                    MONTH(g.invoiceDate)
            ) gs
        WHERE
            gs.cust_id = c.id
    ) AS monthly_data,
    (
        SELECT
            JSON_OBJECT(
                'id',
                Customer.id,
                'customerType',
                Customer.customerType,
                'salutation',
                Customer.salutation,
                'firstName',
                Customer.firstName,
                'lastName',
                Customer.lastName,
                'email',
                Customer.email,
                'mobile',
                Customer.mobile,
                'gstNumber',
                Customer.gstNumber,
                'businessLegalName',
                Customer.businessLegalName,
                'placeOfSupply',
                Customer.placeOfSupply
            )
        FROM
            Customer
        WHERE
            Customer.id = c.id
    ) AS customer
FROM
    Customer c
    INNER JOIN GstSales g ON c.id = g.customerId
WHERE
    invoiceDate BETWEEN ${startDate}
    AND ${endDate}
    AND (
        ${filter} = ''
        OR c.id LIKE ${filter}
        OR c.firstName LIKE ${filter}
        OR c.lastName LIKE ${filter}
    )
GROUP BY
    c.id
`;

  const gstSalesCustomerSummary = JSON.parse(
    JSON.stringify(pivotData, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

  const workbook = new ExcelJs.Workbook();
  const worksheet = workbook.addWorksheet("GST Sales Customer Summary");
  gstSalesCustomerSummary.forEach((elem) => {
    worksheet.addRow();
    worksheet.addRow([
      `${elem.customer.firstName} ${elem.customer.lastName}`,
      "",
      "Total Purchase",
      elem.total_purchase,
      "",
      "Total Amount",
      elem.total_amount,
    ]);

    elem.monthly_data.forEach((i) => {
      worksheet.addRow();
      worksheet.addRow([
        "",
        `${month[i.month]} ${i.year}`,
        "Total Purchase",
        elem.total_purchase,
        "",
        "Total Amount",
        elem.total_amount,
      ]);
      worksheet.addRow();
      worksheet.addRow([
        "",
        "",
        "INVOICE DATE",
        "INVOICE NUMBER",
        "NAME",
        "BUSINESS LEGAL NAME",
        "GSTIN",
        "B2B/B2C",
        "ITEM NAME",
        "ITEM DESCRIPTION",
        "ITEM TYPE",
        "HSNSAC",
        "GST %",
        "QUANTITY",
        "RATE",
        "CGST",
        "SGST",
        "IGST",
        "TAXABLE AMOUNT",
        "GST AMOUNT",
        "TOTAL AMOUNT",
        "TOTAL TAXABLE AMOUNT",
        "TOTAL CGST",
        "TOTAL SGST",
        "TOTAL IGST",
        "TOTAL TAX",
        "SHIPPING",
        "DISCOUNT",
        "ADJUSTMENT",
        "TOTAL AMOUNT",
        "ADVANCE PAID",
        "BALANCE DUE",
        "ACCOUNT",
        "INVOICE STATUS",
        "ORDER NUMBER",
        "DUE DATE",
      ]);
      i.data.forEach((x) => {
        const name = `${elem.customer.salutation} ${elem.customer.firstName} ${elem.customer.lastName}`;
        const tradeType = elem.customer.gstNumber ? "B2B" : "B2C";
        const businessLegalName = elem.customer.businessLegalName
          ? elem.customer.businessLegalName
          : "---";
        const gstNumber = elem.customer.gstNumber
          ? elem.customer.gstNumber
          : "---";

        worksheet.addRow([
          "",
          "",
          x.invoiceDate,
          x.invoiceNumber,
          name,
          businessLegalName,
          gstNumber,
          tradeType,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          x.taxableAmount,
          x.cgst,
          x.sgst,
          x.igst,
          x.gstAmount,
          x.shippingCharges,
          x.discount,
          x.otherAdjustments,
          x.total,
          x.advanceAmount,
          x.balanceDue,
          x.accountType,
          x.invoiceType,
          x.orderNumber,
          x.dueDate,
        ]);

        x.items.forEach((z) => {
          worksheet.addRow([
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            z.name,
            z.description,
            z.type,
            z.hsnsacCode,
            z.gstSlab,
            z.quantity,
            z.rate,
            z.cgst,
            z.sgst,
            z.igst,
            z.taxableAmount,
            z.gstAmount,
            z.total,
          ]);
        });
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

/**
 * @desc		Get GST Sales Summary HSN Wise
 * @route		GET /api/v1/gstSales/summary/hsn
 * @access	private
 */
const gstSalesHsnSummary = async (req, res) => {
  const keyword = req.query.hsnSac?.trim();
  const financialYear = Number(req.query.year);

  if (!financialYear) {
    res.status(400);
    throw new Error("Invalid Financial Year");
  }

  const startDate = `${financialYear}-04-01`;
  const endDate = `${financialYear + 1}-03-31`;
  const filter = keyword ? `%${keyword}%` : "";

  const pivotData = await prisma.$queryRaw`
WITH MonthlySales AS (
    SELECT
        gsi.hsnsacCode AS hsn_code,
        YEAR(gs.invoiceDate) AS year,
        MONTH(gs.invoiceDate) AS month,
        SUM(gsi.quantity) AS total_items_sold,
        SUM(gsi.taxableAmount) AS total_taxable_amount,
        SUM(gsi.cgst) AS total_cgst,
        SUM(gsi.sgst) AS total_sgst,
        SUM(gsi.igst) AS total_igst,
        SUM(gsi.total) AS total_amount
    FROM GstSaleItems gsi
    INNER JOIN gstSales gs ON gsi.gstSaleId = gs.id
    WHERE
    gs.invoiceDate BETWEEN ${startDate}
    AND ${endDate}
    AND (
        ${filter} = ''
        OR gsi.hsnsacCode LIKE ${filter}
    )
    GROUP BY gsi.hsnsacCode, YEAR(gs.invoiceDate), MONTH(gs.invoiceDate)
)

SELECT 
    gsi.hsnsacCode AS id,
    SUM(gsi.quantity) AS total_purchase,
    COALESCE(SUM(gsi.taxableAmount), 0) AS total_taxable_amount,
    COALESCE(SUM(gsi.cgst), 0) AS total_cgst,
    COALESCE(SUM(gsi.sgst), 0) AS total_sgst,
    COALESCE(SUM(gsi.igst), 0) AS total_igst,
    COALESCE(SUM(gsi.total), 0) AS total_amount,
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'year', ms.year,
                'month', ms.month,
                'total_purchase', ms.total_items_sold,
                'total_taxable_amount', ms.total_taxable_amount,
                'total_cgst', ms.total_cgst,
                'total_sgst', ms.total_sgst,
                'total_igst', ms.total_igst,
                'total_amount', ms.total_amount,
                'data',
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'invoiceNumber', gs.invoiceNumber,
                            'orderNumber', gs.orderNumber,
                            'invoiceDate', gs.invoiceDate,
                            'customer', 
                            JSON_OBJECT(
                                'id', c.id,
                                'customerType', c.customerType,
                                'salutation', c.salutation,
                                'firstName', c.firstName,
                                'lastName', c.lastName,
                                'email', c.email,
                                'mobile', c.mobile,
                                'gstNumber', c.gstNumber,
                                'businessLegalName', c.businessLegalName,
                                'placeOfSupply', c.placeOfSupply
                            ),
                            'item',
                            JSON_OBJECT(
                                'name', gsi2.name,
                                'description', gsi2.description,
                                'type', gsi2.type,
                                'gstSlab', gsi2.gstSlab,
                                'quantity', gsi2.quantity,
                                'hsnCode', gsi2.hsnsacCode,
                                'rate', gsi2.rate,
                                'taxableAmount', gsi2.taxableAmount,
                                'cgst', gsi2.cgst,
                                'sgst', gsi2.sgst,
                                'igst', gsi2.igst,
                                'gstAmount', gsi2.gstAmount,
                                'total', gsi2.total
                            )
                        )
                    )
                    FROM GstSaleItems gsi2
                    INNER JOIN gstSales gs ON gsi2.gstSaleId = gs.id
                    INNER JOIN Customer c ON gs.customerId = c.id
                    WHERE gsi2.hsnsacCode = gsi.hsnsacCode
                      AND YEAR(gs.invoiceDate) = ms.year
                      AND MONTH(gs.invoiceDate) = ms.month
                )
            )
        )
        FROM MonthlySales ms
        WHERE ms.hsn_code = gsi.hsnsacCode
    ) AS monthly_data
FROM GstSaleItems gsi
INNER JOIN gstSales gs ON gsi.gstSaleId = gs.id
WHERE
gs.invoiceDate BETWEEN ${startDate}
    AND ${endDate}
    AND (
        ${filter} = ''
        OR gsi.hsnsacCode LIKE ${filter}
    )
GROUP BY gsi.hsnsacCode;
`;

  const gstSalesHsnSummary = JSON.parse(
    JSON.stringify(pivotData, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

  res.status(200).json(gstSalesHsnSummary);
};

/**
 * @desc		Download All GST Sales Summary HSN Wise
 * @route		POST /api/v1/gstSales/download/summary/hsn
 * @access	private/admin
 */
const downloadGstSalesHsnSummaryExcel = async (req, res) => {
  const keyword = req.query.hsnSac?.trim();
  const financialYear = Number(req.query.year);

  if (!financialYear) {
    res.status(400);
    throw new Error("Invalid Financial Year");
  }

  const startDate = `${financialYear}-04-01`;
  const endDate = `${financialYear + 1}-03-31`;
  const filter = keyword ? `%${keyword}%` : "";

  const pivotData = await prisma.$queryRaw`
WITH MonthlySales AS (
    SELECT
        gsi.hsnsacCode AS hsn_code,
        YEAR(gs.invoiceDate) AS year,
        MONTH(gs.invoiceDate) AS month,
        SUM(gsi.quantity) AS total_items_sold,
        SUM(gsi.taxableAmount) AS total_taxable_amount,
        SUM(gsi.cgst) AS total_cgst,
        SUM(gsi.sgst) AS total_sgst,
        SUM(gsi.igst) AS total_igst,
        SUM(gsi.total) AS total_amount
    FROM GstSaleItems gsi
    INNER JOIN gstSales gs ON gsi.gstSaleId = gs.id
    WHERE
    gs.invoiceDate BETWEEN ${startDate}
    AND ${endDate}
    AND (
        ${filter} = ''
        OR gsi.hsnsacCode LIKE ${filter}
    )
    GROUP BY gsi.hsnsacCode, YEAR(gs.invoiceDate), MONTH(gs.invoiceDate)
)

SELECT 
    gsi.hsnsacCode AS id,
    SUM(gsi.quantity) AS total_purchase,
    COALESCE(SUM(gsi.taxableAmount), 0) AS total_taxable_amount,
    COALESCE(SUM(gsi.cgst), 0) AS total_cgst,
    COALESCE(SUM(gsi.sgst), 0) AS total_sgst,
    COALESCE(SUM(gsi.igst), 0) AS total_igst,
    COALESCE(SUM(gsi.total), 0) AS total_amount,
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'year', ms.year,
                'month', ms.month,
                'total_purchase', ms.total_items_sold,
                'total_taxable_amount', ms.total_taxable_amount,
                'total_cgst', ms.total_cgst,
                'total_sgst', ms.total_sgst,
                'total_igst', ms.total_igst,
                'total_amount', ms.total_amount,
                'data',
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'invoiceNumber', gs.invoiceNumber,
                            'orderNumber', gs.orderNumber,
                            'invoiceDate', gs.invoiceDate,
                            'customer', 
                            JSON_OBJECT(
                                'id', c.id,
                                'customerType', c.customerType,
                                'salutation', c.salutation,
                                'firstName', c.firstName,
                                'lastName', c.lastName,
                                'email', c.email,
                                'mobile', c.mobile,
                                'gstNumber', c.gstNumber,
                                'businessLegalName', c.businessLegalName,
                                'placeOfSupply', c.placeOfSupply
                            ),
                            'item',
                            JSON_OBJECT(
                                'name', gsi2.name,
                                'description', gsi2.description,
                                'type', gsi2.type,
                                'gstSlab', gsi2.gstSlab,
                                'quantity', gsi2.quantity,
                                'hsnCode', gsi2.hsnsacCode,
                                'rate', gsi2.rate,
                                'taxableAmount', gsi2.taxableAmount,
                                'cgst', gsi2.cgst,
                                'sgst', gsi2.sgst,
                                'igst', gsi2.igst,
                                'gstAmount', gsi2.gstAmount,
                                'total', gsi2.total
                            )
                        )
                    )
                    FROM GstSaleItems gsi2
                    INNER JOIN gstSales gs ON gsi2.gstSaleId = gs.id
                    INNER JOIN Customer c ON gs.customerId = c.id
                    WHERE gsi2.hsnsacCode = gsi.hsnsacCode
                      AND YEAR(gs.invoiceDate) = ms.year
                      AND MONTH(gs.invoiceDate) = ms.month
                )
            )
        )
        FROM MonthlySales ms
        WHERE ms.hsn_code = gsi.hsnsacCode
    ) AS monthly_data
FROM GstSaleItems gsi
INNER JOIN gstSales gs ON gsi.gstSaleId = gs.id
WHERE
gs.invoiceDate BETWEEN ${startDate}
    AND ${endDate}
    AND (
        ${filter} = ''
        OR gsi.hsnsacCode LIKE ${filter}
    )
GROUP BY gsi.hsnsacCode;
`;

  const gstSalesHsnSummary = JSON.parse(
    JSON.stringify(pivotData, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

  const workbook = new ExcelJs.Workbook();
  const worksheet = workbook.addWorksheet("GST Sales HSN Summary");
  gstSalesHsnSummary.forEach((elem) => {
    worksheet.addRow();
    worksheet.addRow([
      elem.id,
      "",
      "Total Purchase",
      elem.total_purchase,
      "",
      "Total Amount",
      elem.total_amount,
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
        "INVOICE DATE",
        "INVOICE NUMBER",
        "NAME",
        "BUSINESS LEGAL NAME",
        "GSTIN",
        "B2B/B2C",
        "ITEM NAME",
        "ITEM DESCRIPTION",
        "ITEM TYPE",
        "HSNSAC",
        "GST %",
        "QUANTITY",
        "RATE",
        "TAXABLE AMOUNT",
        "CGST",
        "SGST",
        "IGST",
        "GST AMOUNT",
        "TOTAL AMOUNT",
        "ORDER NUMBER",
      ]);
      i.data.forEach((x) => {
        const name = `${x.customer.salutation} ${x.customer.firstName} ${x.customer.lastName}`;
        const tradeType = x.customer.gstNumber ? "B2B" : "B2C";
        const businessLegalName = x.customer.businessLegalName
          ? x.customer.businessLegalName
          : "---";
        const gstNumber = x.customer.gstNumber ? x.customer.gstNumber : "---";

        worksheet.addRow([
          "",
          "",
          x.invoiceDate,
          x.invoiceNumber,
          name,
          businessLegalName,
          gstNumber,
          tradeType,
          x.item.name,
          x.item.description,
          x.item.type,
          x.item.hsnCode,
          x.item.gstSlab,
          x.item.quantity,
          x.item.rate,
          x.item.taxableAmount,
          x.item.cgst,
          x.item.sgst,
          x.item.igst,
          x.item.gstAmount,
          x.item.total,
          x.orderNumber,
        ]);
      });
    });
  });

  // const excel = await salesExcelGenerator({ workSheetName: 'GST Sales', header, data: refactoredGstSalesData });
  const excel = await workbook.xlsx.writeBuffer();
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "inline; filename=data.xlsx");
  res.send(excel);
};

/**
 * @desc		Get GST Sales Summary Product Wise
 * @route		GET /api/v1/gstSales/summary/product
 * @access	private
 */
const gstSalesProductSummary = async (req, res) => {
  const keyword = req.query.productId?.trim();
  const financialYear = Number(req.query.year);

  if (!financialYear) {
    res.status(400);
    throw new Error("Invalid Financial Year");
  }

  const startDate = `${financialYear}-04-01`;
  const endDate = `${financialYear + 1}-03-31`;
  const filter = keyword ? `${keyword}\%` : "";

  const pivotData = await prisma.$queryRaw`
WITH MonthlySales AS (
    SELECT
        gsi.itemId AS item_id,  
        gi.name AS name,
        gi.validity AS validity,
        gi.description AS description,
        YEAR(gs.invoiceDate) AS year,
        MONTH(gs.invoiceDate) AS month,
        SUM(gsi.quantity) AS total_purchase,
        SUM(gsi.taxableAmount) AS total_taxable_amount,
        SUM(gsi.cgst) AS total_cgst,
        SUM(gsi.sgst) AS total_sgst,
        SUM(gsi.igst) AS total_igst,
        SUM(gsi.total) AS total_amount
    FROM GstSaleItems gsi
    INNER JOIN gstSales gs ON gsi.gstSaleId = gs.id
    INNER JOIN gstItems gi ON gsi.itemId = gi.id
    WHERE
    gs.invoiceDate BETWEEN ${startDate}
    AND ${endDate}
    AND (
        ${filter} = ''
        OR gsi.itemId LIKE ${filter}
    )
    GROUP BY gsi.itemId, YEAR(gs.invoiceDate), MONTH(gs.invoiceDate)
)

SELECT 
    gsi.itemId AS item_id,  
    gi.name AS name,
    gi.validity AS validity,
    gi.description AS description,
    SUM(gsi.quantity) AS total_purchase,
    COALESCE(SUM(gsi.taxableAmount), 0) AS total_taxable_amount,
    COALESCE(SUM(gsi.cgst), 0) AS total_cgst,
    COALESCE(SUM(gsi.sgst), 0) AS total_sgst,
    COALESCE(SUM(gsi.igst), 0) AS total_igst,
    COALESCE(SUM(gsi.total), 0) AS total_amount,
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'year', ms.year,
                'month', ms.month,
                'total_purchase', ms.total_purchase,
                'total_taxable_amount', ms.total_taxable_amount,
                'total_cgst', ms.total_cgst,
                'total_sgst', ms.total_sgst,
                'total_igst', ms.total_igst,
                'total_amount', ms.total_amount,
                'data',
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'invoiceNumber', gs.invoiceNumber,
                            'orderNumber', gs.orderNumber,
                            'invoiceDate', gs.invoiceDate,
                            'customer', 
                            JSON_OBJECT(
                               'id',
                c.id,
                'customerType',
                c.customerType,
                'salutation',
                c.salutation,
                'firstName',
                c.firstName,
                'lastName',
                c.lastName,
                'email',
                c.email,
                'mobile',
                c.mobile,
                'gstNumber',
                c.gstNumber,
                'businessLegalName',
                c.businessLegalName,
                'placeOfSupply',
                c.placeOfSupply
                            ),
                            'items', (
                                SELECT 
                                    JSON_OBJECT(
                                        'itemId', gsi2.itemId,
                                        'name', i.name,  -- ✅ Fetching item name from Items table
                                        'description', i.description,  -- ✅ Fetching item name from Items table
                                        'type', i.type,  -- ✅ Fetching item name from Items table
                                        'gstSlab', i.gstSlab,  -- ✅ Fetching item name from Items table
                                        'hsnCode', i.hsnsacCode,  -- ✅ Fetching item name from Items table
                                        'quantity', gsi2.quantity,
                                        'rate', gsi2.rate,
                                        'taxableAmount', gsi2.taxableAmount,
                                        'cgst', gsi2.cgst,
                                        'sgst', gsi2.sgst,
                                        'igst', gsi2.igst,
                                        'gstAmount', gsi2.gstAmount,
                                        'total', gsi2.total
                                    )
                                
                                FROM GstSaleItems gsi2
                                INNER JOIN gstSales gs2 ON gsi2.gstSaleId = gs2.id
                                INNER JOIN GstItems i ON gsi2.itemId = i.id  -- ✅ Joining with GstItems to get item details
                                WHERE gsi2.gstSaleId = gs.id
                                  AND gsi2.itemId = gsi.itemId
                                  AND YEAR(gs2.invoiceDate) = ms.year  -- ✅ Filtering by year
                                  AND MONTH(gs2.invoiceDate) = ms.month  -- ✅ Filtering by month
                            )
                        )
                    )
                    FROM gstSales gs
                    INNER JOIN Customer c ON gs.customerId = c.id
                    WHERE EXISTS (
                        SELECT 1 FROM GstSaleItems gsi3 
                        WHERE gsi3.gstSaleId = gs.id 
                        AND gsi3.itemId = gsi.itemId
                        AND YEAR(gs.invoiceDate) = ms.year  -- ✅ Filtering by year
                        AND MONTH(gs.invoiceDate) = ms.month  -- ✅ Filtering by month
                    )
                )
            )
        )
        FROM MonthlySales ms
        WHERE ms.item_id = gsi.itemId
    ) AS monthly_data
FROM GstSaleItems gsi
INNER JOIN gstSales gs ON gsi.gstSaleId = gs.id
INNER JOIN gstItems gi ON gsi.itemId = gi.id
WHERE
    gs.invoiceDate BETWEEN ${startDate}
    AND ${endDate}
    AND (
        ${filter} = ''
        OR gsi.itemId LIKE ${filter}
    )
GROUP BY gsi.itemId;
`;

  const gstSalesProductSummary = JSON.parse(
    JSON.stringify(pivotData, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

  res.status(200).json(gstSalesProductSummary);
};

/**
 * @desc		Download All GST Sales Summary Product Wise
 * @route		POST /api/v1/gstSales/download/summary/product
 * @access	private/admin
 */
const downloadGstSalesProductSummaryExcel = async (req, res) => {
  const keyword = req.query.productId?.trim();
  const financialYear = Number(req.query.year);

  if (!financialYear) {
    res.status(400);
    throw new Error("Invalid Financial Year");
  }

  const startDate = `${financialYear}-04-01`;
  const endDate = `${financialYear + 1}-03-31`;
  const filter = keyword ? `${keyword}\%` : "";

  const pivotData = await prisma.$queryRaw`
WITH MonthlySales AS (
    SELECT
        gsi.itemId AS item_id,  
        gi.name AS name,
        gi.validity AS validity,
        gi.description AS description,
        YEAR(gs.invoiceDate) AS year,
        MONTH(gs.invoiceDate) AS month,
        SUM(gsi.quantity) AS total_purchase,
        SUM(gsi.taxableAmount) AS total_taxable_amount,
        SUM(gsi.cgst) AS total_cgst,
        SUM(gsi.sgst) AS total_sgst,
        SUM(gsi.igst) AS total_igst,
        SUM(gsi.total) AS total_amount
    FROM GstSaleItems gsi
    INNER JOIN gstSales gs ON gsi.gstSaleId = gs.id
    INNER JOIN gstItems gi ON gsi.itemId = gi.id
    WHERE
    gs.invoiceDate BETWEEN ${startDate}
    AND ${endDate}
    AND (
        ${filter} = ''
        OR gsi.itemId LIKE ${filter}
    )
    GROUP BY gsi.itemId, YEAR(gs.invoiceDate), MONTH(gs.invoiceDate)
)

SELECT 
    gsi.itemId AS item_id,  
    gi.name AS name,
    gi.validity AS validity,
    gi.description AS description,
    SUM(gsi.quantity) AS total_purchase,
    COALESCE(SUM(gsi.taxableAmount), 0) AS total_taxable_amount,
    COALESCE(SUM(gsi.cgst), 0) AS total_cgst,
    COALESCE(SUM(gsi.sgst), 0) AS total_sgst,
    COALESCE(SUM(gsi.igst), 0) AS total_igst,
    COALESCE(SUM(gsi.total), 0) AS total_amount,
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'year', ms.year,
                'month', ms.month,
                'total_purchase', ms.total_purchase,
                'total_taxable_amount', ms.total_taxable_amount,
                'total_cgst', ms.total_cgst,
                'total_sgst', ms.total_sgst,
                'total_igst', ms.total_igst,
                'total_amount', ms.total_amount,
                'data',
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'invoiceNumber', gs.invoiceNumber,
                            'orderNumber', gs.orderNumber,
                            'invoiceDate', gs.invoiceDate,
                            'customer', 
                            JSON_OBJECT(
                               'id',
                c.id,
                'customerType',
                c.customerType,
                'salutation',
                c.salutation,
                'firstName',
                c.firstName,
                'lastName',
                c.lastName,
                'email',
                c.email,
                'mobile',
                c.mobile,
                'gstNumber',
                c.gstNumber,
                'businessLegalName',
                c.businessLegalName,
                'placeOfSupply',
                c.placeOfSupply
                            ),
                            'items', (
                                SELECT 
                                    JSON_OBJECT(
                                        'itemId', gsi2.itemId,
                                        'name', i.name,  -- ✅ Fetching item name from Items table
                                        'description', i.description,  -- ✅ Fetching item name from Items table
                                        'type', i.type,  -- ✅ Fetching item name from Items table
                                        'gstSlab', i.gstSlab,  -- ✅ Fetching item name from Items table
                                        'hsnCode', i.hsnsacCode,
                                        'quantity', gsi2.quantity,
                                        'rate', gsi2.rate,
                                        'taxableAmount', gsi2.taxableAmount,
                                        'cgst', gsi2.cgst,
                                        'sgst', gsi2.sgst,
                                        'igst', gsi2.igst,
                                        'gstAmount', gsi2.gstAmount,
                                        'total', gsi2.total
                                    )
                                
                                FROM GstSaleItems gsi2
                                INNER JOIN gstSales gs2 ON gsi2.gstSaleId = gs2.id
                                INNER JOIN GstItems i ON gsi2.itemId = i.id  -- ✅ Joining with GstItems to get item details
                                WHERE gsi2.gstSaleId = gs.id
                                  AND gsi2.itemId = gsi.itemId
                                  AND YEAR(gs2.invoiceDate) = ms.year  -- ✅ Filtering by year
                                  AND MONTH(gs2.invoiceDate) = ms.month  -- ✅ Filtering by month
                            )
                        )
                    )
                    FROM gstSales gs
                    INNER JOIN Customer c ON gs.customerId = c.id
                    WHERE EXISTS (
                        SELECT 1 FROM GstSaleItems gsi3 
                        WHERE gsi3.gstSaleId = gs.id 
                        AND gsi3.itemId = gsi.itemId
                        AND YEAR(gs.invoiceDate) = ms.year  -- ✅ Filtering by year
                        AND MONTH(gs.invoiceDate) = ms.month  -- ✅ Filtering by month
                    )
                )
            )
        )
        FROM MonthlySales ms
        WHERE ms.item_id = gsi.itemId
    ) AS monthly_data
FROM GstSaleItems gsi
INNER JOIN gstSales gs ON gsi.gstSaleId = gs.id
INNER JOIN gstItems gi ON gsi.itemId = gi.id
WHERE
    gs.invoiceDate BETWEEN ${startDate}
    AND ${endDate}
    AND (
        ${filter} = ''
        OR gsi.itemId LIKE ${filter}
    )
GROUP BY gsi.itemId;
`;

  const gstSalesProductSummary = JSON.parse(
    JSON.stringify(pivotData, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

  const workbook = new ExcelJs.Workbook();
  const worksheet = workbook.addWorksheet("GST Sales Product Summary");
  gstSalesProductSummary.forEach((elem) => {
    worksheet.addRow();
    worksheet.addRow([
      elem?.name,
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
        "INVOICE DATE",
        "INVOICE NUMBER",
        "NAME",
        "BUSINESS LEGAL NAME",
        "GSTIN",
        "B2B/B2C",
        "ITEM NAME",
        "ITEM DESCRIPTION",
        "ITEM TYPE",
        "HSNSAC",
        "GST %",
        "QUANTITY",
        "RATE",
        "CGST",
        "SGST",
        "IGST",
        "TAXABLE AMOUNT",
        "TAX AMOUNT",
        "TOTAL AMOUNT",
      ]);
      i.data.forEach((x) => {
        const name = `${x.customer.salutation} ${x.customer.firstName} ${x.customer.lastName}`;
        const tradeType = x.customer.gstNumber ? "B2B" : "B2C";
        const businessLegalName = x.customer.businessLegalName
          ? x.customer.businessLegalName
          : "---";
        const gstNumber = x.customer.gstNumber ? x.customer.gstNumber : "---";

        worksheet.addRow([
          "",
          "",
          x.invoiceDate,
          x.invoiceNumber,
          name,
          businessLegalName,
          gstNumber,
          tradeType,
          x.items.name,
          x.items.description,
          x.items.type,
          x.items.hsnCode,
          x.items.gstSlab,
          x.items.quantity,
          x.items.rate,
          x.items.cgst,
          x.items.sgst,
          x.items.igst,
          x.items.taxableAmount,
          x.items.gstAmount,
          x.items.total,
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
  addGstSale,
  updateGstSale,
  deleteGstSale,
  getGstSales,
  previewGstSaleInvoicePdf,
  downloadGstSaleInvoicePdf,
  sendInvoiceEmail,
  downloadGstSalesListPdf,
  downloadGstSalesListExcel,
  gstSalesCustomerSummary,
  downloadGstSalesCustomerSummaryExcel,
  gstSalesHsnSummary,
  downloadGstSalesHsnSummaryExcel,
  gstSalesProductSummary,
  downloadGstSalesProductSummaryExcel,
};
