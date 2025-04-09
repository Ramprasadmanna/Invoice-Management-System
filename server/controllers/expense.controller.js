import { prisma } from "#config/db.config.js";
import { excelGenerator } from "#utils/excelGenerator.js";
import ExcelJs from "exceljs";
import month from "#data/month.js";

/**
 * @desc  Create New Expense
 * @route  POST /api/v1/expense/
 * @access  private/admin
 */
const addExpense = async (req, res) => {
  const { item, expenseDate, quantity, remarks, price, paymentMethod } =
    req.body;

  const expense = await prisma.expenses.create({
    data: {
      userId: req.user.id,
      itemId: item,
      expenseDate: new Date(expenseDate),
      quantity,
      price,
      remarks,
      paymentMethod,
    },
  });

  if (expense) {
    res.json(expense);
  } else {
    res.status(400);
    throw new Error("Expense Creation Failed");
  }
};

/**
 * @desc		Get All Expenses
 * @route		GET /api/v1/expense/
 * @access	private
 */
const getExpense = async (req, res) => {
  const pageSize = +req.query.pageSize || 2;
  const pageNumber = +req.query.pageNumber || 1;

  const { keyword, fromDate, toDate } = req.query;

  const filter = {
    AND: [],
  };

  if (keyword) {
    filter.AND.push({
      OR: [{ item: { name: { contains: keyword } } }],
    });
  }

  if (fromDate && toDate) {
    filter.AND.push({
      expenseDate: {
        gte: new Date(fromDate),
        lte: new Date(toDate),
      },
    });
  }

  const count = await prisma.expenses.count({ where: filter });

  const expensesData = await prisma.expenses.findMany({
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

  res.status(200).json({ expensesData, pageNumber, pages });
};

/**
 * @desc  Update Expense
 * @route  PUT /api/v1/expense/:id
 * @access  private/admin
 */
const updateExpense = async (req, res) => {
  const { id } = req.params;

  const expense = await prisma.expenses.findUnique({
    where: { id: Number(id) },
  });

  if (!expense) {
    res.status(400);
    throw new Error("No Expense Found.");
  }

  const { item, expenseDate, quantity, remarks, price, paymentMethod } =
    req.body;

  const updatedExpense = await prisma.expenses.update({
    where: { id: Number(id) },
    data: {
      itemId: item,
      expenseDate: new Date(expenseDate),
      quantity,
      price,
      remarks,
      paymentMethod,
    },
  });

  res.status(200).json(updatedExpense);
};

/**
 * @desc  Delete Expense
 * @route  DELETE /api/v1/expense/:id
 * @access  private/admin
 */
const deleteExpense = async (req, res) => {
  const { id } = req.params;

  const expense = await prisma.expenses.findUnique({
    where: { id: Number(id) },
  });

  if (!expense) {
    res.status(400);
    throw new Error("No Expense Found.");
  }

  await prisma.expenses.delete({ where: { id: Number(id) } });
  res.status(200).json({ message: "Expense Deleted Sucessfully" });
};

/**
 * @desc		Downlaod All Expense List Excel File
 * @route		POST /api/v1/expense/download/excel
 * @access	private/admin
 */
const downloadExpenseExcel = async (req, res) => {
  const pageSize = +req.query.pageSize || 2;
  const pageNumber = +req.query.pageNumber || 1;

  const { keyword, fromDate, toDate } = req.query;

  const filter = {
    AND: [],
  };

  if (keyword) {
    filter.AND.push({
      OR: [{ item: { name: { contains: keyword } } }],
    });
  }

  if (fromDate && toDate) {
    filter.AND.push({
      expenseDate: {
        gte: new Date(fromDate),
        lte: new Date(toDate),
      },
    });
  }

  const expensesData = await prisma.expenses.findMany({
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
    { header: " EXPENSE DATE", key: "expenseDate", width: 15 },
    { header: "ITEM NAME", key: "name", width: 15 },
    { header: "PRICE", key: "price", width: 15 },
    { header: "PAYMENT METHOD", key: "paymentMethod", width: 15 },
    { header: "QUANTITY", key: "quantity", width: 10 },
    { header: "REMARKS", key: "remarks", width: 10 },
    { header: "CREATED AT", key: "createdAt", width: 10 },
    { header: "UPDATED AT", key: "updatedAt", width: 10 },
  ];

  const refactoredExpenseData = expensesData.map((elem) => {
    return {
      ...elem,
      name: elem?.item?.name,
    };
  });

  const excel = await excelGenerator({
    workSheetName: "Expense",
    header,
    data: refactoredExpenseData,
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "inline; filename=data.xlsx");
  res.send(excel);
};

/**
 * @desc		Get All Expense Summary Expense Item Name Wise
 * @route		GET /api/v1/expense/summary/item
 * @access	private
 */
const expenseItemSummary = async (req, res) => {
  const keyword = req.query.itemId?.trim();
  const financialYear = Number(req.query.year);

  if (!financialYear) {
    res.status(400);
    throw new Error("Invalid Financial Year");
  }

  const startDate = `${financialYear}-04-01`;
  const endDate = `${financialYear + 1}-03-31`;
  const filter = keyword ? `${keyword}\%` : "";

  const pivotData = await prisma.$queryRaw`
  WITH MonthlyExpenses AS (
    SELECT
        e.itemId AS item_id,  
        YEAR(e.expenseDate) AS year,
        MONTH(e.expenseDate) AS month,
        COUNT(*) AS total_expenses,
        SUM(e.quantity) AS total_quantity,
        SUM(e.price) AS total_price
    FROM expenses e
    WHERE
        e.expenseDate BETWEEN ${startDate} AND ${endDate}
    GROUP BY e.itemId, YEAR(e.expenseDate), MONTH(e.expenseDate)
)

SELECT 
    ei.id AS _id,  
    ei.name AS name,
    COUNT(e.id) AS total_expenses,
    COALESCE(SUM(e.quantity), 0) AS total_quantity,
    COALESCE(SUM(e.price), 0) AS total_price,
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'year', me.year,
                'month', me.month,
                'total_expenses', me.total_expenses,
                'total_quantity', me.total_quantity,
                'total_price', me.total_price,
                'data',
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            '_id', e2.id,
                            'expenseDate', e2.expenseDate,
                            'quantity', e2.quantity,
                            'price', e2.price,
                            'paymentMethod', e2.paymentMethod,
                            'remarks', e2.remarks,
                            'createdAt', e2.createdAt,
                            'updatedAt', e2.updatedAt
                        )
                    )
                    FROM expenses e2
                    WHERE e2.itemId = ei.id
                      AND YEAR(e2.expenseDate) = me.year
                      AND MONTH(e2.expenseDate) = me.month
                )
            )
        )
        FROM MonthlyExpenses me
        WHERE me.item_id = ei.id
    ) AS monthly_data
FROM expenses e
INNER JOIN expenseItems ei ON e.itemId = ei.id
WHERE
    e.expenseDate BETWEEN ${startDate} AND ${endDate}
    AND (
        ${filter} = ''
        OR ei.id LIKE ${filter}
    )
GROUP BY ei.id;

  `;

  const expenseItemSummary = JSON.parse(
    JSON.stringify(pivotData, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

  res.status(200).json(expenseItemSummary);
};

/**
 * @desc		Download All Expense Summary Expense Item Name Wise Excel
 * @route		POST /api/v1/expense/download/summary/item
 * @access	private/admin
 */
const downloadExpenseItemSummarySummaryExcel = async (req, res) => {
  const keyword = req.query.itemId?.trim();
  const financialYear = Number(req.query.year);

  if (!financialYear) {
    res.status(400);
    throw new Error("Invalid Financial Year");
  }

  const startDate = `${financialYear}-04-01`;
  const endDate = `${financialYear + 1}-03-31`;
  const filter = keyword ? `${keyword}\%` : "";

  const pivotData = await prisma.$queryRaw`
  WITH MonthlyExpenses AS (
    SELECT
        e.itemId AS item_id,  
        YEAR(e.expenseDate) AS year,
        MONTH(e.expenseDate) AS month,
        COUNT(*) AS total_expenses,
        SUM(e.quantity) AS total_quantity,
        SUM(e.price) AS total_price
    FROM expenses e
    WHERE
        e.expenseDate BETWEEN ${startDate} AND ${endDate}
    GROUP BY e.itemId, YEAR(e.expenseDate), MONTH(e.expenseDate)
)

SELECT 
    ei.id AS _id,  
    ei.name AS name,
    COUNT(e.id) AS total_expenses,
    COALESCE(SUM(e.quantity), 0) AS total_quantity,
    COALESCE(SUM(e.price), 0) AS total_price,
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'year', me.year,
                'month', me.month,
                'total_expenses', me.total_expenses,
                'total_quantity', me.total_quantity,
                'total_price', me.total_price,
                'data',
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            '_id', e2.id,
                            'expenseDate', e2.expenseDate,
                            'quantity', e2.quantity,
                            'price', e2.price,
                            'paymentMethod', e2.paymentMethod,
                            'remarks', e2.remarks,
                            'createdAt', e2.createdAt,
                            'updatedAt', e2.updatedAt
                        )
                    )
                    FROM expenses e2
                    WHERE e2.itemId = ei.id
                      AND YEAR(e2.expenseDate) = me.year
                      AND MONTH(e2.expenseDate) = me.month
                )
            )
        )
        FROM MonthlyExpenses me
        WHERE me.item_id = ei.id
    ) AS monthly_data
FROM expenses e
INNER JOIN expenseItems ei ON e.itemId = ei.id
WHERE
    e.expenseDate BETWEEN ${startDate} AND ${endDate}
    AND (
        ${filter} = ''
        OR ei.id LIKE ${filter}
    )
GROUP BY ei.id;

  `;

  const expenseItemSummary = JSON.parse(
    JSON.stringify(pivotData, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

  const workbook = new ExcelJs.Workbook();
  const worksheet = workbook.addWorksheet("Expense Item Summary");
  expenseItemSummary.forEach((elem) => {
    worksheet.addRow();
    worksheet.addRow([
      elem?.name,
      "",
      "Total Expense",
      elem?.total_expenses,
      "",
      "Total Amount",
      elem?.total_price,
    ]);

    elem.monthly_data.forEach((i) => {
      worksheet.addRow();
      worksheet.addRow([
        "",
        `${month[i.month]} ${i.year}`,
        "Total Purchase",
        i.total_expenses,
        "",
        "Total Amount",
        i.total_price,
      ]);
      worksheet.addRow();
      worksheet.addRow([
        "",
        "",
        "EXPENSE DATE",
        "NAME",
        "PRICE",
        "PAYMENT METHOD",
        "QUANTITY",
        "REMARKS",
      ]);
      i.data.forEach((x) => {
        worksheet.addRow([
          "",
          "",
          x.expenseDate,
          elem.name,
          x.price,
          x.paymentMethod,
          x.quantity,
          x.remarks,
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
  addExpense,
  getExpense,
  updateExpense,
  deleteExpense,
  downloadExpenseExcel,
  expenseItemSummary,
  downloadExpenseItemSummarySummaryExcel,
};
