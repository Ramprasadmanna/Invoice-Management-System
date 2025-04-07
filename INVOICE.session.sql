WITH MonthlySales AS (
    SELECT
        gsi.hsnsacCode AS hsn_code,
        YEAR(gs.invoiceDate) AS year,
        MONTH(gs.invoiceDate) AS month,
        SUM(gsi.quantity) AS total_items_sold,
        SUM(gsi.taxableAmount) AS total_taxable_amount,
        SUM(gsi.cgst) AS total_cgst,
        SUM(gsi.sgst) AS total_sgst,
        SUM(gsi.igst) AS total_igst,
        SUM(gsi.total) AS total_amount
    FROM invoice.gstsaleitems gsi
    INNER JOIN invoice.gstSales gs ON gsi.gstSaleId = gs.id
    GROUP BY gsi.hsnsacCode, YEAR(gs.invoiceDate), MONTH(gs.invoiceDate)
)

SELECT 
    gsi.hsnsacCode AS id,
    SUM(gsi.quantity) AS total_purchase,
    COALESCE(SUM(gsi.taxableAmount), 0) AS total_taxable_amount,
    COALESCE(SUM(gsi.cgst), 0) AS total_cgst,
    COALESCE(SUM(gsi.sgst), 0) AS total_sgst,
    COALESCE(SUM(gsi.igst), 0) AS total_igst,
    COALESCE(SUM(gsi.total), 0) AS total_amount,

    (
        SELECT JSON_ARRAYAGG(monthly_json)
        FROM (
            SELECT DISTINCT
                ms.year,
                ms.month,
                JSON_OBJECT(
                    'year', ms.year,
                    'month', ms.month,
                    'total_purchase', ms.total_items_sold,
                    'total_taxable_amount', ms.total_taxable_amount,
                    'total_cgst', ms.total_cgst,
                    'total_sgst', ms.total_sgst,
                    'total_igst', ms.total_igst,
                    'total_amount', ms.total_amount,
                    'data',
                    (
                        SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'invoiceNumber', gs.invoiceNumber,
                                'orderNumber', gs.orderNumber,
                                'invoiceDate', gs.invoiceDate,
                                'customer', 
                                JSON_OBJECT(
                                    'id', c.id,
                                    'customerType', c.customerType,
                                    'salutation', c.salutation,
                                    'firstName', c.firstName,
                                    'lastName', c.lastName,
                                    'email', c.email,
                                    'mobile', c.mobile,
                                    'gstNumber', c.gstNumber,
                                    'businessLegalName', c.businessLegalName,
                                    'placeOfSupply', c.placeOfSupply
                                ),
                                'items', (
                                    SELECT JSON_ARRAYAGG(
                                        JSON_OBJECT(
                                            'name', gsi2.name,
                                            'description', gsi2.description,
                                            'type', gsi2.type,
                                            'gstSlab', gsi2.gstSlab,
                                            'quantity', gsi2.quantity,
                                            'hsnCode', gsi2.hsnsacCode,
                                            'rate', gsi2.rate,
                                            'taxableAmount', gsi2.taxableAmount,
                                            'cgst', gsi2.cgst,
                                            'sgst', gsi2.sgst,
                                            'igst', gsi2.igst,
                                            'gstAmount', gsi2.gstAmount,
                                            'total', gsi2.total
                                        )
                                    )
                                    FROM invoice.gstsaleitems gsi2
                                    WHERE gsi2.gstSaleId = gs.id
                                    AND gsi2.hsnsacCode = gsi.hsnsacCode
                                )
                            )
                        )
                        FROM invoice.gstSales gs
                        INNER JOIN invoice.customer c ON gs.customerId = c.id
                        WHERE EXISTS (
                            SELECT 1 FROM invoice.gstsaleitems gsi3 
                            WHERE gsi3.gstSaleId = gs.id 
                            AND gsi3.hsnsacCode = gsi.hsnsacCode
                            AND YEAR(gs.invoiceDate) = ms.year
                            AND MONTH(gs.invoiceDate) = ms.month
                        )
                    )
                ) AS monthly_json
            FROM MonthlySales ms
            WHERE ms.hsn_code = gsi.hsnsacCode
        ) AS distinct_months
    ) AS monthly_data

FROM invoice.gstsaleitems gsi
INNER JOIN invoice.gstSales gs ON gsi.gstSaleId = gs.id
GROUP BY gsi.hsnsacCode;
