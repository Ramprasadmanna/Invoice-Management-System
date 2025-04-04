import express from 'express'
import { aggregatedGraphData, aggregatedGstPurchaseData, aggregatedGstSales_GstPurchase, aggregatedGstSalesData, aggregatedSalesData } from '#controllers/dashboard.controller.js'

const router = express.Router();

router.route('/gstSales').get(aggregatedGstSalesData);
router.route('/gstPurchase').get(aggregatedGstPurchaseData);
router.route('/sales').get(aggregatedSalesData);
router.route('/graph').get(aggregatedGraphData);
router.route('/gstsales-gstpurchase').get(aggregatedGstSales_GstPurchase);


export default router;