import { prisma } from "#config/db.config.js";
import { excelGenerator } from "#utils/excelGenerator.js";

/**
 * @desc  Create New GST Purchase Item
 * @route  POST /api/v1/gstPurchaseItem/
 * @access  private/admin
 */
const addGstPurchaseItem = async (req, res) => {
  const { type, name, companyName, state, gstNumber } = req.body;

  const existingCompany = await prisma.gstPurchaseItems.findUnique({
    where: { companyName: companyName.toLowerCase() },
  });

  if (existingCompany) {
    res.status(400);
    throw new Error("Company Name Cannot Be Same");
  }

  const item = await prisma.gstPurchaseItems.create({
    data: {
      userId: req.user.id,
      type: type.toLowerCase(),
      name: name.toLowerCase(),
      companyName: companyName.toLowerCase(),
      state,
      gstNumber,
    },
  });

  res.status(200).json(item);
};

/**
 * @desc  Get All GST Purchase Item
 * @route  GET /api/v1/gstPurchaseItem/
 * @access  private
 */
const getGstPurchaseItem = async (req, res) => {
  const pageSize = +req.query.pageSize || 2;
  const pageNumber = +req.query.pageNumber || 1;
  const keyword = req.query.keyword?.trim();

  const searchFilters = keyword
    ? {
        OR: [
          { name: { contains: keyword } },
          { companyName: { contains: keyword } },
          { gstNumber: { contains: keyword } },
          { state: { contains: keyword } },
        ],
      }
    : {};

  const count = await prisma.gstPurchaseItems.count({ where: searchFilters });

  const gstPurchaseItems = await prisma.gstPurchaseItems.findMany({
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

  res.status(200).json({ gstPurchaseItems, pageNumber, pages });
};

/**
 * @desc		Get Search Purchase Items (No Pagination)
 * @route		GET /api/v1/gstPurchaseItem/search
 * @param  {string} [keyword] - Required keyword
 * @access	private
 */
const searchGstPurchaseItems = async (req, res) => {
  const keyword = req.query.keyword?.trim();

  if (keyword) {
    const searchFilters = {
      OR: [
        { name: { contains: keyword } },
        { companyName: { contains: keyword } },
        { state: { contains: keyword } },
        { gstNumber: { contains: keyword } },
      ],
    };

    const gstPurchaseItems = await prisma.gstPurchaseItems.findMany({
      where: searchFilters,
    });

    res.status(200).json(gstPurchaseItems);
  } else {
    res.status(200).json([]);
  }
};

/**
 * @desc		Update GST Purchase Item
 * @route		PUT /api/v1/gstPurchaseItem/:id
 * @access	private/admin
 */
const updateGstPurchaseItem = async (req, res) => {
  const { id } = req.params;

  const gstPurchaseItem = await prisma.gstPurchaseItems.findUnique({
    where: { id: Number(id) },
  });

  if (!gstPurchaseItem) {
    res.status(400);
    throw new Error("Gst Purchase Item Not Found.");
  }

  const { type, name, companyName, state, gstNumber } = req.body;

  const updatedGstPurchaseItem = await prisma.gstPurchaseItems.update({
    where: { id: Number(id) },
    data: {
      userId: req.user.id,
      type: type.toLowerCase(),
      name: name.toLowerCase(),
      companyName: companyName.toLowerCase(),
      state,
      gstNumber,
    },
  });

  res.status(200).json(updatedGstPurchaseItem);
};

/**
 * @desc		Delete GST Purchase Item
 * @route		DELETE /api/v1/gstPurchaseItem/:id
 * @access	private/admin
 */
const deleteGstPurchaseItem = async (req, res) => {
  const { id } = req.params;

  const gstPurchaseItem = await prisma.gstPurchaseItems.findUnique({
    where: { id: Number(id) },
  });

  if (!gstPurchaseItem) {
    res.status(400);
    throw new Error("Gst Purchase Item Not Found.");
  }

  await prisma.gstPurchaseItems.delete({ where: { id: Number(id) } });
  res.status(200).json({ message: "GST Purchase Item Deleted Sucessfully" });
};

/**
 * @desc		Downlaod All GST Purchase Items Excel File
 * @route		POST /api/v1/gstPurchaseItem/download/excel
 * @access	private/admin
 */
const downloadGstPurchaseItemsListExcel = async (req, res) => {
  const pageSize = +req.query.pageSize || 2;
  const pageNumber = +req.query.pageNumber || 1;
  const keyword = req.query.keyword?.trim();

  const searchFilters = keyword
    ? {
        OR: [
          { name: { contains: keyword } },
          { companyName: { contains: keyword } },
          { gstNumber: { contains: keyword } },
          { state: { contains: keyword } },
        ],
      }
    : {};

  const gstPurchaseItems = await prisma.gstPurchaseItems.findMany({
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
    { header: "ITEM TYPE", key: "type", width: 15 },
    { header: "COMPANY NAME", key: "companyName", width: 15 },
    { header: "STATE", key: "state", width: 30 },
    { header: "GSTIN", key: "gstNumber", width: 30 },
    { header: "COMPANY ID", key: "id", width: 10 },
    { header: "CREATED AT", key: "createdAt", width: 10 },
    { header: "UPDATED AT", key: "updatedAt", width: 10 },
  ];

  const excel = await excelGenerator({
    workSheetName: "GST Purchase Items",
    header,
    data: gstPurchaseItems,
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "inline; filename=data.xlsx");
  res.send(excel);
};

export {
  addGstPurchaseItem,
  getGstPurchaseItem,
  searchGstPurchaseItems,
  updateGstPurchaseItem,
  deleteGstPurchaseItem,
  downloadGstPurchaseItemsListExcel,
};
