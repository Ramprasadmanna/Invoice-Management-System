# 📘 INVOICE MANAGEMENT SYSTEM

## 1. Project Overview

**Project Name**: Invoice Management System (IMS)  
**Client**: World On Vastu  
**Developer**: Ramprasad Manna

### 📌 Introduction

The **Invoice Management System (IMS)** is a fully responsive web application designed to streamline the process of managing customers, products, and sales (including GST and cash transactions). It provides a seamless way to generate invoices and manage business operations efficiently.

This system is tailored for businesses that require:

- Centralized customer and product management  
- Tracking of GST and non-GST sales  
- Invoice generation and history  
- Download Invoice In PDF  
- Download Summary In Excel/PDF Format
- Secure login and session handling  

### 🧩 System Modules

- **Customer Management**
- **Product Management**
- **Cash Sales & GST Sales**
- **Webhook Orders**
- **Purchase Tracking**
- **Expense Tracking**
- **User Authentication & Authorization**
- **Admin Panel And User Management**

### 🔧 Technical Architecture

| Layer         | Technology        |
|---------------|-------------------|
| Frontend      | React.js          |
| Backend       | Node.js, Express  |
| Database      | MySQL             |
| Deployment    | AWS EC2 + NGINX   |
| Auth System   | JWT Tokens + Cookies |
| Styling       | Tailwind CSS (or mention if used) |

---
## 2. Tech Stack

The IMS project has been developed using a modern and scalable technology stack to ensure performance, maintainability, and future extensibility.

### 🖥️ Frontend

- **Framework**: React.js (with functional components and hooks)
- **Routing**: React Router
- **State Management**: Use State & Redux
- **HTTP Requests**: RTK Query
- **Styling**: Tailwind CSS

### 🌐 Backend

- **Runtime Environment**: Node.js
- **Web Framework**: Express.js
- **Authentication**: JSON Web Tokens (JWT) with HttpOnly Cookies
- **Rate Limiting**: For secure login endpoints
- **Middleware**: Morgan (Logger), Custom Error Handler

### 💾 Database

- **Database Engine**: MySQL
- **ORM/Query Tool**: Prisma ORM (for type-safe database interaction)

### 🔒 Security

- Password Hashing: Bcrypt
- Custom Error Handler
- Environment variables: `.env` for secure configuration

### 🚀 Deployment

- **Server**: AWS EC2 (Ubuntu)
- **Web Server**: NGINX (for serving frontend & reverse proxy for APIs)
- **Process Manager**: PM2 (to run and manage Node.js server)
- **Domain & SSL**: Certbot

---

## 3. Folder Structure

The project is structured in a clean and modular way, separating frontend and backend codebases. Below is the overview of the folder structure:

```
└── 📁Invoice Management Sytem
    └── 📁client
        └── .gitignore
        └── .prettierrc
        └── eslint.config.js
        └── index.html
        └── jsconfig.json
        └── package-lock.json
        └── package.json
        └── postcss.config.js
        └── 📁public
            └── 📁Images
                └── Logo.png
                └── user.jpg
                └── User2.png
            └── vite.svg
        └── README.md
        └── 📁src
            └── App.jsx
            └── 📁components
                └── 📁Actions
                    └── index.jsx
                └── 📁Alert
                    └── index.jsx
                └── 📁Header
                    └── index.jsx
                └── 📁Layout
                    └── index.jsx
                └── 📁Loader
                    └── index.jsx
                └── 📁PageSize
                    └── index.jsx
                └── 📁Paginate
                    └── index.jsx
                └── 📁PrivateRoute
                    └── index.jsx
                └── 📁QuantitySelector
                    └── index.jsx
                └── 📁SelectWithSearch
                    └── index.jsx
                └── 📁Sidebar
                    └── index copy.jsx
                    └── index.jsx
                    └── NavItem.jsx
                └── 📁TrainingValidityDetails
                    └── index.jsx
                └── 📁YearSelector
                    └── index.jsx
            └── constants.js
            └── 📁data
                └── countryDataSet.js
                └── countryPhoneCode.js
                └── currencyName.js
                └── currencySymbol.js
                └── gstSales.js
                └── monthShort.js
                └── monthsLong.js
                └── salesData.js
                └── states.js
            └── index.css
            └── main.jsx
            └── 📁screens
                └── 📁Customer
                    └── CustomerForm.jsx
                    └── index.jsx
                └── 📁Error
                    └── index.jsx
                └── 📁Expense
                    └── ExpenseForm.jsx
                    └── index.jsx
                └── 📁ExpenseItems
                    └── ExpenseItemForm.jsx
                    └── index.jsx
                └── 📁ExpenseItemSummary
                    └── index.jsx
                    └── MonthTable.jsx
                    └── Summary.jsx
                └── 📁GstOrder
                    └── GstOrderForm.jsx
                    └── index.jsx
                    └── ItemsTable.jsx
                    └── OrderItems.jsx
                └── 📁GstPaid
                    └── GstPaidForm.jsx
                    └── index.jsx
                └── 📁GstPurchase
                    └── GstPruchaseForm.jsx
                    └── index.jsx
                └── 📁GstPurchaseCompanySummary
                    └── index.jsx
                    └── MonthTable.jsx
                    └── Summary.jsx
                └── 📁GstPurchaseItems
                    └── GstPruchaseItemForm.jsx
                    └── index.jsx
                └── 📁GstSales
                    └── GstSalesForm.jsx
                    └── index.jsx
                    └── ItemsTable.jsx
                    └── OrderItems.jsx
                └── 📁GstSalesCustomerSummary
                    └── index.jsx
                    └── ItemsTable.jsx
                    └── MonthTable.jsx
                    └── Summary.jsx
                └── 📁GstSalesHsnSummary
                    └── index.jsx
                    └── MonthTable.jsx
                    └── Summary.jsx
                └── 📁GstSalesProductSummary
                    └── index.jsx
                    └── MonthTable.jsx
                    └── Summary.jsx
                └── index.js
                └── 📁Invoice
                    └── Graph.jsx
                    └── GstPurchaseTable.jsx
                    └── GstSalesGstPurchaseTable.jsx
                    └── GstSalesTable.jsx
                    └── index.jsx
                    └── SalesTable.jsx
                └── 📁Items
                    └── GstItems.jsx
                    └── GstItemsForm.jsx
                    └── index.jsx
                    └── Items.jsx
                    └── ItemsForm.jsx
                └── 📁Login
                    └── index.jsx
                └── 📁Order
                    └── index.jsx
                    └── ItemsTable.jsx
                    └── OrderForm.jsx
                    └── OrderItems.jsx
                └── 📁Profile
                    └── AddUserForm.jsx
                    └── index.jsx
                └── 📁Sales
                    └── index.jsx
                    └── ItemsTable.jsx
                    └── OrderItems.jsx
                    └── SalesForm.jsx
                └── 📁SalesCustomerSummary
                    └── index.jsx
                    └── ItemsTable.jsx
                    └── MonthTable.jsx
                    └── Summary.jsx
                └── 📁SalesProductSummary
                    └── index.jsx
                    └── MonthTable.jsx
                    └── Summary.jsx
            └── 📁slices
                └── apiSlice.js
                └── authSlice.js
                └── cashItemsApiSlice.js
                └── cashSalesApiSlice.js
                └── customerApiSlice.js
                └── dashboardApiSlice.js
                └── expenseApiSlice.js
                └── expenseItemsApiSlice.js
                └── gstItemsApiSlice.js
                └── gstPaidApiSlice.js
                └── gstPurchaseApiSlice.js
                └── gstPurchaseItemsApiSlice.js
                └── gstSalesApiSlice.js
                └── userApiSlice.js
                └── webhookApiSlice.js
            └── store.js
            └── 📁utils
                └── checkSession.js
                └── dateTimeFormatter.js
                └── formatAmount.js
                └── sumOfArray.js
        └── vite.config.js
    └── 📁server
        └── 📁config
            └── db.config.js
            └── nodemailer.config.js
        └── 📁controllers
            └── cashItem.controller.js
            └── cashSales.controller.js
            └── customer.controller.js
            └── dashboard.controller.js
            └── expense.controller.js
            └── expenseItem.controller.js
            └── gstItem.controller.js
            └── gstPaid.controller.js
            └── gstPurchase.controller.js
            └── gstPurchaseItem.controller.js
            └── gstSales.controller.js
            └── user.controller.js
            └── webhookGstOrder.controller.js
            └── webhookOrder.controller.js
        └── 📁data
            └── customer.js
            └── 📁Fonts
                └── Inter.ttc
                └── InterVariable-Italic.ttf
                └── InterVariable.ttf
            └── gstItems.js
            └── items.js
            └── month.js
            └── 📁PdfTemplate
                └── cashItemTable.ejs
                └── cashSaleInvoice.ejs
                └── cashSalesTable.ejs
                └── customerTable.html
                └── gstItemTable.html
                └── gstPurchaseTable.html
                └── gstSaleInvoice.ejs
                └── GstSalesTable.ejs
                └── Logo.png
        └── main.js
        └── 📁middlewares
            └── auth.middleware.js
            └── error.middleware.js
        └── 📁prisma
            └── 📁migrations
                └── 📁20250409100623_init
                    └── migration.sql
                └── migration_lock.toml
            └── schema.prisma
        └── 📁routes
            └── cashItem.route.js
            └── cashSales.route.js
            └── customer.route.js
            └── dashboard.route.js
            └── expense.route.js
            └── expenseItem.route.js
            └── gstItem.route.js
            └── gstPaid.route.js
            └── gstPurchase.route.js
            └── gstPurchaseItem.route.js
            └── gstSales.route.js
            └── users.route.js
            └── webhook.route.js
        └── seeder.js
        └── 📁utils
            └── dateTimeFormatter.js
            └── excelGenerator.js
            └── flattenObject.js
            └── generate-token.utils.js
            └── mailSender.js
            └── pdfGenerator.js
    └── 📁uploads
        └── Logo.png
    └── .babelrc
    └── .env
    └── .gitignore
    └── jsconfig.json
    └── package-lock.json
    └── package.json
    └── README.md
```





