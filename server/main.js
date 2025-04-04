import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import colors from "colors";
import path from "path";
import cookieParser from "cookie-parser";
import statusMonitor from "express-status-monitor";

import { errorHandler } from "#middlewares/error.middleware.js";
import { connectDB } from "#config/db.config.js";
import userRoutes from "#routes/users.route.js";
import customerRoutes from "#routes/customer.route.js";
import gstItemRoutes from "#routes/gstItem.route.js";
import cashItemRoutes from "#routes/cashItem.route.js";
import gstSalesRoute from "#routes/gstSales.route.js";
import cashSalesRoute from "#routes/cashSales.route.js";
import gstPurchaseItemRoute from "#routes/gstPurchaseItem.route.js";
import gstPurchaseRoute from "#routes/gstPurchase.route.js";
import expenseItemRoute from "#routes/expenseItem.route.js";
import expenseRoute from "#routes/expense.route.js";
import dashboardRoute from "#routes/dashboard.route.js";
import webhookRoute from "#routes/webhook.route.js";
import gstPaid from "#routes/gstPaid.route.js";

dotenv.config();
const port = process.env.PORT || 5000;
connectDB();

const app = express();
app.use(express.json()); // Request body parsing
app.use(express.urlencoded({ extended: true })); // Form data parsing
app.use(cookieParser()); // Parse cookies
app.use(morgan("dev"));
app.use(statusMonitor());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/customer", customerRoutes);
app.use("/api/v1/gstItem", gstItemRoutes);
app.use("/api/v1/cashItem", cashItemRoutes);
app.use("/api/v1/gstSales", gstSalesRoute);
app.use("/api/v1/cashSales", cashSalesRoute);
app.use("/api/v1/gstPurchaseItem", gstPurchaseItemRoute);
app.use("/api/v1/gstPurchase", gstPurchaseRoute);
app.use("/api/v1/expenseItem", expenseItemRoute);
app.use("/api/v1/expense", expenseRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/webhook", webhookRoute);
app.use("/api/v1/gstPaid", gstPaid);

const __dirname = path.resolve();
console.log(__dirname);

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.get("/", (req, res) => {
  res.send("Backend Is Running...");
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(
    `Server Running in ${process.env.NODE_ENV} mode on Port ${port}`.green.bold
  );
});
