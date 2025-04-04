import path from "path";
import { pdfGenerator } from "#utils/pdfGenerator.js";
import { excelGenerator } from "#utils/excelGenerator.js";
import { prisma } from "#config/db.config.js";

/**
 * @desc  Create New Item
 * @route  POST /api/v1/cashItem
 * @access  private/admin
 */
const addItems = async (req, res) => {
  const { type, name, validity, price, description } = req.body;

  const item = await prisma.cashItems.create({
    data: {
      type: type.toLowerCase(),
      name: name.toLowerCase(),
      validity,
      price,
      description,
      userId: req.user.id,
    },
  });

  if (item) {
    res.json(item);
  } else {
    res.status(400);
    throw new Error("Item Creation Failed");
  }
};

/**
 * @desc		Get All Items
 * @route		GET /api/v1/cashItem
 * @access	private
 */
const getItems = async (req, res) => {
  const pageSize = +req.query.pageSize || 2;
  const pageNumber = +req.query.pageNumber || 1;
  const keyword = req.query.keyword?.trim();

  const searchFilters = keyword
    ? {
        OR: [
          { name: { contains: keyword } },
          { description: { contains: keyword } },
        ],
      }
    : {};

  const count = await prisma.cashItems.count({ where: searchFilters });

  const items = await prisma.cashItems.findMany({
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

  res.status(200).json({ items, pageNumber, pages });
};

/**
 * @desc		Get Search Items (No Pagination)
 * @route		GET /api/v1/cashItem/search
 * @param  {string} [keyword] - Required keyword
 * @access	private
 */
const searchItems = async (req, res) => {
  const keyword = req.query.keyword?.trim();

  if (keyword) {
    const searchFilters = {
      OR: [
        { name: { contains: keyword } },
        { description: { contains: keyword } },
      ],
    };

    const items = await prisma.cashItems.findMany({
      where: searchFilters,
    });

    res.status(200).json(items);
  } else {
    res.status(200).json([]);
  }
};

/**
 * @desc		Update Item
 * @route		PUT /api/v1/cashItem/:id
 * @access	private/admin
 */
const updateItem = async (req, res) => {
  const { id } = req.params;

  const item = await prisma.cashItems.findUnique({
    where: { id: Number(id) },
  });

  if (!item) {
    res.status(404);
    throw new Error("Item Not Found");
  }

  const { type, name, validity, price, description } = req.body;

  const updatedItem = await prisma.cashItems.update({
    where: { id: Number(id) },
    data: {
      type: type.toLowerCase(),
      name: name.toLowerCase(),
      validity,
      price,
      description,
    },
  });

  res.status(200).json(updatedItem);
};

/**
 * @desc		Delete Item
 * @route		DELETE /api/v1/cashItem/:id
 * @access	private/admin
 */
const deleteItem = async (req, res) => {
  const { id } = req.params;
  const item = await prisma.cashItems.findUnique({
    where: { id: Number(id) },
  });

  if (!item) {
    res.status(404);
    throw new Error("Item Not Found");
  }

  await prisma.cashItems.delete({ where: { id: Number(id) } });
  res.status(200).json({ message: "Item Deleted Sucessfully" });
};

/**
 * @desc		Downlaod All Items List PDF File
 * @route		POST /api/v1/cashItem/download/pdf
 * @access	private/admin
 */
const downloadItemsListPdf = async (req, res) => {
  try {
    const filePath = path.resolve("server/data/PdfTemplate/cashItemTable.ejs");

    const pageSize = +req.query.pageSize || 2;
    const pageNumber = +req.query.pageNumber || 1;
    const keyword = req.query.keyword?.trim();

    const searchFilters = keyword
      ? {
          OR: [
            { name: { contains: keyword } },
            { hsnsacCode: { contains: keyword } },
            { description: { contains: keyword } },
          ],
        }
      : {};

    const items = await prisma.cashItems.findMany({
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

    const pdfBuffer = await pdfGenerator({ filePath, data: items });

    res.status(200);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=CashItemsList.pdf",
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error({ message: "Download Failed", error: error.message });
  }
};

/**
 * @desc		Downlaod All Items List Excel File
 * @route		POST /api/v1/cashItem/download/excel
 * @access	private/admin
 */
const downloadItemsListExcel = async (req, res) => {
  const pageSize = +req.query.pageSize || 2;
  const pageNumber = +req.query.pageNumber || 1;
  const keyword = req.query.keyword?.trim();

  const searchFilters = keyword
    ? {
        OR: [
          { name: { contains: keyword } },
          { hsnsacCode: { contains: keyword } },
          { description: { contains: keyword } },
        ],
      }
    : {};

  const items = await prisma.cashItems.findMany({
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
    { header: "NAME", key: "name", width: 40 },
    { header: "VALIDITY (Days)", key: "validity", width: 20 },
    { header: "TYPE", key: "type", width: 15 },
    { header: "PRICE", key: "price", width: 15 },
    { header: "DESCRIPTION", key: "description", width: 30 },
    { header: "ID", key: "id", width: 10 },
    { header: "CREATED BY", key: "createdBy", width: 25 },
    { header: "CREATED AT", key: "createdAt", width: 25 },
    { header: "UPDATED AT", key: "updatedAt", width: 25 },
  ];

  const refactoredData = items.map((item) => {
    const { name, isAdmin } = item.user;
    return {
      ...item,
      createdBy: `${name} | Admin`,
    };
  });

  const excel = await excelGenerator({
    workSheetName: "Items",
    header,
    data: refactoredData,
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=data.xlsx");
  res.send(excel);
};

export {
  addItems,
  getItems,
  searchItems,
  updateItem,
  deleteItem,
  downloadItemsListPdf,
  downloadItemsListExcel,
};
