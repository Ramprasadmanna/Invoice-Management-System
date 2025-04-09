import path from "path";
import { pdfGenerator, invoicePdfGenerator } from "#utils/pdfGenerator.js";
import { salesExcelGenerator } from "#utils/excelGenerator.js";
import { sendSaleMail } from "#utils/mailSender.js";
import ExcelJs from "exceljs";
import month from "#data/month.js";
import { prisma } from "#config/db.config.js";

/**
 * @desc		Add CASH Sales
 * @route		POST /api/v1/cashSale/
 * @access	private/admin
 */
const addCashSale = async (req, res) => {
  const {
    customer,
    orderNumber,
    invoiceDate,
    dueDate,
    items,
    price,
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

  const existingInvoiceNumber = await prisma.cashSales.findUnique({
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
    const lastSale = await prisma.cashSales.findFirst({
      orderBy: { invoiceNumber: "desc" },
      select: {
        invoiceNumber: true,
      },
    });

    const lastInvoiceNumber = lastSale ? lastSale.invoiceNumber : null;

    invoiceNumber = lastInvoiceNumber
      ? `B${Number(lastInvoiceNumber.substr(1)) + 1}`
      : "B1001";
  }

  const createdCashSale = await prisma.cashSales.create({
    data: {
      userId: req.user.id,
      customerId: customer,
      invoiceNumber,
      orderNumber,
      invoiceDate: new Date(invoiceDate),
      dueDate: new Date(dueDate),
      price,
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
            price: item.price,
            total: item.total,
            description: item.description,
            quantity: item.quantity,
          };
        }),
      },
    },
    include: {
      customer: true,
      items: true,
    },
  });

  if (createdCashSale && sendMail) {
    await sendSaleMail({ saleData: createdCashSale, type: "saleMail" });
  }

  res.status(200).json(createdCashSale);
};

/**
 * @desc		Update CASH Sales
 * @route		PUT /api/v1/cashSale/:id
 * @access	private/admin
 */
const updateCashSale = async (req, res) => {
  const sale = await prisma.cashSales.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!sale) {
    res.status(404);
    throw new Error("Invoice Not Found");
  }

  const {
    customer,
    invoiceDate,
    dueDate,
    items,
    price,
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

  const updatedCashSale = await prisma.cashSales.update({
    where: { id: Number(req.params.id) },
    data: {
      customerId: customer,
      invoiceDate: new Date(invoiceDate),
      dueDate: new Date(dueDate),
      price,
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
            price: item.price,
            total: item.total,
            description: item.description,
            quantity: item.quantity,
          };
        }),
      },
    },
    include: {
      customer: true,
      items: true,
    },
  });

  if (updatedCashSale && sendMail) {
    await sendSaleMail({ saleData: updatedCashSale, type: "saleMail" });
  }

  res.status(200).json(updatedCashSale);
};

/**
 * @desc		GET All CASH Sales
 * @route		GET /api/v1/cashSale/
 * @access	private
 */
const getCashSales = async (req, res) => {
  const pageSize = +req.query.pageSize || 2;
  const pageNumber = +req.query.pageNumber || 1;

  const { keyword, accountType, fromDate, toDate, balanceDue } = req.query;

  const filter = {
    AND: [],
  };

  if (keyword) {
    filter.AND.push({
      OR: [
        { customer: { firstName: { contains: keyword } } },
        { customer: { lastName: { contains: keyword } } },
        { customer: { businessLegalName: { contains: keyword } } },
        { customer: { placeOfSupply: { contains: keyword } } },
        { invoiceNumber: { contains: keyword } },
        { orderNumber: { contains: keyword } },
        {
          items: {
            some: {
              OR: [
                { name: { contains: keyword } },
                { description: { contains: keyword } },
              ],
            },
          },
        },
      ],
    });
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

  const count = await prisma.cashSales.count({ where: filter });

  const cashSalesData = await prisma.cashSales.findMany({
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
  res.status(200).json({ cashSalesData, pageNumber, pages });
};

/**
 * @desc		Delete CASH Sales
 * @route		DELETE /api/v1/cashSale/:id
 * @access	private/admin
 */
const deleteCashSale = async (req, res) => {
  const { id } = req.params;

  const sale = await prisma.cashSales.findUnique({
    where: { id: Number(id) },
  });

  if (!sale) {
    res.status(404);
    throw new Error("Sale Not Found");
  }

  await prisma.cashSales.delete({ where: { id: Number(id) } });
  res.status(200).json({ message: "Sale Deleted Sucessfully" });
};

/**
 * @desc		Preview Cash Sale Invoice PDF
 * @route		GET /api/v1/cashSale/invoice/preview/:id
 * @access	private/admin
 */
const previewCashSaleInvoicePdf = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(404);
    throw new Error("Invalid Invoice Id");
  }

  try {
    const filePath = path.resolve(
      "server/data/PdfTemplate/cashSaleInvoice.ejs"
    );

    const invoiceData = await prisma.cashSales.findUnique({
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
 * @desc		Downlaod Cash Sale Invoice PDF File
 * @route		GET /api/v1/cashSale/invoice/download/:id
 * @access	private/admin
 */
const downloadCashSaleInvoicePdf = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(404);
    throw new Error("Invalid Invoice Id");
  }

  try {
    const filePath = path.resolve(
      "server/data/PdfTemplate/cashSaleInvoice.ejs"
    );

    const invoiceData = await prisma.cashSales.findUnique({
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
 * @desc		Send Mail Sale Invoice PDF File
 * @route		GET /api/v1/cashSale/invoice/sendMail/:id
 * @access	private/admin
 */
const sendInvoiceEmail = async (req, res) => {
  const { id } = req.params;

  try {
    const invoiceData = await prisma.cashSales.findUnique({
      where: { id: Number(id) },
      include: {
        customer: true,
        items: true,
      },
    });

    if (invoiceData) {
      await sendSaleMail({ saleData: invoiceData, type: "saleMail" });
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
 * @desc		Downlaod All Cash Sales List PDF File
 * @route		POST /api/v1/cashSale/download/pdf
 * @access	private/admin
 */
const downloadCashSalesListPdf = async (req, res) => {
  try {
    const filePath = path.resolve("server/data/PdfTemplate/cashSalesTable.ejs");

    const pageSize = +req.query.pageSize || 2;
    const pageNumber = +req.query.pageNumber || 1;

    const { keyword, accountType, fromDate, toDate, balanceDue } = req.query;

    const filter = {
      AND: [],
    };

    if (keyword) {
      filter.AND.push({
        OR: [
          { customer: { firstName: { contains: keyword } } },
          { customer: { lastName: { contains: keyword } } },
          { customer: { businessLegalName: { contains: keyword } } },
          { customer: { placeOfSupply: { contains: keyword } } },
          { invoiceNumber: { contains: keyword } },
          { orderNumber: { contains: keyword } },
          {
            items: {
              some: {
                OR: [
                  { name: { contains: keyword } },
                  { description: { contains: keyword } },
                ],
              },
            },
          },
        ],
      });
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

    const cashSalesData = await prisma.cashSales.findMany({
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

    const pdfbuffer = await pdfGenerator({
      filePath,
      data: cashSalesData,
      scale: 0.3,
    });

    res.status(200);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=CustomersList.pdf",
    });
    res.send(pdfbuffer);
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error({ message: "Download Failed", error: error.message });
  }
};

/**
 * @desc		Downlaod All Cash Sales List Excel File
 * @route		POST /api/v1/cashSale/download/excel
 * @access	private/admin
 */
const downloadCashSalesListExcel = async (req, res) => {
  const pageSize = +req.query.pageSize || 2;
  const pageNumber = +req.query.pageNumber || 1;

  const { keyword, accountType, fromDate, toDate, balanceDue } = req.query;

  const filter = {
    AND: [],
  };

  if (keyword) {
    filter.AND.push({
      OR: [
        { customer: { firstName: { contains: keyword } } },
        { customer: { lastName: { contains: keyword } } },
        { customer: { businessLegalName: { contains: keyword } } },
        { customer: { placeOfSupply: { contains: keyword } } },
        { invoiceNumber: { contains: keyword } },
        { orderNumber: { contains: keyword } },
        {
          items: {
            some: {
              OR: [
                { name: { contains: keyword } },
                { description: { contains: keyword } },
              ],
            },
          },
        },
      ],
    });
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

  const cashSalesData = await prisma.cashSales.findMany({
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
    { header: "B2B/B2C", key: "tradeType", width: 10 },

    { header: "ITEM NAME", key: "itemName", width: 40 },
    { header: "ITEM DESCRIPTION", key: "description", width: 40 },
    { header: "ITEM TYPE", key: "type", width: 10 },
    { header: "PRICE", key: "price", width: 10 },
    { header: "QUANTITY", key: "quantity", width: 5 },
    { header: "TOTAL AMOUNT", key: "total", width: 10 },

    { header: "TOTAL", key: "totalAmount", width: 10 },
    { header: "SHIPPING", key: "shippingCharges", width: 10 },
    { header: "DISCOUNT", key: "discount", width: 10 },
    { header: "ADJUSTMENT", key: "otherAdjustments", width: 10 },
    { header: "TOTAL AMOUNT", key: "finalAmount", width: 10 },
    { header: "ADVANCE PAID", key: "advanceAmount", width: 10 },
    { header: "BALANCE DUE", key: "balanceDue", width: 10 },
    { header: "ACCOUNT", key: "accountType", width: 10 },
    { header: "ORDER NUMBER", key: "orderNumber", width: 15 },
    { header: "DUE DATE", key: "dueDate", width: 15 },
    { header: "CREATED BY", key: "createdBy", width: 15 },
    { header: "CREATED AT", key: "createdAt", width: 15 },
    { header: "UPDATED AT", key: "updatedAt", width: 15 },
  ];

  const refactoredCashSalesData = cashSalesData.map((elem) => {
    const items = elem.items.map((i) => ({
      itemName: i.name,
      description: i.description,
      type: i.type,
      price: i.price,
      quantity: i.quantity,
      total: i.total,
    }));

    return {
      invoiceDate: elem.invoiceDate,
      invoiceNumber: elem.invoiceNumber,
      name: `${elem.customer.salutation} ${elem.customer.firstName} ${elem.customer.lastName}`,
      businessLegalName: elem.customer.businessLegalName
        ? elem.customer.businessLegalName
        : "---",
      tradeType: elem.customer.gstNumber ? "B2B" : "B2C",
      items,
      totalAmount: elem.price,
      shippingCharges: elem.shippingCharges,
      discount: elem.discount,
      otherAdjustments: elem.otherAdjustments,
      finalAmount: elem.total,
      advanceAmount: elem.advanceAmount,
      balanceDue: elem.balanceDue,
      accountType: elem.accountType,
      orderNumber: elem.orderNumber,
      dueDate: elem.dueDate,
      createdBy: `${elem.user.name} | Admin`,
      createdAt: elem.createdAt,
      updatedAt: elem.updatedAt,
    };
  });

  const excel = await salesExcelGenerator({
    workSheetName: "Sales",
    header,
    data: refactoredCashSalesData,
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "inline; filename=data.xlsx");
  res.send(excel);
};

/**
 * @desc		Get All Sales Summary Customer Wise
 * @route		GET /api/v1/cashSales/summary/customer
 * @access	private
 */
const salesSummary = async (req, res) => {
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
    COUNT(cs.id) AS total_purchase,
    COALESCE(SUM(cs.total), 0) AS total_amount,
    
    JSON_OBJECT(
        '_id', c.id,
        'customerType', c.customerType,
        'salutation', c.salutation,
        'firstName', c.firstName,
        'lastName', c.lastName,
        'email', c.email,
        'placeOfSupply', c.placeOfSupply,
        'businessLegalName', c.businessLegalName
    ) AS customer,
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'year', hs.year,
                'month', hs.month,
                'total_purchase', hs.total_purchase,
                'total_amount', hs.total_amount,
                'data', (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            '_id', cs.id,
                            'invoiceNumber', cs.invoiceNumber,
                            'orderNumber', cs.orderNumber,
                            'invoiceDate', cs.invoiceDate,
                            'dueDate', cs.dueDate,
                            'items', (
                                SELECT JSON_ARRAYAGG(
                                    JSON_OBJECT(
                                        'item', ci.id,
                                        'type', ci.type,
                                        'name', ci.name,
                                        'description', ci.description,
                                        'price', csi.price,
                                        'quantity', csi.quantity,
                                        'total', csi.total
                                    )
                                )
                                FROM cashSaleItems csi
                                INNER JOIN cashItems ci ON csi.itemId = ci.id
                                WHERE csi.cashSaleId = cs.id
                            ),
                            'price', cs.price,
                            'shippingCharges', cs.shippingCharges,
                            'discount', cs.discount,
                            'otherAdjustments', cs.otherAdjustments,
                            'total', cs.total,
                            'advanceAmount', cs.advanceAmount,
                            'balanceDue', cs.balanceDue,
                            'accountType', cs.accountType,
                            'customerNote', cs.customerNote,
                            'termsAndCondition', cs.termsAndCondition
                        )
                    )
                    FROM cashSales cs
                    WHERE cs.customerId = c.id 
                    AND YEAR(cs.invoiceDate) = hs.year 
                    AND MONTH(cs.invoiceDate) = hs.month
                )
            )
        )
        FROM (
            SELECT 
                cs.customerId,
                YEAR(cs.invoiceDate) AS year,
                MONTH(cs.invoiceDate) AS month,
                COUNT(cs.id) AS total_purchase,
                SUM(cs.total) AS total_amount
            FROM cashSales cs
            GROUP BY cs.customerId, YEAR(cs.invoiceDate), MONTH(cs.invoiceDate)
        ) hs
        WHERE hs.customerId = c.id
    ) AS monthly_data

FROM Customer c
INNER JOIN cashSales cs ON c.id = cs.customerId
WHERE
    invoiceDate BETWEEN ${startDate}
    AND ${endDate}
    AND (
        ${filter} = ''
        OR c.id LIKE ${filter}
        OR c.firstName LIKE ${filter}
        OR c.lastName LIKE ${filter}
    )
GROUP BY c.id;
`;

  const salesCustomerSummary = JSON.parse(
    JSON.stringify(pivotData, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

  res.status(200).json(salesCustomerSummary);
};

/**
 * @desc		Download All Sales Summary Customer Wise
 * @route		POST /api/v1/cashSales/download/summary/customers
 * @access	private/admin
 */
const downloadSalesCustomerSummaryExcel = async (req, res) => {
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
    COUNT(cs.id) AS total_purchase,
    COALESCE(SUM(cs.total), 0) AS total_amount,
    
    JSON_OBJECT(
        '_id', c.id,
        'customerType', c.customerType,
        'salutation', c.salutation,
        'firstName', c.firstName,
        'lastName', c.lastName,
        'email', c.email,
        'placeOfSupply', c.placeOfSupply,
        'businessLegalName', c.businessLegalName
    ) AS customer,
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'year', hs.year,
                'month', hs.month,
                'total_purchase', hs.total_purchase,
                'total_amount', hs.total_amount,
                'data', (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            '_id', cs.id,
                            'invoiceNumber', cs.invoiceNumber,
                            'orderNumber', cs.orderNumber,
                            'invoiceDate', cs.invoiceDate,
                            'dueDate', cs.dueDate,
                            'items', (
                                SELECT JSON_ARRAYAGG(
                                    JSON_OBJECT(
                                        'item', ci.id,
                                        'type', ci.type,
                                        'name', ci.name,
                                        'description', ci.description,
                                        'price', csi.price,
                                        'quantity', csi.quantity,
                                        'total', csi.total
                                    )
                                )
                                FROM cashSaleItems csi
                                INNER JOIN cashItems ci ON csi.itemId = ci.id
                                WHERE csi.cashSaleId = cs.id
                            ),
                            'price', cs.price,
                            'shippingCharges', cs.shippingCharges,
                            'discount', cs.discount,
                            'otherAdjustments', cs.otherAdjustments,
                            'total', cs.total,
                            'advanceAmount', cs.advanceAmount,
                            'balanceDue', cs.balanceDue,
                            'accountType', cs.accountType,
                            'customerNote', cs.customerNote,
                            'termsAndCondition', cs.termsAndCondition
                        )
                    )
                    FROM cashSales cs
                    WHERE cs.customerId = c.id 
                    AND YEAR(cs.invoiceDate) = hs.year 
                    AND MONTH(cs.invoiceDate) = hs.month
                )
            )
        )
        FROM (
            SELECT 
                cs.customerId,
                YEAR(cs.invoiceDate) AS year,
                MONTH(cs.invoiceDate) AS month,
                COUNT(cs.id) AS total_purchase,
                SUM(cs.total) AS total_amount
            FROM cashSales cs
            GROUP BY cs.customerId, YEAR(cs.invoiceDate), MONTH(cs.invoiceDate)
        ) hs
        WHERE hs.customerId = c.id
    ) AS monthly_data

FROM Customer c
INNER JOIN cashSales cs ON c.id = cs.customerId
WHERE
    invoiceDate BETWEEN ${startDate}
    AND ${endDate}
    AND (
        ${filter} = ''
        OR c.id LIKE ${filter}
        OR c.firstName LIKE ${filter}
        OR c.lastName LIKE ${filter}
    )
GROUP BY c.id;
`;

  const salesCustomerSummary = JSON.parse(
    JSON.stringify(pivotData, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

  const workbook = new ExcelJs.Workbook();
  const worksheet = workbook.addWorksheet("Sales Customer Summary");
  salesCustomerSummary.forEach((elem) => {
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
        "B2B/B2C",
        "ITEM NAME",
        "ITEM DESCRIPTION",
        "ITEM TYPE",
        "QUANTITY",
        "PRICE",
        "TOTAL",
        "SHIPPING",
        "DISCOUNT",
        "ADJUSTMENT",
        "TOTAL AMOUNT",
        "ADVANCE PAID",
        "BALANCE DUE",
        "ACCOUNT",
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
          tradeType,
          "",
          "",
          "",
          "",
          "",
          "",
          x.shippingCharges,
          x.discount,
          x.otherAdjustments,
          x.total,
          x.advanceAmount,
          x.balanceDue,
          x.accountType,
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
            z.name,
            z.description,
            z.type,
            z.quantity,
            z.price,
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
 * @desc		Get All Sales Summary Product Wise
 * @route		GET /api/v1/cashSales/summary/product
 * @access	private
 */
const salesProductSummary = async (req, res) => {
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
        csi.itemId AS item_id,  
        ci.name AS name,
        ci.validity AS validity,
        ci.description AS description,
        YEAR(cs.invoiceDate) AS year,
        MONTH(cs.invoiceDate) AS month,
        SUM(csi.quantity) AS total_purchase,
        SUM(csi.total) AS total_amount
    FROM cashSaleItems csi
    INNER JOIN cashSales cs ON csi.cashSaleId = cs.id
    INNER JOIN cashItems ci ON csi.itemId = ci.id
    WHERE
        cs.invoiceDate BETWEEN ${startDate} AND ${endDate}
        AND (
            ${filter} = ''
            OR csi.itemId LIKE ${filter}
        )
    GROUP BY csi.itemId, YEAR(cs.invoiceDate), MONTH(cs.invoiceDate)
)

SELECT 
    csi.itemId AS item_id,  
    ci.name AS name,
    ci.validity AS validity,
    ci.description AS description,
    SUM(csi.quantity) AS total_purchase,
    COALESCE(SUM(csi.total), 0) AS total_amount,
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'year', ms.year,
                'month', ms.month,
                'total_purchase', ms.total_purchase,
                'total_amount', ms.total_amount,
                'data',
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'invoiceNumber', cs.invoiceNumber,
                            'orderNumber', cs.orderNumber,
                            'invoiceDate', cs.invoiceDate,
                            'customer', 
                            JSON_OBJECT(
                                'id', c.id,
                                'customerType', c.customerType,
                                'salutation', c.salutation,
                                'firstName', c.firstName,
                                'lastName', c.lastName,
                                'email', c.email,
                                'mobile', c.mobile,
                                'businessLegalName', c.businessLegalName,
                                'placeOfSupply', c.placeOfSupply
                            ),
                            'items', (
                                SELECT 
                                    JSON_OBJECT(
                                        'itemId', csi2.itemId,
                                        'name', i.name,
                                        'description', i.description,
                                        'quantity', csi2.quantity,
                                        'price', csi2.price,
                                        'total', csi2.total
                                    )
                                FROM cashSaleItems csi2
                                INNER JOIN cashItems i ON csi2.itemId = i.id
                                WHERE csi2.cashSaleId = cs.id
                                  AND csi2.itemId = csi.itemId
                                  AND YEAR(cs.invoiceDate) = ms.year
                                  AND MONTH(cs.invoiceDate) = ms.month
                            )
                        )
                    )
                    FROM cashSales cs
                    INNER JOIN customer c ON cs.customerId = c.id
                    WHERE EXISTS (
                        SELECT 1 FROM cashSaleItems csi3 
                        WHERE csi3.cashSaleId = cs.id 
                        AND csi3.itemId = csi.itemId
                        AND YEAR(cs.invoiceDate) = ms.year
                        AND MONTH(cs.invoiceDate) = ms.month
                    )
                )
            )
        )
        FROM MonthlySales ms
        WHERE ms.item_id = csi.itemId
    ) AS monthly_data
FROM cashSaleItems csi
INNER JOIN cashSales cs ON csi.cashSaleId = cs.id
INNER JOIN cashItems ci ON csi.itemId = ci.id
WHERE
    cs.invoiceDate BETWEEN ${startDate} AND ${endDate}
    AND (
        ${filter} = ''
        OR csi.itemId LIKE ${filter}
    )
GROUP BY csi.itemId;
`;

  const salesProductSummary = JSON.parse(
    JSON.stringify(pivotData, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

  res.status(200).json(salesProductSummary);
};

/**
 * @desc		Download All Sales Summary Product Wise
 * @route		POST /api/v1/cashSales/download/summary/product
 * @access	private/admin
 */
const downloadSalesProductSummaryExcel = async (req, res) => {
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
        csi.itemId AS item_id,  
        ci.name AS name,
        ci.validity AS validity,
        ci.description AS description,
        YEAR(cs.invoiceDate) AS year,
        MONTH(cs.invoiceDate) AS month,
        SUM(csi.quantity) AS total_purchase,
        SUM(csi.total) AS total_amount
    FROM cashSaleItems csi
    INNER JOIN cashSales cs ON csi.cashSaleId = cs.id
    INNER JOIN cashItems ci ON csi.itemId = ci.id
    WHERE
        cs.invoiceDate BETWEEN ${startDate} AND ${endDate}
        AND (
            ${filter} = ''
            OR csi.itemId LIKE ${filter}
        )
    GROUP BY csi.itemId, YEAR(cs.invoiceDate), MONTH(cs.invoiceDate)
)

SELECT 
    csi.itemId AS item_id,  
    ci.name AS name,
    ci.validity AS validity,
    ci.description AS description,
    SUM(csi.quantity) AS total_purchase,
    COALESCE(SUM(csi.total), 0) AS total_amount,
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'year', ms.year,
                'month', ms.month,
                'total_purchase', ms.total_purchase,
                'total_amount', ms.total_amount,
                'data',
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'invoiceNumber', cs.invoiceNumber,
                            'orderNumber', cs.orderNumber,
                            'invoiceDate', cs.invoiceDate,
                            'customer', 
                            JSON_OBJECT(
                                'id', c.id,
                                'customerType', c.customerType,
                                'salutation', c.salutation,
                                'firstName', c.firstName,
                                'lastName', c.lastName,
                                'email', c.email,
                                'mobile', c.mobile,
                                'businessLegalName', c.businessLegalName,
                                'placeOfSupply', c.placeOfSupply
                            ),
                            'items', (
                                SELECT 
                                    JSON_OBJECT(
                                        'itemId', csi2.itemId,
                                        'name', i.name,
                                        'description', i.description,
                                        'quantity', csi2.quantity,
                                        'price', csi2.price,
                                        'total', csi2.total
                                    )
                                FROM cashSaleItems csi2
                                INNER JOIN cashItems i ON csi2.itemId = i.id
                                WHERE csi2.cashSaleId = cs.id
                                  AND csi2.itemId = csi.itemId
                                  AND YEAR(cs.invoiceDate) = ms.year
                                  AND MONTH(cs.invoiceDate) = ms.month
                            )
                        )
                    )
                    FROM cashSales cs
                    INNER JOIN customer c ON cs.customerId = c.id
                    WHERE EXISTS (
                        SELECT 1 FROM cashSaleItems csi3 
                        WHERE csi3.cashSaleId = cs.id 
                        AND csi3.itemId = csi.itemId
                        AND YEAR(cs.invoiceDate) = ms.year
                        AND MONTH(cs.invoiceDate) = ms.month
                    )
                )
            )
        )
        FROM MonthlySales ms
        WHERE ms.item_id = csi.itemId
    ) AS monthly_data
FROM cashSaleItems csi
INNER JOIN cashSales cs ON csi.cashSaleId = cs.id
INNER JOIN cashItems ci ON csi.itemId = ci.id
WHERE
    cs.invoiceDate BETWEEN ${startDate} AND ${endDate}
    AND (
        ${filter} = ''
        OR csi.itemId LIKE ${filter}
    )
GROUP BY csi.itemId;
`;

  const salesProductSummary = JSON.parse(
    JSON.stringify(pivotData, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

  const workbook = new ExcelJs.Workbook();
  const worksheet = workbook.addWorksheet("Sales Product Summary");
  salesProductSummary.forEach((elem) => {
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
        "B2B/B2C",
        "ITEM NAME",
        "ITEM DESCRIPTION",
        "QUANTITY",
        "PRICE",
        "TOTAL AMOUNT",
      ]);
      i.data.forEach((x) => {
        const name = `${x.customer.salutation} ${x.customer.firstName} ${x.customer.lastName}`;
        const tradeType = x.customer.gstNumber ? "B2B" : "B2C";
        const businessLegalName = x.customer.businessLegalName
          ? x.customer.businessLegalName
          : "---";

        worksheet.addRow([
          "",
          "",
          x.invoiceDate,
          x.invoiceNumber,
          name,
          businessLegalName,
          tradeType,
          x.items.name,
          x.items.description,
          x.items.quantity,
          x.items.price,
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
  addCashSale,
  updateCashSale,
  getCashSales,
  deleteCashSale,
  previewCashSaleInvoicePdf,
  downloadCashSaleInvoicePdf,
  sendInvoiceEmail,
  downloadCashSalesListPdf,
  downloadCashSalesListExcel,
  salesSummary,
  downloadSalesCustomerSummaryExcel,
  salesProductSummary,
  downloadSalesProductSummaryExcel,
};
