import { sendSaleMail } from "#utils/mailSender.js";
import { prisma } from "#config/db.config.js";

/**
 * @desc		Add WebHook Order
 * @route		POST /api/v1/webhook/order
 * @access	public
 */
const addWebHookOrder = async (req, res) => {
  const { email, items } = req.body;

  if (items && items.length === 0) {
    res.status(404);
    throw new Error("No Order Items");
  }

  const itemIds = items.map((item) => item.id);

  const itemData = await prisma.cashItems.findMany({
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

    const total = (+item.quantity * itemFound.price).toFixed(2);

    return {
      ...itemFound,
      item: itemFound.id,
      quantity: +item.quantity,
      total: Number(total),
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

  const price = updatedItems
    .reduce((acc, item) => acc + +item.total, 0)
    .toFixed(2);

  const shippingCharges = 0;
  const discount = 0;
  const otherAdjustments = 0;
  const total = (price + shippingCharges - discount + otherAdjustments).toFixed(
    2
  );

  const customerNote =
    "Thank you for choosing Center For Energy Sciences. We appreciate your business! If you have any questions or concerns regarding this invoice, please feel free to contact our customer service at +91 9152937135. We look forward to serving you again";
  const termsAndCondition =
    "Goods once sold are not refundable,Exclusively Subject to Mumbai Jurisdiction only";

  const createdGstSale = await prisma.webHookOrders.create({
    data: {
      customerId: customer.id,
      price: Number(price),
      shippingCharges: 0,
      discount: 0,
      otherAdjustments: 0,
      total: Number(total),
      items: {
        create: updatedItems.map((item) => {
          return {
            itemId: item.id,
            type: item.type,
            name: item.name,
            description: item.description,
            validity: item.validity,
            price: item.price,
            quantity: item.quantity,
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
    throw new Error("Order Creation Failed");
  }
};

/**
 * @desc		Get WebHook GST Order
 * @route		GET /api/v1/webhook/order
 * @access	public
 */
const getWebHookOrders = async (req, res) => {
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

  const count = await prisma.webHookOrders.count({ where: filter });

  const orderData = await prisma.webHookOrders.findMany({
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
  res.status(200).json({ orderData, pageNumber, pages });
};

/**
 * @desc		Update Gst Order to Gst Sale
 * @route		GET /api/v1/webhook/updateToSale
 * @access	private/admin
 */
const updateToSale = async (req, res) => {
  const { id } = req.params;

  const order = await prisma.webHookOrders.findUnique({
    where: { id: Number(id) },
  });

  if (!order) {
    res.status(404);
    throw new Error("No GST Order Found");
  }

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
    where: { invoiceNumber: invoiceNumber },
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

  const createdSale = await prisma.cashSales.create({
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

  if (createdSale && sendMail) {
    await sendSaleMail({ saleData: createdSale, type: "saleMail" });
  }

  await prisma.webHookOrders.delete({ where: { id: Number(id) } });
  res.status(200).json({ message: "Order Confirmed" });
};

export { addWebHookOrder, getWebHookOrders, updateToSale };
