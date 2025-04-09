## API Documentation

All APIs follow RESTful standards and are prefixed with `/api/v1`.

### Base URL
http://<your-domain-or-ip>/api/v1

## 📁 User API

All routes are prefixed with: `/api/v1/users`

---

### 🔐 Login User

- **Method:** `POST`
- **Endpoint:** `/api/v1/users/login`
- **Access:** Public  
- **Description:** Authenticates a user with email and password, returns a token on success.

---

### 🚪 Logout User

- **Method:** `POST`
- **Endpoint:** `/api/v1/users/logout`
- **Access:** Private  
- **Description:** Logs out a user by clearing the token from cookies.

---

### 🧑‍💼 Create User

- **Method:** `POST`
- **Endpoint:** `/api/v1/users/`
- **Access:** Private (Admin only)  
- **Description:** Creates a new user account.

---

### ✏️ Update User Profile

- **Method:** `PUT`
- **Endpoint:** `/api/v1/users/profile/:id`
- **Access:** Private  
- **Description:** Updates user information based on their ID.

---

### 👥 Get All Users

- **Method:** `GET`
- **Endpoint:** `/api/v1/users`
- **Access:** Private (Admin only)  
- **Description:** Returns list of all users in the system.

---

### ❌ Delete User

- **Method:** `DELETE`
- **Endpoint:** `/api/v1/users/:id`
- **Access:** Private (Admin only)  
- **Description:** Deletes a user by ID.

## 📁 Customer API

All routes are prefixed with: `/api/v1/customer`

---

### ➕ Create New Customer

- **Method:** `POST`
- **Endpoint:** `/api/v1/customer`
- **Access:** Private (Admin only)  
- **Description:** Adds a new customer to the system.

---

### 📋 Get All Customers

- **Method:** `GET`
- **Endpoint:** `/api/v1/customer`
- **Access:** Private  
- **Description:** Retrieves a list of all customers with pagination.

---

### 🔍 Search Customers

- **Method:** `GET`
- **Endpoint:** `/api/v1/customer/search?keyword=John`
- **Access:** Private  
- **Description:** Searches customers by keyword. Does not support pagination.  
- **Query Params:**  
  - `keyword` *(string, required)* – Search term to filter customers.

---

### ✏️ Update Customer

- **Method:** `PUT`
- **Endpoint:** `/api/v1/customer/:id`
- **Access:** Private (Admin only)  
- **Description:** Updates customer details by ID.

---

### ❌ Delete Customer

- **Method:** `DELETE`
- **Endpoint:** `/api/v1/customer/:id`
- **Access:** Private (Admin only)  
- **Description:** Deletes a customer by ID.

---

### 📥 Download Customer List (PDF)

- **Method:** `POST`
- **Endpoint:** `/api/v1/customer/download/pdf`
- **Access:** Private (Admin only)  
- **Description:** Generates and downloads a PDF file of all customers.

---

### 📥 Download Customer List (Excel)

- **Method:** `POST`
- **Endpoint:** `/api/v1/customer/download/excel`
- **Access:** Private (Admin only)  
- **Description:** Generates and downloads an Excel file of all customers.

## 📁 GST Item API

All routes are prefixed with: `/api/v1/gstItem`

---

### ➕ Create New GST Item

- **Method:** `POST`
- **Endpoint:** `/api/v1/gstItem`
- **Access:** Private (Admin only)  
- **Description:** Adds a new GST item to the system.

---

### 📋 Get All GST Items

- **Method:** `GET`
- **Endpoint:** `/api/v1/gstItem`
- **Access:** Private  
- **Description:** Retrieves a paginated list of all GST items.

---

### 🔍 Search GST Items

- **Method:** `GET`
- **Endpoint:** `/api/v1/gstItem/search?keyword=Service`
- **Access:** Private  
- **Description:** Searches GST items by keyword without pagination.  
- **Query Params:**  
  - `keyword` *(string, required)* – Search term for item name/code.

---

### ✏️ Update GST Item

- **Method:** `PUT`
- **Endpoint:** `/api/v1/gstItem/:id`
- **Access:** Private (Admin only)  
- **Description:** Updates a GST item’s details using its ID.

---

### ❌ Delete GST Item

- **Method:** `DELETE`
- **Endpoint:** `/api/v1/gstItem/:id`
- **Access:** Private (Admin only)  
- **Description:** Deletes a GST item by ID.

---

### 📥 Download GST Items List (PDF)

- **Method:** `POST`
- **Endpoint:** `/api/v1/gstItem/download/pdf`
- **Access:** Private (Admin only)  
- **Description:** Generates a PDF file of the GST items list for download.

---

### 📥 Download GST Items List (Excel)

- **Method:** `POST`
- **Endpoint:** `/api/v1/gstItem/download/excel`
- **Access:** Private (Admin only)  
- **Description:** Generates an Excel file of the GST items list for download.

## 📁 Item API

All routes are prefixed with: `/api/v1/cashItem`

---

### ➕ Create New Item

- **Method:** `POST`
- **Endpoint:** `/api/v1/cashItem`
- **Access:** Private (Admin only)  
- **Description:** Adds a new cash item to the system.

---

### 📋 Get All Items

- **Method:** `GET`
- **Endpoint:** `/api/v1/cashItem`
- **Access:** Private  
- **Description:** Retrieves a paginated list of all cash items.

---

### 🔍 Search Items

- **Method:** `GET`
- **Endpoint:** `/api/v1/cashItem/search?keyword=ProductName`
- **Access:** Private  
- **Description:** Searches cash items by keyword without pagination.  
- **Query Params:**  
  - `keyword` *(string, required)* – Term to match item name/code.

---

### ✏️ Update Item

- **Method:** `PUT`
- **Endpoint:** `/api/v1/cashItem/:id`
- **Access:** Private (Admin only)  
- **Description:** Updates a specific cash item's details by ID.

---

### ❌ Delete Item

- **Method:** `DELETE`
- **Endpoint:** `/api/v1/cashItem/:id`
- **Access:** Private (Admin only)  
- **Description:** Deletes a specific cash item by ID.

---

### 📥 Download Cash Items List (PDF)

- **Method:** `POST`
- **Endpoint:** `/api/v1/cashItem/download/pdf`
- **Access:** Private (Admin only)  
- **Description:** Generates and downloads a PDF file of the entire cash items list.

---

### 📥 Download Cash Items List (Excel)

- **Method:** `POST`
- **Endpoint:** `/api/v1/cashItem/download/excel`
- **Access:** Private (Admin only)  
- **Description:** Generates and downloads an Excel file of the entire cash items list.

## 📁 GST Sales API

All routes are prefixed with: `/api/v1/gstSale`  
(Summary routes use `/api/v1/gstSales`)

---

### ➕ Add GST Sale

- **Method:** `POST`
- **Endpoint:** `/api/v1/gstSale/`
- **Access:** Private (Admin only)  
- **Description:** Adds a new GST Sale entry.

---

### ✏️ Update GST Sale

- **Method:** `PUT`
- **Endpoint:** `/api/v1/gstSale/:id`
- **Access:** Private (Admin only)  
- **Description:** Updates GST Sale entry by ID.

---

### ❌ Delete GST Sale

- **Method:** `DELETE`
- **Endpoint:** `/api/v1/gstSale/:id`
- **Access:** Private (Admin only)  
- **Description:** Deletes GST Sale entry by ID.

---

### 📋 Get All GST Sales

- **Method:** `GET`
- **Endpoint:** `/api/v1/gstSale/`
- **Access:** Private  
- **Description:** Retrieves a list of all GST sales records.

---

### 🧾 Preview GST Sale Invoice (PDF)

- **Method:** `GET`
- **Endpoint:** `/api/v1/gstSale/invoice/preview/:id`
- **Access:** Private (Admin only)  
- **Description:** Displays PDF preview of GST invoice.

---

### 📥 Download GST Sale Invoice (PDF)

- **Method:** `GET`
- **Endpoint:** `/api/v1/gstSale/invoice/download/:id`
- **Access:** Private (Admin only)  
- **Description:** Downloads the GST invoice in PDF format.

---

### 📧 Send Invoice Mail (PDF)

- **Method:** `GET`
- **Endpoint:** `/api/v1/gstSale/invoice/sendMail/:id`
- **Access:** Private (Admin only)  
- **Description:** Sends the GST invoice PDF to customer via email.

---

### 📥 Download GST Sales List (PDF)

- **Method:** `POST`
- **Endpoint:** `/api/v1/gstSale/download/pdf`
- **Access:** Private (Admin only)  
- **Description:** Downloads the full GST sales list in PDF format.

---

### 📥 Download GST Sales List (Excel)

- **Method:** `POST`
- **Endpoint:** `/api/v1/gstSale/download/excel`
- **Access:** Private (Admin only)  
- **Description:** Downloads the full GST sales list in Excel format.

---

### 📊 GST Sales Summary (Customer-wise)

- **Method:** `GET`
- **Endpoint:** `/api/v1/gstSales/summary/customer`
- **Access:** Private  
- **Description:** Retrieves GST sales summary grouped by customers.

---

### 📥 Download Customer-wise Summary (Excel)

- **Method:** `POST`
- **Endpoint:** `/api/v1/gstSales/download/summary/customers`
- **Access:** Private (Admin only)  
- **Description:** Downloads customer-wise GST summary in Excel format.

---

### 📊 GST Sales Summary (HSN-wise)

- **Method:** `GET`
- **Endpoint:** `/api/v1/gstSales/summary/hsn`
- **Access:** Private  
- **Description:** Retrieves GST sales summary grouped by HSN codes.

---

### 📥 Download HSN-wise Summary (Excel)

- **Method:** `POST`
- **Endpoint:** `/api/v1/gstSales/download/summary/hsn`
- **Access:** Private (Admin only)  
- **Description:** Downloads HSN-wise GST summary in Excel format.

---

### 📊 GST Sales Summary (Product-wise)

- **Method:** `GET`
- **Endpoint:** `/api/v1/gstSales/summary/product`
- **Access:** Private  
- **Description:** Retrieves GST sales summary grouped by products.

---

### 📥 Download Product-wise Summary (Excel)

- **Method:** `POST`
- **Endpoint:** `/api/v1/gstSales/download/summary/product`
- **Access:** Private (Admin only)  
- **Description:** Downloads product-wise GST summary in Excel format.

## 💵 Sales API

All routes are prefixed with: `/api/v1/cashSale`  
(Summary routes use `/api/v1/cashSales`)

---

### ➕ Add Cash Sale

- **Method:** `POST`
- **Endpoint:** `/api/v1/cashSale/`
- **Access:** Private (Admin only)  
- **Description:** Adds a new cash sale entry.

---

### ✏️ Update Cash Sale

- **Method:** `PUT`
- **Endpoint:** `/api/v1/cashSale/:id`
- **Access:** Private (Admin only)  
- **Description:** Updates a cash sale entry by ID.

---

### ❌ Delete Cash Sale

- **Method:** `DELETE`
- **Endpoint:** `/api/v1/cashSale/:id`
- **Access:** Private (Admin only)  
- **Description:** Deletes a cash sale entry by ID.

---

### 📋 Get All Cash Sales

- **Method:** `GET`
- **Endpoint:** `/api/v1/cashSale/`
- **Access:** Private  
- **Description:** Retrieves a list of all cash sales records.

---

### 🧾 Preview Cash Sale Invoice (PDF)

- **Method:** `GET`
- **Endpoint:** `/api/v1/cashSale/invoice/preview/:id`
- **Access:** Private (Admin only)  
- **Description:** Displays PDF preview of a cash sale invoice.

---

### 📥 Download Cash Sale Invoice (PDF)

- **Method:** `GET`
- **Endpoint:** `/api/v1/cashSale/invoice/download/:id`
- **Access:** Private (Admin only)  
- **Description:** Downloads the cash sale invoice in PDF format.

---

### 📧 Send Cash Sale Invoice via Mail

- **Method:** `GET`
- **Endpoint:** `/api/v1/cashSale/invoice/sendMail/:id`
- **Access:** Private (Admin only)  
- **Description:** Sends the invoice PDF via email to the customer.

---

### 📥 Download All Cash Sales (PDF)

- **Method:** `POST`
- **Endpoint:** `/api/v1/cashSale/download/pdf`
- **Access:** Private (Admin only)  
- **Description:** Downloads all cash sales data as a PDF.

---

### 📥 Download All Cash Sales (Excel)

- **Method:** `POST`
- **Endpoint:** `/api/v1/cashSale/download/excel`
- **Access:** Private (Admin only)  
- **Description:** Downloads all cash sales data as an Excel file.

---

### 📊 Cash Sales Summary (Customer-wise)

- **Method:** `GET`
- **Endpoint:** `/api/v1/cashSales/summary/customer`
- **Access:** Private  
- **Description:** Retrieves cash sales summary grouped by customers.

---

### 📥 Download Customer-wise Summary (Excel)

- **Method:** `POST`
- **Endpoint:** `/api/v1/cashSales/download/summary/customers`
- **Access:** Private (Admin only)  
- **Description:** Downloads customer-wise cash sales summary in Excel.

---

### 📊 Cash Sales Summary (Product-wise)

- **Method:** `GET`
- **Endpoint:** `/api/v1/cashSales/summary/product`
- **Access:** Private  
- **Description:** Retrieves cash sales summary grouped by products.

---

### 📥 Download Product-wise Summary (Excel)

- **Method:** `POST`
- **Endpoint:** `/api/v1/cashSales/download/summary/product`
- **Access:** Private (Admin only)  
- **Description:** Downloads product-wise cash sales summary in Excel.

## 🔄 Webhook GST Order API

---

### 📬 Add Webhook GST Order (Public)

- **Method:** `POST`
- **Endpoint:** `/api/v1/webhook/{GST_ORDER_UUID}/gstOrder`
- **Access:** Public  
- **Description:** Accepts a webhook GST order from external systems.
> ✅ `:uuid` is dynamically set in `.env` file as `GST_ORDER_UUID`.
> 
#### 📝 Sample Request Body:

```json
{
  "customerType": "Individual",
  "salutation": "Mr",
  "firstName": "Rahul",
  "lastName": "Verma",
  "email": "abc@gmail.com",
  "workPhone": "+91 7896546789",
  "mobile": "+91 9876512345",
  "placeOfSupply": "Maharashtra",

  "billingCountry": "India",
  "billingState": "Maharashtra",
  "billingCity": "Mumbai",
  "billingAddress": "Bandra",
  "billingZipcode": "400050",
  
  "shippingCountry": "India",
  "shippingState": "Maharashtra",
  "shippingCity": "Mumbai",
  "shippingAddress": "Bandra",
  "shippingZipcode": "400050",

  "items": [
    { "id": 1, "quantity": 4 },
    { "id": 12, "quantity": 3 }
  ],

  "businessLegalName": "Rahul Enterprises", // optional
  "gstNumber": "27ABCDE1234F2Z5" // optional
}
```


---

### 📥 Get All Webhook GST Orders

- **Method:** `GET`  
- **Endpoint:** `/api/v1/webhook/gstOrder`  
- **Access:** Private (Admin only)  
- **Description:** Fetches all GST orders received via webhook.

---


### 🔄 Convert Webhook Order to GST Sale

- **Method:** `POST`  
- **Endpoint:** `/api/v1/webhook/:id/confirmGstOrder`  
- **Access:** Private (Admin only)  
- **Description:** Converts a webhook GST order into a permanent GST sale record in the system.

## 🔄 Webhook Order API

All routes are prefixed with: `/api/v1/webhook`  
(Some routes require a dynamic `UUID` prefix set via `.env` as `ORDER_UUID`)

---

### ➕ Add Webhook Order

- **Method:** `POST`  
- **Endpoint:** `/api/v1/webhook/:uuid/order`  
- **Access:** Public  
- **Description:** Accepts new order data (non-GST) via webhook and stores it temporarily.

> ✅ `:uuid` is dynamically set in `.env` file as `ORDER_UUID`.

#### 📝 Sample Request Body:

```json
{
  "customerType": "Individual",
  "salutation": "Mr",
  "firstName": "Rahul",
  "lastName": "Verma",
  "email": "abc@gmail.com",
  "workPhone": "+91 7896546789",
  "mobile": "+91 9876512345",
  "placeOfSupply": "Maharashtra",

  "billingCountry": "India",
  "billingState": "Maharashtra",
  "billingCity": "Mumbai",
  "billingAddress": "Bandra",
  "billingZipcode": "400050",
  
  "shippingCountry": "India",
  "shippingState": "Maharashtra",
  "shippingCity": "Mumbai",
  "shippingAddress": "Bandra",
  "shippingZipcode": "400050",

  "items": [
    { "id": 1, "quantity": 4 },
    { "id": 12, "quantity": 3 }
  ],

  "businessLegalName": "Rahul Enterprises", // optional
  "gstNumber": "27ABCDE1234F2Z5" // optional
}
```


---

### 📥 Get All Webhook Orders

- **Method:** `GET`  
- **Endpoint:** `/api/v1/webhook/order`  
- **Access:** Private (Admin only)  
- **Description:** Fetches all orders received via webhook.

---

### 🔄 Convert Webhook Order to Cash Sale

- **Method:** `POST`  
- **Endpoint:** `/api/v1/webhook/:id/confirmOrder`  
- **Access:** Private (Admin only)  
- **Description:** Converts a webhook order into a permanent cash sale entry in the system.

## 📦 GST Purchase Item API

All routes are prefixed with: `/api/v1/gstPurchaseItem`

---

### ➕ Create New GST Purchase Item

- **Method:** `POST`  
- **Endpoint:** `/api/v1/gstPurchaseItem/`  
- **Access:** Private (Admin only)  
- **Description:** Adds a new GST purchase item to the system.

---

### 📄 Get All GST Purchase Items

- **Method:** `GET`  
- **Endpoint:** `/api/v1/gstPurchaseItem/`  
- **Access:** Private  
- **Description:** Retrieves all GST purchase items.

---

### 🔍 Search GST Purchase Items

- **Method:** `GET`  
- **Endpoint:** `/api/v1/gstPurchaseItem/search?keyword=abc`  
- **Access:** Private  
- **Description:** Searches GST purchase items by keyword (no pagination).

---

### ✏️ Update GST Purchase Item

- **Method:** `PUT`  
- **Endpoint:** `/api/v1/gstPurchaseItem/:id`  
- **Access:** Private (Admin only)  
- **Description:** Updates an existing GST purchase item by ID.

---

### ❌ Delete GST Purchase Item

- **Method:** `DELETE`  
- **Endpoint:** `/api/v1/gstPurchaseItem/:id`  
- **Access:** Private (Admin only)  
- **Description:** Deletes a GST purchase item by ID.

---

### 📥 Download All GST Purchase Items (Excel)

- **Method:** `POST`  
- **Endpoint:** `/api/v1/gstPurchaseItem/download/excel`  
- **Access:** Private (Admin only)  
- **Description:** Downloads all GST purchase items as an Excel file.

## 🧾 GST Purchase API

All routes are prefixed with: `/api/v1/gstPurchase`

---

### ➕ Create New GST Purchase

- **Method:** `POST`  
- **Endpoint:** `/api/v1/gstPurchase/`  
- **Access:** Private (Admin only)  
- **Description:** Adds a new GST purchase record.

---

### 📄 Get All GST Purchases

- **Method:** `GET`  
- **Endpoint:** `/api/v1/gstPurchase/`  
- **Access:** Private  
- **Description:** Retrieves all GST purchase records.

---

### ✏️ Update GST Purchase

- **Method:** `PUT`  
- **Endpoint:** `/api/v1/gstPurchase/:id`  
- **Access:** Private (Admin only)  
- **Description:** Updates a GST purchase by ID.

---

### ❌ Delete GST Purchase

- **Method:** `DELETE`  
- **Endpoint:** `/api/v1/gstPurchase/:id`  
- **Access:** Private (Admin only)  
- **Description:** Deletes a GST purchase by ID.

---

### 📥 Download All GST Purchases (Excel)

- **Method:** `POST`  
- **Endpoint:** `/api/v1/gstPurchase/download/excel`  
- **Access:** Private (Admin only)  
- **Description:** Downloads all GST purchases as an Excel file.

---

### 🧮 Get GST Purchase Summary (Company Wise)

- **Method:** `GET`  
- **Endpoint:** `/api/v1/gstPurchase/summary/company`  
- **Access:** Private  
- **Description:** Retrieves company-wise summary of GST purchases.

---

### 📥 Download GST Purchase Summary (Company Wise - Excel)

- **Method:** `POST`  
- **Endpoint:** `/api/v1/gstPurchase/download/summary/company`  
- **Access:** Private (Admin only)  
- **Description:** Downloads the company-wise GST purchase summary as an Excel file.

## 💼 Expense Item API

All routes are prefixed with: `/api/v1/expenseItems`  
(Some routes use `/api/v1/expenseItem`)

---

### ➕ Create New Expense Item

- **Method:** `POST`  
- **Endpoint:** `/api/v1/expenseItems/`  
- **Access:** Private (Admin only)  
- **Description:** Creates a new expense item.

---

### 📄 Get All Expense Items

- **Method:** `GET`  
- **Endpoint:** `/api/v1/expenseItems/`  
- **Access:** Private  
- **Description:** Retrieves all expense items.

---

### 🔍 Search Expense Items (No Pagination)

- **Method:** `GET`  
- **Endpoint:** `/api/v1/expenseItem/search`  
- **Query Param:** `keyword` (string, required)  
- **Access:** Private  
- **Description:** Searches expense items based on the provided keyword.

---

### ✏️ Update Expense Item

- **Method:** `PUT`  
- **Endpoint:** `/api/v1/expenseItem/:id`  
- **Access:** Private (Admin only)  
- **Description:** Updates an expense item by ID.

---

### ❌ Delete Expense Item

- **Method:** `DELETE`  
- **Endpoint:** `/api/v1/expenseItem/:id`  
- **Access:** Private (Admin only)  
- **Description:** Deletes an expense item by ID.

---

### 📥 Download All Expense Items (Excel)

- **Method:** `POST`  
- **Endpoint:** `/api/v1/expenseItem/download/excel`  
- **Access:** Private (Admin only)  
- **Description:** Downloads all expense items as an Excel file.

## 💸 Expense API

All routes are prefixed with: `/api/v1/expense`

---

### ➕ Create New Expense

- **Method:** `POST`  
- **Endpoint:** `/api/v1/expense/`  
- **Access:** Private (Admin only)  
- **Description:** Creates a new expense record.

---

### 📄 Get All Expenses

- **Method:** `GET`  
- **Endpoint:** `/api/v1/expense/`  
- **Access:** Private  
- **Description:** Retrieves all expense records.

---

### ✏️ Update Expense

- **Method:** `PUT`  
- **Endpoint:** `/api/v1/expense/:id`  
- **Access:** Private (Admin only)  
- **Description:** Updates an existing expense by ID.

---

### ❌ Delete Expense

- **Method:** `DELETE`  
- **Endpoint:** `/api/v1/expense/:id`  
- **Access:** Private (Admin only)  
- **Description:** Deletes an expense by ID.

---

### 📥 Download All Expenses (Excel)

- **Method:** `POST`  
- **Endpoint:** `/api/v1/expense/download/excel`  
- **Access:** Private (Admin only)  
- **Description:** Downloads all expenses in Excel format.

---

### 📊 Get Expense Summary (Item Name Wise)

- **Method:** `GET`  
- **Endpoint:** `/api/v1/expense/summary/item`  
- **Access:** Private  
- **Description:** Retrieves item-wise expense summary.

---

### 📥 Download Expense Summary (Item Name Wise - Excel)

- **Method:** `POST`  
- **Endpoint:** `/api/v1/expense/download/summary/item`  
- **Access:** Private (Admin only)  
- **Description:** Downloads item-wise expense summary as an Excel file.

## 🧾 GST Paid API

All routes are prefixed with: `/api/v1/gstPaid`

---

### ➕ Add GST Paid

- **Method:** `POST`  
- **Endpoint:** `/api/v1/gstPaid`  
- **Access:** Private (Admin only)  
- **Description:** Adds a new GST paid entry.

---

### 📄 Get All GST Paid

- **Method:** `GET`  
- **Endpoint:** `/api/v1/gstPaid/:year`  
- **Access:** Private  
- **Description:** Retrieves all GST paid entries for a specific year.

---

### ✏️ Update GST Paid

- **Method:** `PUT`  
- **Endpoint:** `/api/v1/gstPaid/:id`  
- **Access:** Private (Admin only)  
- **Description:** Updates a GST paid entry by ID.

---

### ❌ Delete GST Paid

- **Method:** `DELETE`  
- **Endpoint:** `/api/v1/gstPaid/:id`  
- **Access:** Private (Admin only)  
- **Description:** Deletes a GST paid entry by ID.

---

### 📥 Download GST Paid (Excel)

- **Method:** `POST`  
- **Endpoint:** `/api/v1/gstPaid/download/excel`  
- **Access:** Private (Admin only)  
- **Description:** Downloads all GST paid records in Excel format.

## 📊 Dashboard API

All routes are prefixed with: `/api/v1/dashboard`

---

### 📈 Aggregated Graph Data (GST Sales, GST Purchase, Sales)

- **Method:** `GET`  
- **Endpoint:** `/api/v1/dashboard/graph`  
- **Access:** Private (Admin only)  
- **Description:** Fetches data for dashboard graphs by aggregating GST sales, GST purchases, and sales.

---

### 📦 Aggregated GST Sales Data

- **Method:** `GET`  
- **Endpoint:** `/api/v1/dashboard/gstSales`  
- **Access:** Private (Admin only)  
- **Description:** Returns aggregated GST sales data.

---

### 🧾 Aggregated GST Purchase Data

- **Method:** `GET`  
- **Endpoint:** `/api/v1/dashboard/gstPurchase`  
- **Access:** Private (Admin only)  
- **Description:** Returns aggregated GST purchase data.

---

### 🔄 Aggregated GST Sales - GST Purchase

- **Method:** `GET`  
- **Endpoint:** `/api/v1/dashboard/gstsales-gstpurchase`  
- **Access:** Private (Admin only)  
- **Description:** Compares GST sales vs GST purchases and returns aggregated data.

---

### 💵 Aggregated Sales Data

- **Method:** `GET`  
- **Endpoint:** `/api/v1/dashboard/sales`  
- **Access:** Private (Admin only)  
- **Description:** Returns aggregated sales data.

---

## ⚙️ Project Setup