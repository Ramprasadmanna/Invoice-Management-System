import { prisma } from "#config/db.config.js";
import { excelGenerator } from "#utils/excelGenerator.js";
import pdfGenerator from "#utils/pdfGenerator.js";
import path from "path";

/**
 * @desc  Create New GST Item
 * @route  POST /api/v1/gstItem
 * @access  private/admin
 */
const addGstItems = async (req, res) => {
  const {
    type,
    name,
    validity,
    hsnsacCode,
    rate,
    gstSlab,
    gstAmount,
    cgst,
    sgst,
    igst,
    total,
    description,
  } = req.body;

  const gstItem = await prisma.gstItems.create({
    data: {
      type: type.toLowerCase(),
      name: name.toLowerCase(),
      validity,
      hsnsacCode: hsnsacCode.toUpperCase(),
      rate,
      gstSlab,
      gstAmount,
      cgst,
      sgst,
      igst,
      total,
      description,
      userId: req.user.id,
    },
  });

  if (gstItem) {
    res.json(gstItem);
  } else {
    res.status(400);
    throw new Error("GST Item Creation Failed");
  }
};

/**
 * @desc		Get All GST Items
 * @route		GET /api/v1/gstItem
 * @access	private
 */
const getGstItems = async (req, res) => {
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

  const count = await prisma.gstItems.count({ where: searchFilters });

  const gstItems = await prisma.gstItems.findMany({
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

  res.status(200).json({ gstItems, pageNumber, pages });
};

/**
 * @desc		Get Search GST Items (No Pagination)
 * @route		GET /api/v1/gstItem/search
 * @param  {string} [keyword] - Required keyword
 * @access	private
 */
const searchGstItems = async (req, res) => {
  const keyword = req.query.keyword?.trim();

  if (keyword) {
    const searchFilters = {
      OR: [
        { name: { contains: keyword } },
        { hsnsacCode: { contains: keyword } },
        { description: { contains: keyword } },
      ],
    };

    const gstItems = await prisma.gstItems.findMany({
      where: searchFilters,
    });

    res.status(200).json(gstItems);
  } else {
    res.status(200).json([]);
  }
};

/**
 * @desc		Update GST Item
 * @route		PUT /api/v1/gstItem/:id
 * @access	private/admin
 */
const updateGstItem = async (req, res) => {
  const { id } = req.params;
  const gstItem = await prisma.gstItems.findUnique({
    where: { id: Number(id) },
  });

  if (!gstItem) {
    res.status(404);
    throw new Error("GstItem Not Found");
  }

  const {
    type,
    name,
    validity,
    hsnsacCode,
    rate,
    gstSlab,
    gstAmount,
    cgst,
    sgst,
    igst,
    total,
    description,
  } = req.body;

  const updatedGstItems = await prisma.gstItems.update({
    where: { id: Number(id) },
    data: {
      type: type.toLowerCase(),
      name: name.toLowerCase(),
      validity,
      hsnsacCode: hsnsacCode.toUpperCase(),
      rate,
      gstSlab,
      gstAmount,
      cgst,
      sgst,
      igst,
      total,
      description,
    },
  });

  res.status(200).json(updatedGstItems);
};

/**
 * @desc		Delete GST Item
 * @route		DELETE /api/v1/gstItem/:id
 * @access	private/admin
 */
const deleteGstItem = async (req, res) => {
  const { id } = req.params;
  const gstItem = await prisma.gstItems.findUnique({
    where: { id: Number(id) },
  });
  
  if (!gstItem) {
    res.status(404);
    throw new Error("Gst Item Not Found");
  }

  await prisma.gstItems.delete({ where: { id: Number(id) } });
  res.status(200).json({ message: "GstItem Deleted Sucessfully" });
};

/**
 * @desc		Downlaod All Gst Items List PDF File
 * @route		POST /api/v1/gstItem/download/pdf
 * @access	private/admin
 */
const downloadGstItemsListPdf = async (req, res) => {
  try {
    const filePath = path.resolve("server/data/PdfTemplate/gstItemTable.html");

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

    const gstItems = await prisma.gstItems.findMany({
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

    const pdfbuffer = await pdfGenerator({ filePath, data: gstItems });

    res.status(200);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=ItemsList.pdf",
    });
    res.send(pdfbuffer);
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error({ message: "Download Failed", error: error.message });
  }
};

/**
 * @desc		Downlaod All Gst Items List Excel File
 * @route		POST /api/v1/gstItem/download/excel
 * @access	private/admin
 */
const downloadGstItemsListExcel = async (req, res) => {
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

  const gstItems = await prisma.gstItems.findMany({
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
    { header: "HSN/SAC", key: "hsnsacCode", width: 15 },
    { header: "GST %", key: "gstSlab", width: 10 },
    { header: "RATE", key: "rate", width: 20 },
    { header: "CGST", key: "cgst", width: 20 },
    { header: "SGST", key: "sgst", width: 20 },
    { header: "IGST", key: "igst", width: 20 },
    { header: "TOTAL", key: "total", width: 20 },
    { header: "DESCRIPTION", key: "description", width: 30 },
    { header: "ID", key: "id", width: 10 },
    { header: "CREATED BY", key: "createdBy", width: 25 },
    { header: "CREATED AT", key: "createdAt", width: 25 },
    { header: "UPDATED AT", key: "updatedAt", width: 25 },
  ];

  const refactoredData = gstItems.map((item) => {
    const { name, isAdmin } = item.user;
    return {
      ...item,
      createdBy: `${name} | Admin`,
    };
  });

  const excel = await excelGenerator({
    workSheetName: "GST Items",
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
  addGstItems,
  getGstItems,
  searchGstItems,
  updateGstItem,
  deleteGstItem,
  downloadGstItemsListPdf,
  downloadGstItemsListExcel,
};
