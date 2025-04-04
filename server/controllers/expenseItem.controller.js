import { prisma } from "#config/db.config.js";
import { excelGenerator } from "#utils/excelGenerator.js";

/**
 * @desc  Create New Expense Item
 * @route  POST /api/v1/expenseItems/
 * @access  private/admin
 */
const addExpenseItem = async (req, res) => {
  const { name } = req.body;

  const existingItem = await prisma.expenseItems.findUnique({
    where: { name: name.toLowerCase() },
  });

  if (existingItem) {
    res.status(400);
    throw new Error("Item Already Added");
  }

  const item = await prisma.expenseItems.create({
    data: {
      userId: req.user.id,
      name: name.toLowerCase(),
    },
  });

  res.status(200).json(item);
};

/**
 * @desc  Get All Expense Item
 * @route  GET /api/v1/expenseItems/
 * @access  private
 */
const getExpenseItem = async (req, res) => {
  const pageSize = +req.query.pageSize || 2;
  const pageNumber = +req.query.pageNumber || 1;
  const keyword = req.query.keyword?.trim();

  const searchFilters = keyword
    ? {
        OR: [{ name: { contains: keyword } }],
      }
    : {};

  const count = await prisma.expenseItems.count({ where: searchFilters });

  const expenseItems = await prisma.expenseItems.findMany({
    where: searchFilters,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          isAdmin: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: pageSize,
    skip: pageSize * (pageNumber - 1),
  });

  const pages = Math.ceil(count / pageSize);

  res.status(200).json({ expenseItems, pageNumber, pages });
};

/**
 * @desc		Get Search Expense Items (No Pagination)
 * @route		GET /api/v1/expenseItem/search
 * @param  {string} [keyword] - Required keyword
 * @access	private
 */
const searchExpenseItemItems = async (req, res) => {
  const keyword = req.query.keyword?.trim();

  if (keyword) {
    const searchFilters = {
      OR: [{ name: { contains: keyword } }],
    };

    const gstExpenseItems = await prisma.expenseItems.findMany({
      where: searchFilters,
    });

    res.status(200).json(gstExpenseItems);
  } else {
    res.status(200).json([]);
  }
};

/**
 * @desc		Update GST Expense Item
 * @route		PUT /api/v1/expenseItem/:id
 * @access	private/admin
 */
const updateExpenseItem = async (req, res) => {
  const { id } = req.params;

  const gstExpenseItem = await prisma.expenseItems.findUnique({
    where: { id: Number(id) },
  });

  if (!gstExpenseItem) {
    res.status(400);
    throw new Error("Expense Item Not Found.");
  }

  const { name } = req.body;

  const updatedExpenseItem = await prisma.expenseItems.update({
    where: { id: Number(id) },
    data: {
      name: name.toLowerCase(),
    },
  });

  res.status(200).json(updatedExpenseItem);
};

/**
 * @desc		Delete Expense Item
 * @route		DELETE /api/v1/expenseItem/:id
 * @access	private/admin
 */
const deleteExpenseItem = async (req, res) => {
  const { id } = req.params;

  const expenseItem = await prisma.expenseItems.findUnique({
    where: { id: Number(id) },
  });

  if (!expenseItem) {
    res.status(400);
    throw new Error("Expense Item Not Found.");
  }

  await prisma.expenseItems.delete({ where: { id: Number(id) } });
  res.status(200).json({ message: "Expense Item Deleted Sucessfully" });
};

/**
 * @desc		Downlaod All Expense Items Excel File
 * @route		POST /api/v1/expenseItem/download/excel
 * @access	private/admin
 */
const downloadExpenseItemsListExcel = async (req, res) => {
  const pageSize = +req.query.pageSize || 2;
  const pageNumber = +req.query.pageNumber || 1;
  const keyword = req.query.keyword?.trim();

  const searchFilters = keyword
    ? {
        OR: [{ name: { contains: keyword } }],
      }
    : {};

  const expenseItems = await prisma.expenseItems.findMany({
    where: searchFilters,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          isAdmin: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: pageSize,
    skip: pageSize * (pageNumber - 1),
  });

  const header = [
    { header: "ITEM NAME", key: "name", width: 15 },
    { header: "ITEM ID", key: "id", width: 10 },
    { header: "CREATED AT", key: "createdAt", width: 10 },
    { header: "UPDATED AT", key: "updatedAt", width: 10 },
  ];

  const excel = await excelGenerator({
    workSheetName: "Expense Items",
    header,
    data: expenseItems,
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "inline; filename=data.xlsx");
  res.send(excel);
};

export {
  addExpenseItem,
  getExpenseItem,
  searchExpenseItemItems,
  updateExpenseItem,
  deleteExpenseItem,
  downloadExpenseItemsListExcel,
};
