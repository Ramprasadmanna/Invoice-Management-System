import { sendSaleMail } from "#utils/mailSender.js";
import { prisma } from "#config/db.config.js";

/**
 * @desc		Add WebHook GST Order
 * @route		POST /api/v1/webhook/gstOrder
 * @access	public
 */
const addWebHookGstOrder = async (req, res) => {
  const { email, items } = req.body;

  if (items && items.length === 0) {
    res.status(404);
    throw new Error("No Order Items");
  }

  const itemIds = items.map((item) => item.id);

  const itemData = await prisma.gstItems.findMany({
    where: {
      id: { in: itemIds },
    },
  });

  if (itemIds.length !== itemData.length) {
    res.status(404);
    throw new Error("Invalid Order Items");
  }

  const updatedItems = items.map((item) => {
    const itemFound = itemData.find((i) => i.id === item.id);

    const taxableAmount = (+item.quantity * itemFound.rate).toFixed(2);
    const gstAmount = (+itemFound.igst * +item.quantity).toFixed(2);

    return {
      ...itemFound,
      item: itemFound.id,
      quantity: +item.quantity,
      taxableAmount: Number(+item.quantity * itemFound.rate),
      gstAmount: Number(itemFound.igst * +item.quantity),
      taxableAmount: Number(taxableAmount),
      gstAmount: Number(gstAmount),
      total: Number((+taxableAmount + +gstAmount).toFixed(2)),
    };
  });

  let customer = await prisma.customer.findUnique({
    where: { email },
  });

  if (!customer) {
    const {
      userId,
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

    customer = await prisma.customer.create({
      data: {
        userId,
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

    if (!customer) {
      res.status(400);
      throw new Error("Customer Creation Failed");
    }
  }

  const taxableAmount = updatedItems
    .reduce((acc, item) => acc + +item.taxableAmount, 0)
    .toFixed(2);

  const gstAmount = updatedItems
    .reduce((sum, item) => sum + +item.gstAmount, 0)
    .toFixed(2);

  const taxType =
    customer.placeOfSupply.toLowerCase() === process.env.CURRENT_STATE
      ? {
          cgst: Number((+gstAmount / 2).toFixed(2)),
          sgst: Number((+gstAmount / 2).toFixed(2)),
        }
      : { igst: Number((+gstAmount).toFixed(2)) };

  const shippingCharges = 0;
  const discount = 0;
  const otherAdjustments = 0;
  const total = (
    +taxableAmount +
    +gstAmount +
    shippingCharges -
    discount +
    otherAdjustments
  ).toFixed(2);

  const customerNote =
    "Thank you for choosing Center For Energy Sciences. We appreciate your business! If you have any questions or concerns regarding this invoice, please feel free to contact our customer service at +91 9152937135. We look forward to serving you again";
  const termsAndCondition =
    "Goods once sold are not refundable,Exclusively Subject to Mumbai Jurisdiction only";

  const createdGstSale = await prisma.webHookGstOrders.create({
    data: {
      customerId: customer.id,
      taxableAmount: Number(taxableAmount),
      gstAmount: Number(gstAmount),
      ...taxType,
      shippingCharges: Number(shippingCharges),
      discount: Number(discount),
      otherAdjustments: Number(otherAdjustments),
      total: Number(total),
      items: {
        create: updatedItems.map((item) => {
          return {
            itemId: item.id,
            type: item.type,
            name: item.name,
            description: item.description,
            validity: item.validity,
            hsnsacCode: item.hsnsacCode,
            gstSlab: item.gstSlab,
            rate: item.rate,
            cgst: item.cgst,
            sgst: item.sgst,
            igst: item.igst,
            gstAmount: item.gstAmount,
            quantity: item.quantity,
            taxableAmount: item.taxableAmount,
            total: item.total,
          };
        }),
      },
    },
  });

  if (createdGstSale) {
    res.json(createdGstSale);
  } else {
    res.status(400);
    throw new Error("Gst Order Creation Failed");
  }
};

/**
 * @desc		Get All WebHook GST Order
 * @route		GET /api/v1/webhook/gstOrder
 * @access	public
 */
const getWebHookGstOrders = async (req, res) => {
  const pageSize = +req.query.pageSize || 2;
  const pageNumber = +req.query.pageNumber || 1;

  const { keyword, fromDate, toDate } = req.query;

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

  if (fromDate && toDate) {
    filter.AND.push({
      invoiceDate: {
        gte: new Date(fromDate),
        lte: new Date(toDate),
      },
    });
  }

  const count = await prisma.webHookGstOrders.count({ where: filter });

  const gstOrderData = await prisma.webHookGstOrders.findMany({
    where: filter,
    include: {
      customer: true,
      items: true,
    },
    orderBy: { createdAt: "desc" },
    take: pageSize,
    skip: pageSize * (pageNumber - 1),
  });

  const pages = Math.ceil(count / pageSize);
  res.status(200).json({ gstOrderData, pageNumber, pages });
};

/**
 * @desc		Update Gst Order to Gst Sale
 * @route		GET /api/v1/webhook/updateToGstSale/:id
 * @access	Private/admin
 */
const updateToGstSale = async (req, res) => {
  const { id } = req.params;

  const gstOrder = await prisma.webHookGstOrders.findUnique({
    where: { id: Number(id) },
  });

  if (!gstOrder) {
    res.status(404);
    throw new Error("No GST Order Found");
  }

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
      : "A1001";
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

  await prisma.webHookGstOrders.delete({ where: { id: Number(id) } });
  res.status(200).json({ message: "GST Order Confirmed" });
};

export { addWebHookGstOrder, getWebHookGstOrders, updateToGstSale };
