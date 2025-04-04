import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '@components/Layout';
import { ToastContainer } from 'react-toastify';
import {
  LoginScreen,
  ErrorScreen,
  InvoiceScreen,
  CustomerScreen,
  ItemsScreen,
  GstSalesScreen,
  SalesScreen,
  GstOrderScreen,
  OrderScreen,
  GstPurchaseItemsScreen,
  GstPurchaseScreen,
  ExpenseItemsScreen,
  ExpenseScreen,
  GstSalesSummaryScreen,
  GstSalesHsnSummaryScreen,
  GstSalesProductSummaryScreen,
  SalesSummaryScreen,
  SalesProductSummaryScreen,
  GstPurchaseCompanySummaryScreen,
  GstPaidScreen,
  ExpenseItemSummaryScreen,
  ProfileScreen,
} from '@screens';

import store from './store';
import PrivateRoute from '@components/PrivateRoute';

// const App = () => {
//   const router = createBrowserRouter([
//     {
//       path: '/',
//       element: <Layout />,
//       errorElement: <ErrorScreen />,
//       children: [
//         {
//           index: true,
//           element: <LoginScreen />,
//         },
//         {
//           path: '/invoice',
//           children: [
//             {
//               path: 'home',
//               element: <InvoiceScreen />,
//             },
//             {
//               path: 'customers',
//               element: <CustomerScreen />,
//             },
//             {
//               path: 'items',
//               element: <ItemsScreen />,
//             },
//             {
//               path: 'gstsales',
//               element: <GstSalesScreen />,
//             },
//             {
//               path: 'cashsales',
//               element: <SalesScreen />,
//             },
//             {
//               path: 'webhook-gst-order',
//               element: <GstOrderScreen />,
//             },
//             {
//               path: 'webhook-order',
//               element: <OrderScreen />,
//             },
//             {
//               path: 'gst-purchase-items',
//               element: <GstPurchaseItemsScreen />,
//             },
//             {
//               path: 'gst-purchase',
//               element: <GstPurchaseScreen />,
//             },
//             {
//               path: 'gst-paid',
//               element: <GstPaidScreen />,
//             },
//           ],
//         },
//         {
//           path: '/summary',
//           children: [
//             {
//               path: 'gst-sales-customer',
//               element: <GstSalesSummaryScreen />,
//             },
//             {
//               path: 'gst-sales-hsn',
//               element: <GstSalesHsnSummaryScreen />,
//             },
//             {
//               path: 'gst-sales-product',
//               element: <GstSalesProductSummaryScreen />,
//             },
//             {
//               path: 'sales-customer',
//               element: <SalesSummaryScreen />,
//             },
//             {
//               path: 'sales-product',
//               element: <SalesProductSummaryScreen />,
//             },
//             {
//               path: 'gst-purchase-items',
//               element: <GstPurchaseItemsSummaryScreen />,
//             },
//           ],
//         },
//       ],
//     },
//   ]);

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      errorElement: <ErrorScreen />,
      children: [
        {
          index: true,
          element: <LoginScreen />,
        },
        {
          path: '',
          element: <PrivateRoute />,
          children: [
            {
              path: '',
              element: <Layout />,
              children: [
                {
                  path: '/invoice',
                  children: [
                    {
                      path: 'home',
                      element: <InvoiceScreen />,
                    },
                    {
                      path: 'customers',
                      element: <CustomerScreen />,
                    },
                    {
                      path: 'items',
                      element: <ItemsScreen />,
                    },
                    {
                      path: 'gstsales',
                      element: <GstSalesScreen />,
                    },
                    {
                      path: 'cashsales',
                      element: <SalesScreen />,
                    },
                    {
                      path: 'webhook-gst-order',
                      element: <GstOrderScreen />,
                    },
                    {
                      path: 'webhook-order',
                      element: <OrderScreen />,
                    },
                    {
                      path: 'gst-purchase-items',
                      element: <GstPurchaseItemsScreen />,
                    },
                    {
                      path: 'gst-purchase',
                      element: <GstPurchaseScreen />,
                    },
                    {
                      path: 'expense-items',
                      element: <ExpenseItemsScreen />,
                    },
                    {
                      path: 'expense',
                      element: <ExpenseScreen />,
                    },
                    {
                      path: 'gst-paid',
                      element: <GstPaidScreen />,
                    },
                  ],
                },
                {
                  path: '/summary',
                  children: [
                    {
                      path: 'gst-sales-customer',
                      element: <GstSalesSummaryScreen />,
                    },
                    {
                      path: 'gst-sales-hsn',
                      element: <GstSalesHsnSummaryScreen />,
                    },
                    {
                      path: 'gst-sales-product',
                      element: <GstSalesProductSummaryScreen />,
                    },
                    {
                      path: 'sales-customer',
                      element: <SalesSummaryScreen />,
                    },
                    {
                      path: 'sales-product',
                      element: <SalesProductSummaryScreen />,
                    },
                    {
                      path: 'gst-purchase-items',
                      element: <GstPurchaseCompanySummaryScreen />,
                    },
                    {
                      path: 'expense-items',
                      element: <ExpenseItemSummaryScreen />,
                    },
                  ],
                },
                {
                  path: '/profile',
                  element: <ProfileScreen />,
                },
              ],
            },
          ],
        },
      ],
    },
  ]);

  return (
    <>
      <Provider store={store}>
        <RouterProvider router={router} />
        <ToastContainer
          position='bottom-right'
          autoClose={5000}
          hideProgressBar
          theme='light'
          closeOnClick
        />
      </Provider>
    </>
  );
};

export default App;
