import pdfGenerator from "#utils/pdfGenerator.js";
import { excelGenerator } from "#utils/excelGenerator.js";
import path from "path";
import { prisma } from "#config/db.config.js";

/**
 * @desc		Create New Customer
 * @route		POST /api/v1/customer
 * @access	private/admin
 */
const addCustomer = async (req, res) => {
  const {
    customerType,
    salutation,
    firstName,
    lastName,
    email,
    workPhone,
    mobile,
    businessLegalName,
    gstNumber,
    placeOfSupply,
    billingCountry,
    billingState,
    billingCity,
    billingAddress,
    billingZipcode,
    shippingCountry,
    shippingState,
    shippingCity,
    shippingAddress,
    shippingZipcode,
  } = req.body;

  const existingUser = await prisma.customer.findUnique({
    where: { email },
  });

  if (existingUser) {
    res.status(404);
    throw new Error("Customer Already Exist");
  }

  const customer = await prisma.customer.create({
    data: {
      customerType: customerType.toLowerCase(),
      salutation: salutation.toLowerCase(),
      firstName: firstName.toLowerCase(),
      lastName: lastName.toLowerCase(),
      email: email.toLowerCase(),
      businessLegalName: businessLegalName?.toLowerCase(),
      workPhone,
      mobile,
      gstNumber,
      placeOfSupply,
      billingCountry,
      billingState,
      billingCity,
      billingAddress,
      billingZipcode,
      shippingCountry,
      shippingState,
      shippingCity,
      shippingAddress,
      shippingZipcode,
    },
  });

  if (customer) {
    res.json(customer);
  } else {
    res.status(400);
    throw new Error("Invalid Customer Data");
  }
};

/**
 * @desc		Get All Customers
 * @route		GET /api/v1/customer
 * @access	private
 */
const getCustomers = async (req, res) => {
  const pageSize = +req.query.pageSize || 2;
  const pageNumber = +req.query.pageNumber || 1;
  const keyword = req.query.keyword?.trim();

  const searchFilters = keyword
    ? {
        OR: [
          { firstName: { contains: keyword } },
          { lastName: { contains: keyword } },
          { email: { contains: keyword } },
          { businessLegalName: { contains: keyword } },
          { gstNumber: { contains: keyword } },
        ],
      }
    : {};

  const count = await prisma.customer.count({ where: searchFilters });

  const customers = await prisma.customer.findMany({
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

  res.status(200).json({ customers, pageNumber, pages });
};

/**
 * @desc		Get Search Customers (No Pagination)
 * @route		GET /api/v1/customer/search
 * @param  {string} [keyword] - Required keyword
 * @access	private
 */
const searchCustomers = async (req, res) => {
  const keyword = req.query.keyword?.trim();

  if (keyword) {
    const searchFilters = {
      OR: [
        { firstName: { contains: keyword } },
        { lastName: { contains: keyword } },
        { email: { contains: keyword } },
        { businessLegalName: { contains: keyword } },
        { gstNumber: { contains: keyword } },
      ],
    };

    const customers = await prisma.customer.findMany({
      where: searchFilters,
    });

    res.status(200).json(customers);
  } else {
    res.status(200).json([]);
  }
};

/**
 * @desc		Update Customer Data
 * @route		PUT /api/v1/customer/:id
 * @access	private/admin
 */
const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const customer = await prisma.customer.findUnique({
    where: { id: Number(id) },
  });

  if (!customer) {
    res.status(404);
    throw new Error("Customer Not Found");
  }

  const {
    customerType,
    salutation,
    firstName,
    lastName,
    email,
    workPhone,
    mobile,
    businessLegalName,
    gstNumber,
    placeOfSupply,
    billingCountry,
    billingState,
    billingCity,
    billingAddress,
    billingZipcode,
    shippingCountry,
    shippingState,
    shippingCity,
    shippingAddress,
    shippingZipcode,
  } = req.body;

  const updatedCustomer = await prisma.customer.update({
    where: { id: Number(id) },
    data: {
      customerType: customerType.toLowerCase(),
      salutation: salutation.toLowerCase(),
      firstName: firstName.toLowerCase(),
      lastName: lastName.toLowerCase(),
      email: email.toLowerCase(),
      businessLegalName: businessLegalName?.toLowerCase(),
      workPhone,
      mobile,
      gstNumber,
      placeOfSupply,
      billingCountry,
      billingState,
      billingCity,
      billingAddress,
      billingZipcode,
      shippingCountry,
      shippingState,
      shippingCity,
      shippingAddress,
      shippingZipcode,
    },
  });

  res.status(200).json(updatedCustomer);
};

/**
 * @desc		Delete Customer
 * @route		DELETE /api/v1/customer/:id
 * @access	private/admin
 */
const deleteCustomer = async (req, res) => {
  const { id } = req.params;
  const customer = await prisma.customer.findUnique({
    where: { id: Number(id) },
  });
  if (!customer) {
    res.status(404);
    throw new Error("Customer Not Found");
  }

  await prisma.customer.delete({ where: { id: Number(id) } });
  res.status(200).json({ message: "Customer Deleted Sucessfully" });
};

/**
 * @desc		Downlaod All Customer List PDF File
 * @route		POST /api/v1/customer/download/pdf
 * @access	private/admin
 */
const downloadCustomerListPdf = async (req, res) => {
  const filePath = path.resolve("server/data/PdfTemplate/customerTable.html");

  const pageSize = +req.query.pageSize;
  const pageNumber = +req.query.pageNumber || 1;
  const keyword = req.query.keyword?.trim();

  const searchFilters = keyword
    ? {
        OR: [
          { firstName: { contains: keyword } },
          { lastName: { contains: keyword } },
          { email: { contains: keyword } },
          { businessLegalName: { contains: keyword } },
          { gstNumber: { contains: keyword } },
        ],
      }
    : {};

  const customerData = await prisma.customer.findMany({
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

  const pdfbuffer = await pdfGenerator({ filePath, data: customerData });

  res.status(200);
  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": "attachment; filename=CustomersList.pdf",
  });
  res.send(pdfbuffer);
};

/**
 * @desc		Downlaod All Customer List Excel File
 * @route		POST /api/v1/customer/download/excel
 * @access	private/admin
 */
const downloadCustomerListExcel = async (req, res) => {
  const pageSize = +req.query.pageSize;
  const pageNumber = +req.query.pageNumber || 1;
  const keyword = req.query.keyword?.trim();

  const searchFilters = keyword
    ? {
        OR: [
          { firstName: { contains: keyword } },
          { lastName: { contains: keyword } },
          { email: { contains: keyword } },
          { businessLegalName: { contains: keyword } },
          { gstNumber: { contains: keyword } },
        ],
      }
    : {};

  const customerData = await prisma.customer.findMany({
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
    { header: "SALUATION", key: "salutation", width: 15 },
    { header: "FIRST NAME", key: "firstName", width: 15 },
    { header: "LAST NAME", key: "lastName", width: 15 },
    { header: "BUSINESS LEGAL NAME", key: "businessLegalName", width: 30 },
    { header: "GSTIN", key: "gstNumber", width: 25 },
    { header: "PLACE OF SUPPLY", key: "placeOfSupply", width: 25 },
    { header: "EMAIL", key: "email", width: 30 },
    { header: "WORK PHONE", key: "workPhone", width: 25 },
    { header: "MOBILE PHONE", key: "mobile", width: 25 },
    { header: "BILLING ADDRESS", key: "billing", width: 40 },
    { header: "SHIPPING ADDRESS", key: "shipping", width: 40 },
    { header: "CUSTOMER TYPE", key: "customerType", width: 25 },
    { header: "CUSTOMER ID", key: "id", width: 10 },
    { header: "CREATED BY", key: "createdBy", width: 25 },
    { header: "CREATED AT", key: "createdAt", width: 25 },
    { header: "UPDATED AT", key: "updatedAt", width: 25 },
  ];

  const refactoredData = customerData.map((customer) => {
    const {
      billingAddress,
      billingCity,
      billingCountry,
      billingState,
      billingZipcode,
      shippingCountry,
      shippingState,
      shippingCity,
      shippingAddress,
      shippingZipcode,
    } = customer;

    const { name, isAdmin } = customer.user;
    return {
      ...customer,
      billing: `${billingAddress}, ${billingCity}, ${billingState}-${billingZipcode}, ${billingCountry}`,
      shipping: `${shippingAddress}, ${shippingCity}, ${shippingState}-${shippingZipcode}, ${shippingCountry}`,
      createdBy: `${name} | Admin`,
    };
  });

  const excel = await excelGenerator({
    workSheetName: "Customers",
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
  addCustomer,
  getCustomers,
  searchCustomers,
  updateCustomer,
  deleteCustomer,
  downloadCustomerListPdf,
  downloadCustomerListExcel,
};
