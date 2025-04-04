import { prisma } from "#config/db.config.js";
import { monthYearFormatter } from "#utils/dateTimeFormatter.js";
import { salesExcelGenerator } from "#utils/excelGenerator.js";

/**
 * @desc  Add GST Paid
 * @route  POST /api/v1/gstPaid
 * @access  private/admin
 */
const addGstPaid = async (req, res) => {
  const { dateOfPayment, monthOfGstPaid, amount, paymentMethod } = req.body;

  const gstPaid = await prisma.gstPaid.create({
    data: {
      userId: req.user.id,
      dateOfPayment: new Date(dateOfPayment),
      monthOfGstPaid: new Date(monthOfGstPaid),
      amount,
      paymentMethod,
    },
  });

  res.status(200).json(gstPaid);
};

/**
 * @desc  Get All Gst Paid
 * @route  GET /api/v1/gstPaid/:year
 * @access  private
 */
const getGstPaid = async (req, res) => {
  const year = +req.query.year;

  const gstPaid = await prisma.gstPaid.findMany({
    where: {
      monthOfGstPaid: {
        gte: new Date(`${year}-04-01`),
        lte: new Date(`${year + 1}-03-31`),
      },
    },
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
    orderBy: { monthOfGstPaid: "asc" },
  });

  res.status(200).json(gstPaid);
};

/**
 * @desc  Update GST Paid
 * @route  PUT /api/v1/gstPaid/:id
 * @access  private/admin
 */
const updateGstPaid = async (req, res) => {
  const { id } = req.params;

  const gstPaid = await prisma.gstPaid.findUnique({
    where: { id: Number(id) },
  });

  if (!gstPaid) {
    res.status(404);
    throw new Error("No GST Paid Record Found");
  }

  const { dateOfPayment, monthOfGstPaid, amount, paymentMethod } = req.body;

  const updatedGstPaid = await prisma.gstPaid.update({
    where: { id: Number(id) },
    data: {
      userId: req.user.id,
      dateOfPayment: new Date(dateOfPayment),
      monthOfGstPaid: new Date(monthOfGstPaid),
      amount,
      paymentMethod,
    },
  });

  res.status(200).json(updatedGstPaid);
};

/**
 * @desc		Delete GST Paid
 * @route		DELETE /api/v1/gstPaid/:id
 * @access	private/admin
 */
const deleteGstPaid = async (req, res) => {
  const { id } = req.params;

  const gstPaid = await prisma.gstPaid.findUnique({
    where: { id: Number(id) },
  });

  if (!gstPaid) {
    res.status(404);
    throw new Error("Gst Paid Not Found");
  }

  await prisma.gstPaid.delete({ where: { id: Number(id) } });
  res.status(200).json({ message: "Gst Paid Deleted Sucessfully" });
};

/**
 * @desc		Downlaod Excel File
 * @route		POST /api/v1/gstPaid/download/excel
 * @access	private/admin
 */
const downloadGstPaidListExcel = async (req, res) => {
  const year = +req.query.year;

  const gstPaidData = await prisma.gstPaid.findMany({
    where: {
      monthOfGstPaid: {
        gte: new Date(`${year}-04-01`),
        lte: new Date(`${year + 1}-03-31`),
      },
    },
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
    orderBy: { monthOfGstPaid: "asc" },
  });

  const header = [
    { header: "DATE OF PAYMENT", key: "dateOfPayment", width: 15 },
    { header: "GST PAID MONTH", key: "monthOfGstPaid", width: 15 },
    { header: "AMOUNT", key: "amount", width: 15 },
    { header: "PAYMENT METHOD", key: "paymentMethod", width: 30 },
  ];

  const refactoredGstPaidData = gstPaidData.map((data) => {
    const monthOfGstPaid = monthYearFormatter(data?.monthOfGstPaid);

    return {
      ...data,
      monthOfGstPaid,
    };
  });

  const excel = await salesExcelGenerator({
    workSheetName: "GST Paid",
    header,
    data: refactoredGstPaidData,
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "inline; filename=data.xlsx");
  res.send(excel);
};

export {
  addGstPaid,
  getGstPaid,
  updateGstPaid,
  deleteGstPaid,
  downloadGstPaidListExcel,
};
