import { prisma } from "#config/db.config.js";

const monthsArray = [
  { month: 4, year: 0, name: "April" },
  { month: 5, year: 0, name: "May" },
  { month: 6, year: 0, name: "June" },
  { month: 7, year: 0, name: "July" },
  { month: 8, year: 0, name: "August" },
  { month: 9, year: 0, name: "September" },
  { month: 10, year: 0, name: "October" },
  { month: 11, year: 0, name: "November" },
  { month: 12, year: 0, name: "December" },
  { month: 1, year: 1, name: "January" },
  { month: 2, year: 1, name: "February" },
  { month: 3, year: 1, name: "March" },
];

/**
 * @desc		Aggregated Graph Data (GST Sales,GST Purchase,Sales)
 * @route		POST /api/v1/dashboard/graph
 * @access	private
 */
const aggregatedGraphData = async (req, res) => {
  const financialYear = Number(req.query.year);

  if (!financialYear) {
    res.status(400);
    throw new Error("Invalid Finalcial Year");
  }

  const startDate = `${financialYear}-04-01`;
  const endDate = `${financialYear + 1}-03-31`;

  const getGstSales = async () => {
    const monthlySalesData = await prisma.$queryRaw`
  SELECT 
      YEAR(invoiceDate) AS year,
      MONTH(invoiceDate) AS month,
      CAST(ROUND(SUM(taxableAmount), 2) AS CHAR) AS taxableAmount,
      CAST(ROUND(SUM(cgst), 2) AS CHAR) AS cgst,
      CAST(ROUND(SUM(sgst), 2) AS CHAR) AS sgst,
      CAST(ROUND(SUM(igst), 2) AS CHAR) AS igst,
      CAST(ROUND(SUM(gstAmount), 2) AS CHAR) AS gstAmount,
      CAST(ROUND(SUM(total), 2) AS CHAR) AS total,
      CAST(ROUND(SUM(total - balanceDue), 2) AS CHAR) AS netTotal
  FROM gstSales
  WHERE invoiceDate BETWEEN ${startDate} AND ${endDate}
    AND invoiceType = 'Tax Invoice'
    AND balanceDue=0
  GROUP BY year, month
  ORDER BY year ASC, month ASC;
`;

    const serializedSalesData = JSON.parse(
      JSON.stringify(monthlySalesData, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    const formattedMonthlyData = monthsArray.map((monthInfo) => {
      const existingData = serializedSalesData.find(
        (data) =>
          data.month == monthInfo.month &&
          data.year == financialYear + monthInfo.year
      );

      return existingData
        ? existingData
        : {
            year: financialYear + monthInfo.year,
            month: monthInfo.month,
            taxableAmount: "0",
            cgst: "0",
            sgst: "0",
            igst: "0",
            gstAmount: "0",
            total: "0",
            netTotal: "0",
          };
    });

    const finalResponse = {
      monthly_data: formattedMonthlyData,
    };

    return finalResponse;
  };

  const getGstPurchase = async () => {
    const monthlyPurchaseData = await prisma.$queryRaw`
    SELECT 
        YEAR(purchaseDate) AS year,
        MONTH(purchaseDate) AS month,
        CAST(ROUND(SUM(taxableAmount), 2) AS CHAR) AS taxableAmount,
        CAST(ROUND(SUM(cgst), 2) AS CHAR) AS cgst,
        CAST(ROUND(SUM(sgst), 2) AS CHAR) AS sgst,
        CAST(ROUND(SUM(igst), 2) AS CHAR) AS igst,
        CAST(ROUND(SUM(gstAmount), 2) AS CHAR) AS gstAmount,
        CAST(ROUND(SUM(total), 2) AS CHAR) AS total
    FROM gstPurchases
    WHERE purchaseDate BETWEEN ${startDate} AND ${endDate}
    GROUP BY year, month
    ORDER BY year ASC, month ASC;
  `;

    const serializedPurchaseData = JSON.parse(
      JSON.stringify(monthlyPurchaseData, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    const formattedMonthlyData = monthsArray.map((monthInfo) => {
      const existingData = serializedPurchaseData.find(
        (data) =>
          data.month == monthInfo.month &&
          data.year == financialYear + monthInfo.year
      );

      return existingData
        ? existingData
        : {
            year: financialYear + monthInfo.year,
            month: monthInfo.month,
            taxableAmount: "0",
            cgst: "0",
            sgst: "0",
            igst: "0",
            gstAmount: "0",
            total: "0",
          };
    });

    const finalResponse = {
      monthly_data: formattedMonthlyData,
    };

    return finalResponse;
  };

  const getSalesData = async () => {
    const monthlySalesData = await prisma.$queryRaw`
    SELECT 
        YEAR(invoiceDate) AS year,
        MONTH(invoiceDate) AS month,
        CAST(ROUND(SUM(price), 2) AS CHAR) AS price,
        CAST(ROUND(SUM(total), 2) AS CHAR) AS total,
        CAST(ROUND(SUM(balanceDue), 2) AS CHAR) AS balanceDue,
        CAST(ROUND(SUM(total - balanceDue), 2) AS CHAR) AS netTotal
    FROM cashSales
    WHERE invoiceDate BETWEEN ${startDate} AND ${endDate}
    GROUP BY year, month
    ORDER BY year ASC, month ASC;
  `;

    const serializedSalesData = JSON.parse(
      JSON.stringify(monthlySalesData, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    const formattedMonthlyData = monthsArray.map((monthInfo) => {
      const existingData = serializedSalesData.find(
        (data) =>
          data.month == monthInfo.month &&
          data.year == financialYear + monthInfo.year
      );

      return existingData
        ? existingData
        : {
            year: financialYear + monthInfo.year,
            month: monthInfo.month,
            price: "0",
            total: "0",
            balanceDue: "0",
            netTotal: "0",
          };
    });

    const finalResponse = {
      monthly_data: formattedMonthlyData,
    };

    return finalResponse;
  };

  const gstSalesData = await getGstSales();
  const gstPurchaseData = await getGstPurchase();
  const salesData = await getSalesData();

  const aggregatedData = new Array(12).fill("").map((_, index) => {
    const month =
      gstSalesData?.monthly_data[index]?.month ||
      gstPurchaseData?.monthly_data?.month ||
      salesData?.monthly_data?.month ||
      monthsArray[index].month;
    const dataYear =
      gstSalesData?.monthly_data[index]?.year ||
      gstPurchaseData?.monthly_data?.year ||
      salesData?.monthly_data?.year ||
      year + monthsArray[index].year;

    return {
      month,
      year: dataYear,
      gstSalesTotal: gstSalesData?.monthly_data[index]?.netTotal || 0,
      gstPurchaseTotal: gstPurchaseData?.monthly_data[index]?.total || 0,
      salesTotal: salesData?.monthly_data[index]?.netTotal || 0,
    };
  });

  if (gstSalesData && gstPurchaseData && salesData) {
    return res.status(200).json(aggregatedData);
  }

  res.status(404);
  throw new Error("Data Not Found");
};

/**
 * @desc		Aggregated GST Sales Data
 * @route		POST /api/v1/dashboard/gstSales
 * @access	private
 */
const aggregatedGstSalesData = async (req, res) => {
  const financialYear = Number(req.query.year);

  if (!financialYear) {
    res.status(400);
    throw new Error("Invalid Finalcial Year");
  }

  const startDate = `${financialYear}-04-01`;
  const endDate = `${financialYear + 1}-03-31`;

  const monthlySalesData = await prisma.$queryRaw`
      SELECT 
          YEAR(invoiceDate) AS year,
          MONTH(invoiceDate) AS month,
          CAST(ROUND(SUM(taxableAmount), 2) AS CHAR) AS taxableAmount,
          CAST(ROUND(SUM(cgst), 2) AS CHAR) AS cgst,
          CAST(ROUND(SUM(sgst), 2) AS CHAR) AS sgst,
          CAST(ROUND(SUM(igst), 2) AS CHAR) AS igst,
          CAST(ROUND(SUM(gstAmount), 2) AS CHAR) AS gstAmount,
          CAST(ROUND(SUM(total), 2) AS CHAR) AS total,
          CAST(ROUND(SUM(balanceDue), 2) AS CHAR) AS balanceDue,
          CAST(ROUND(SUM(total - balanceDue), 2) AS CHAR) AS netTotal
      FROM gstSales
      WHERE invoiceDate BETWEEN ${startDate} AND ${endDate}
        AND invoiceType = 'Tax Invoice'
      GROUP BY year, month
      ORDER BY year ASC, month ASC;
    `;

  const summarySalesData = await prisma.$queryRaw`
      SELECT 
          CAST(ROUND(SUM(taxableAmount), 2) AS CHAR) AS taxableAmount,
          CAST(ROUND(SUM(cgst), 2) AS CHAR) AS cgst,
          CAST(ROUND(SUM(sgst), 2) AS CHAR) AS sgst,
          CAST(ROUND(SUM(igst), 2) AS CHAR) AS igst,
          CAST(ROUND(SUM(gstAmount), 2) AS CHAR) AS gstAmount,
          CAST(ROUND(SUM(total), 2) AS CHAR) AS total,
          CAST(ROUND(SUM(balanceDue), 2) AS CHAR) AS balanceDue,
          CAST(ROUND(SUM(total - balanceDue), 2) AS CHAR) AS netTotal
      FROM gstSales
      WHERE invoiceDate BETWEEN ${startDate} AND ${endDate}
        AND invoiceType = 'Tax Invoice';
    `;

  const serializedSalesData = JSON.parse(
    JSON.stringify(monthlySalesData, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

  const formattedMonthlyData = monthsArray.map((monthInfo) => {
    const existingData = serializedSalesData.find(
      (data) =>
        data.month == monthInfo.month &&
        data.year == financialYear + monthInfo.year
    );

    return existingData
      ? existingData
      : {
          year: financialYear + monthInfo.year,
          month: monthInfo.month,
          taxableAmount: "0",
          cgst: "0",
          sgst: "0",
          igst: "0",
          gstAmount: "0",
          total: "0",
          balanceDue: "0",
          netTotal: "0",
        };
  });

  const finalResponse = {
    ...summarySalesData[0],
    monthly_data: formattedMonthlyData,
  };

  return res.status(200).json(finalResponse);
};

/**
 * @desc		Aggregated GST Purchase Data
 * @route		POST /api/v1/dashboard/gstPurchase
 * @access	private
 */
const aggregatedGstPurchaseData = async (req, res) => {
  const financialYear = Number(req.query.year);

  if (!financialYear) {
    res.status(400);
    throw new Error("Invalid Finalcial Year");
  }

  const startDate = `${financialYear}-04-01`;
  const endDate = `${financialYear + 1}-03-31`;

  const monthlyPurchaseData = await prisma.$queryRaw`
  SELECT 
      YEAR(purchaseDate) AS year,
      MONTH(purchaseDate) AS month,
      CAST(ROUND(SUM(taxableAmount), 2) AS CHAR) AS taxableAmount,
      CAST(ROUND(SUM(cgst), 2) AS CHAR) AS cgst,
      CAST(ROUND(SUM(sgst), 2) AS CHAR) AS sgst,
      CAST(ROUND(SUM(igst), 2) AS CHAR) AS igst,
      CAST(ROUND(SUM(gstAmount), 2) AS CHAR) AS gstAmount,
      CAST(ROUND(SUM(total), 2) AS CHAR) AS total
  FROM gstPurchases
  WHERE purchaseDate BETWEEN ${startDate} AND ${endDate}
  GROUP BY year, month
  ORDER BY year ASC, month ASC;
`;

  const summaryPurchaseData = await prisma.$queryRaw`
  SELECT
      CAST(ROUND(SUM(taxableAmount), 2) AS CHAR) AS taxableAmount,
      CAST(ROUND(SUM(cgst), 2) AS CHAR) AS cgst,
      CAST(ROUND(SUM(sgst), 2) AS CHAR) AS sgst,
      CAST(ROUND(SUM(igst), 2) AS CHAR) AS igst,
      CAST(ROUND(SUM(gstAmount), 2) AS CHAR) AS gstAmount,
      CAST(ROUND(SUM(total), 2) AS CHAR) AS total
  FROM gstPurchases
  WHERE purchaseDate BETWEEN ${startDate} AND ${endDate}
  `;

  const serializedPurchaseData = JSON.parse(
    JSON.stringify(monthlyPurchaseData, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

  const formattedMonthlyData = monthsArray.map((monthInfo) => {
    const existingData = serializedPurchaseData.find(
      (data) =>
        data.month == monthInfo.month &&
        data.year == financialYear + monthInfo.year
    );

    return existingData
      ? existingData
      : {
          year: financialYear + monthInfo.year,
          month: monthInfo.month,
          taxableAmount: "0",
          cgst: "0",
          sgst: "0",
          igst: "0",
          gstAmount: "0",
          total: "0",
        };
  });

  const finalResponse = {
    ...summaryPurchaseData[0],
    monthly_data: formattedMonthlyData,
  };

  return res.status(200).json(finalResponse);
};

/**
 * @desc		Aggregated GST Sales - GST Purchase
 * @route		POST /api/v1/dashboard/gstsales-gstpurchase
 * @access	private
 */
const aggregatedGstSales_GstPurchase = async (req, res) => {
  const financialYear = Number(req.query.year);

  if (!financialYear) {
    res.status(400);
    throw new Error("Invalid Finalcial Year");
  }

  const startDate = `${financialYear}-04-01`;
  const endDate = `${financialYear + 1}-03-31`;

  const getGstSales = async () => {
    const monthlySalesData = await prisma.$queryRaw`
  SELECT 
      YEAR(invoiceDate) AS year,
      MONTH(invoiceDate) AS month,
      CAST(ROUND(SUM(taxableAmount), 2) AS CHAR) AS taxableAmount,
      CAST(ROUND(SUM(cgst), 2) AS CHAR) AS cgst,
      CAST(ROUND(SUM(sgst), 2) AS CHAR) AS sgst,
      CAST(ROUND(SUM(igst), 2) AS CHAR) AS igst,
      CAST(ROUND(SUM(gstAmount), 2) AS CHAR) AS gstAmount,
      CAST(ROUND(SUM(total), 2) AS CHAR) AS total
  FROM gstSales
  WHERE invoiceDate BETWEEN ${startDate} AND ${endDate}
    AND invoiceType = 'Tax Invoice'
    AND balanceDue=0
  GROUP BY year, month
  ORDER BY year ASC, month ASC;
`;

    const summarySalesData = await prisma.$queryRaw`
  SELECT 
      CAST(ROUND(SUM(taxableAmount), 2) AS CHAR) AS taxableAmount,
      CAST(ROUND(SUM(cgst), 2) AS CHAR) AS cgst,
      CAST(ROUND(SUM(sgst), 2) AS CHAR) AS sgst,
      CAST(ROUND(SUM(igst), 2) AS CHAR) AS igst,
      CAST(ROUND(SUM(gstAmount), 2) AS CHAR) AS gstAmount,
      CAST(ROUND(SUM(total), 2) AS CHAR) AS total
  FROM gstSales
  WHERE invoiceDate BETWEEN ${startDate} AND ${endDate}
  AND invoiceType = 'Tax Invoice'
  AND balanceDue=0
`;

    const serializedSalesData = JSON.parse(
      JSON.stringify(monthlySalesData, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    const formattedMonthlyData = monthsArray.map((monthInfo) => {
      const existingData = serializedSalesData.find(
        (data) =>
          data.month == monthInfo.month &&
          data.year == financialYear + monthInfo.year
      );

      return existingData
        ? existingData
        : {
            year: financialYear + monthInfo.year,
            month: monthInfo.month,
            taxableAmount: "0",
            cgst: "0",
            sgst: "0",
            igst: "0",
            gstAmount: "0",
            total: "0",
          };
    });

    const finalResponse = {
      ...summarySalesData[0],
      monthly_data: formattedMonthlyData,
    };

    return finalResponse;
  };

  const getGstPurchase = async () => {
    const monthlyPurchaseData = await prisma.$queryRaw`
    SELECT 
        YEAR(purchaseDate) AS year,
        MONTH(purchaseDate) AS month,
        CAST(ROUND(SUM(taxableAmount), 2) AS CHAR) AS taxableAmount,
        CAST(ROUND(SUM(cgst), 2) AS CHAR) AS cgst,
        CAST(ROUND(SUM(sgst), 2) AS CHAR) AS sgst,
        CAST(ROUND(SUM(igst), 2) AS CHAR) AS igst,
        CAST(ROUND(SUM(gstAmount), 2) AS CHAR) AS gstAmount,
        CAST(ROUND(SUM(total), 2) AS CHAR) AS total
    FROM gstPurchases
    WHERE purchaseDate BETWEEN ${startDate} AND ${endDate}
    GROUP BY year, month
    ORDER BY year ASC, month ASC;
  `;

    const summaryPurchaseData = await prisma.$queryRaw`
    SELECT
        CAST(ROUND(SUM(taxableAmount), 2) AS CHAR) AS taxableAmount,
        CAST(ROUND(SUM(cgst), 2) AS CHAR) AS cgst,
        CAST(ROUND(SUM(sgst), 2) AS CHAR) AS sgst,
        CAST(ROUND(SUM(igst), 2) AS CHAR) AS igst,
        CAST(ROUND(SUM(gstAmount), 2) AS CHAR) AS gstAmount,
        CAST(ROUND(SUM(total), 2) AS CHAR) AS total
    FROM gstPurchases
    WHERE purchaseDate BETWEEN ${startDate} AND ${endDate}
    `;

    const serializedPurchaseData = JSON.parse(
      JSON.stringify(monthlyPurchaseData, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    const formattedMonthlyData = monthsArray.map((monthInfo) => {
      const existingData = serializedPurchaseData.find(
        (data) =>
          data.month == monthInfo.month &&
          data.year == financialYear + monthInfo.year
      );

      return existingData
        ? existingData
        : {
            year: financialYear + monthInfo.year,
            month: monthInfo.month,
            taxableAmount: "0",
            cgst: "0",
            sgst: "0",
            igst: "0",
            gstAmount: "0",
            total: "0",
          };
    });

    const finalResponse = {
      ...summaryPurchaseData[0],
      monthly_data: formattedMonthlyData,
    };

    return finalResponse;
  };

  const getGstPaid = async () => {
    const monthlyGstPaidData = await prisma.$queryRaw`
    SELECT 
        YEAR(monthOfGstPaid) AS year,
        MONTH(monthOfGstPaid) AS month,
        amount
    FROM gstPaid
    WHERE monthOfGstPaid BETWEEN ${startDate} AND ${endDate}
    ORDER BY year ASC, month ASC;
  `;

    const summaryGstPaidData = await prisma.$queryRaw`
    SELECT
        CAST(ROUND(SUM(amount), 2) AS CHAR) AS amount
    FROM gstPaid
    WHERE monthOfGstPaid BETWEEN ${startDate} AND ${endDate}
    `;

    const serializedSalesData = JSON.parse(
      JSON.stringify(monthlyGstPaidData, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    const formattedMonthlyData = monthsArray.map((monthInfo) => {
      const existingData = serializedSalesData.find(
        (data) =>
          data.month == monthInfo.month &&
          data.year == financialYear + monthInfo.year
      );

      return existingData
        ? existingData
        : {
            year: financialYear + monthInfo.year,
            month: monthInfo.month,
            amount: "0",
          };
    });

    const finalResponse = {
      ...summaryGstPaidData[0],
      monthly_data: formattedMonthlyData,
    };

    return finalResponse;
  };

  const gstSales = await getGstSales();
  const gstPurchase = await getGstPurchase();
  const gstPaid = await getGstPaid();

  const monthly_data = new Array(12).fill("").map((_, index) => {
    const month =
      gstSales?.monthly_data[index]?.month ||
      gstPurchase?.monthly_data?.month ||
      monthsArray[index].month;
    const dataYear =
      gstSales?.monthly_data[index]?.year ||
      gstPurchase?.monthly_data?.year ||
      year + monthsArray[index].year;

    const gstSalesCgst = gstSales?.monthly_data[index]?.cgst || 0;
    const gstSalesSgst = gstSales?.monthly_data[index]?.sgst || 0;
    const gstSalesIgst = gstSales?.monthly_data[index]?.igst || 0;
    const gstSalesTaxAmount = gstSales?.monthly_data[index]?.gstAmount || 0;

    const gstPurchaseCgst = gstPurchase?.monthly_data[index]?.cgst || 0;
    const gstPurchaseSgst = gstPurchase?.monthly_data[index]?.sgst || 0;
    const gstPurchaseIgst = gstPurchase?.monthly_data[index]?.igst || 0;
    const gstPurchaseTaxAmount =
      gstPurchase?.monthly_data[index]?.gstAmount || 0;

    const gstPaidAmount = gstPaid?.monthly_data[index]?.amount || 0;

    return {
      month,
      year: dataYear,
      cgst: gstSalesCgst - gstPurchaseCgst,
      sgst: gstSalesSgst - gstPurchaseSgst,
      igst: gstSalesIgst - gstPurchaseIgst,
      gstAmount: gstSalesTaxAmount - gstPurchaseTaxAmount,
      gstPaidAmount,
    };
  });

  const gstSalesCgst = gstSales?.cgst || 0;
  const gstSalesSgst = gstSales?.sgst || 0;
  const gstSalesIgst = gstSales?.igst || 0;
  const gstSalesTaxAmount = gstSales?.gstAmount || 0;

  const gstPurchaseCgst = gstPurchase?.cgst || 0;
  const gstPurchaseSgst = gstPurchase?.sgst || 0;
  const gstPurchaseIgst = gstPurchase?.igst || 0;
  const gstPurchaseTaxAmount = gstPurchase?.gstAmount || 0;

  const gstPaidAmount = gstPaid?.amount || 0;

  const gstSales_gstPurchase = {
    financialYear: `${financialYear}-${financialYear + 1}`,
    cgst: gstSalesCgst - gstPurchaseCgst,
    sgst: gstSalesSgst - gstPurchaseSgst,
    igst: gstSalesIgst - gstPurchaseIgst,
    gstAmount: gstSalesTaxAmount - gstPurchaseTaxAmount,
    gstPaidAmount,
    monthly_data,
  };

  if (gstSales && gstPurchase) {
    return res.status(200).json(gstSales_gstPurchase);
    // return res.status(200).json(gstPaid);
  }

  // res.status(404);
  // throw new Error("Data Not Found");
};

/**
 * @desc		Aggregated Sales Data
 * @route		POST /api/v1/dashboard/sales
 * @access	private
 */
const aggregatedSalesData = async (req, res) => {
  const financialYear = Number(req.query.year);

  if (!financialYear) {
    res.status(400);
    throw new Error("Invalid Finalcial Year");
  }

  const startDate = `${financialYear}-04-01`;
  const endDate = `${financialYear + 1}-03-31`;

  const monthlySalesData = await prisma.$queryRaw`
  SELECT 
      YEAR(invoiceDate) AS year,
      MONTH(invoiceDate) AS month,
      CAST(ROUND(SUM(price), 2) AS CHAR) AS price,
      CAST(ROUND(SUM(total), 2) AS CHAR) AS total,
      CAST(ROUND(SUM(balanceDue), 2) AS CHAR) AS balanceDue,
      CAST(ROUND(SUM(total - balanceDue), 2) AS CHAR) AS netTotal
  FROM cashSales
  WHERE invoiceDate BETWEEN ${startDate} AND ${endDate}
  GROUP BY year, month
  ORDER BY year ASC, month ASC;
`;

  const summarySalesData = await prisma.$queryRaw`
SELECT 
    CAST(ROUND(SUM(price), 2) AS CHAR) AS price,
    CAST(ROUND(SUM(total), 2) AS CHAR) AS total,
    CAST(ROUND(SUM(balanceDue), 2) AS CHAR) AS balanceDue,
    CAST(ROUND(SUM(total - balanceDue), 2) AS CHAR) AS netTotal
FROM cashSales
WHERE invoiceDate BETWEEN ${startDate} AND ${endDate}
`;

  const serializedSalesData = JSON.parse(
    JSON.stringify(monthlySalesData, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

  const formattedMonthlyData = monthsArray.map((monthInfo) => {
    const existingData = serializedSalesData.find(
      (data) =>
        data.month == monthInfo.month &&
        data.year == financialYear + monthInfo.year
    );

    return existingData
      ? existingData
      : {
          year: financialYear + monthInfo.year,
          month: monthInfo.month,
          price: "0",
          total: "0",
          balanceDue: "0",
          netTotal: "0",
        };
  });

  const finalResponse = {
    ...summarySalesData[0],
    monthly_data: formattedMonthlyData,
  };

  return res.status(200).json(finalResponse);
};

export {
  aggregatedGstSalesData,
  aggregatedGstPurchaseData,
  aggregatedSalesData,
  aggregatedGraphData,
  aggregatedGstSales_GstPurchase,
};
