import { dateFormatter } from '@utils/dateTimeFormatter';
import formattedAmount from '@utils/formatAmount';
import ItemsTable from './ItemsTable';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import monthsLong from '@data/monthsLong';
import { useState } from 'react';
import PropTypes from 'prop-types';

const MonthTable = ({ monthlyData, saleDetails }) => {
  const [showTable, setShowTable] = useState(false);
  const [showItemsDetails, setShowItemsDetails] = useState(false);
  return (
    <>
      <div className='bg-gray-50'>
        <div
          className='grid cursor-pointer grid-cols-5 gap-4 px-4 py-4 lg:grid-cols-12 lg:gap-6'
          onClick={() => setShowTable(!showTable)}>
          <div className='col-span-4 lg:col-span-5'>
            <p className='text-sm font-medium'>
              {monthsLong[monthlyData.month]} {monthlyData.year}
            </p>
          </div>

          <div className='col-span-2 whitespace-nowrap lg:col-span-2'>
            <p className='text-xs font-medium text-slate-500'>
              Total Sales : {monthlyData.total_purchase}
            </p>
          </div>

          <div className='col-span-3 whitespace-nowrap text-right lg:col-span-4 lg:text-left'>
            <p className='text-xs font-medium text-slate-500'>
              Total Amount : ₹{formattedAmount(monthlyData.total_amount)}
            </p>
          </div>

          <div className='col-start-5 col-end-6 row-start-1 row-end-2 whitespace-nowrap lg:col-start-12 lg:col-end-13'>
            {showTable ? (
              <ChevronUpIcon className='ml-auto size-4' />
            ) : (
              <ChevronDownIcon className='ml-auto size-4' />
            )}
          </div>
        </div>

        {showTable && (
          <div className='overflow-x-scroll pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300'>
            <table className='mx-4 min-w-full border-collapse border border-slate-500'>
              <thead className='bg-wovBlue text-white'>
                <tr>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase text-gray-400'>
                    #
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    Invoice Date
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    Invoice Number
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    Name
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    Company Name
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    <div className='flex items-center justify-between gap-6'>
                      Items Details
                      {showItemsDetails && (
                        <EyeIcon
                          className='size-4 cursor-pointer'
                          onClick={() => setShowItemsDetails(false)}
                        />
                      )}
                      {!showItemsDetails && (
                        <EyeSlashIcon
                          className='size-4 cursor-pointer'
                          onClick={() => setShowItemsDetails(true)}
                        />
                      )}
                    </div>
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    B2B / B2C
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    State
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    Price
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    Shipping
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    Discount
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    Adjustment
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    Total Amount
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    Advance Paid
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    Balance Due
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    Account
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    Order Number
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.data.map((invoice, index) => (
                  <tr key={index}>
                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-xs font-medium text-gray-900'>
                      {index + 1}
                    </td>
                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-xs capitalize text-gray-900'>
                      {dateFormatter(invoice.invoiceDate)}
                    </td>
                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-xs capitalize text-gray-900'>
                      {invoice.invoiceNumber}
                    </td>
                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-xs capitalize text-gray-900'>
                      {`${saleDetails.customer.salutation} ${saleDetails.customer.firstName} ${saleDetails.customer.lastName}`}
                    </td>
                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-xs capitalize text-gray-900'>
                      {saleDetails.customer.businessLegalName
                        ? saleDetails.customer.businessLegalName
                        : '---'}
                    </td>
                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-xs capitalize text-gray-900'>
                      <ItemsTable
                        invoice={invoice}
                        showItemsDetails={showItemsDetails}
                      />
                    </td>
                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-xs capitalize text-gray-900'>
                      {saleDetails.customer.businessLegalName ? 'B2B' : 'B2C'}
                    </td>
                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-xs capitalize text-gray-900'>
                      {saleDetails.customer.placeOfSupply}
                    </td>
                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-xs capitalize text-gray-900'>
                      ₹{formattedAmount(invoice.price)}
                    </td>
                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-right text-xs capitalize text-gray-900'>
                      ₹{formattedAmount(invoice.shippingCharges)}
                    </td>
                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-right text-xs capitalize text-gray-900'>
                      ₹{formattedAmount(invoice.discount)}
                    </td>
                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-right text-xs capitalize text-gray-900'>
                      ₹{formattedAmount(invoice.otherAdjustments)}
                    </td>
                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-right text-xs capitalize text-gray-900'>
                      ₹{formattedAmount(invoice.total)}
                    </td>
                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-right text-xs capitalize text-gray-900'>
                      {invoice.advanceAmount
                        ? `₹${formattedAmount(invoice.advanceAmount)}`
                        : '---'}
                    </td>
                    <td
                      className={`${invoice.balanceDue > 0 && 'text-red-500'} whitespace-nowrap border border-slate-400 px-2 py-2 text-right text-xs capitalize text-gray-900`}>
                      {invoice.balanceDue
                        ? `₹${formattedAmount(invoice.balanceDue)}`
                        : '---'}
                    </td>
                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs capitalize text-gray-900'>
                      {invoice.accountType}
                    </td>
                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-xs capitalize text-gray-900'>
                      {invoice.orderNumber ? invoice.orderNumber : '---'}
                    </td>

                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-xs capitalize text-gray-900'>
                      {dateFormatter(invoice.dueDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

MonthTable.propTypes = {
  monthlyData: PropTypes.object,
  saleDetails: PropTypes.object,
};

export default MonthTable;
