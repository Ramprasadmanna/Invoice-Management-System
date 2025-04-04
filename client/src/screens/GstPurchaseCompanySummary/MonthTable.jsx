import { dateFormatter } from '@utils/dateTimeFormatter';
import formattedAmount from '@utils/formatAmount';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import monthsLong from '@data/monthsLong';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { CURRENT_STATE } from '/src/constants';

const MonthTable = ({ monthlyData, purchaseDetails }) => {
  const [showTable, setShowTable] = useState(false);

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

          <div className='col-span-3 text-right whitespace-nowrap lg:col-span-4 lg:text-left'>
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
          <div className='scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300 overflow-x-scroll pb-4'>
            <table className='mx-4 min-w-full border-collapse border border-slate-500'>
              <thead className='bg-wovBlue text-white'>
                <tr>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase'>
                    #
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    Purchase Date
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    Item Name
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    Invoice Number
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    Company Name
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    State
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    GSTIN
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    Item Type
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    GST %
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    Taxable Amount
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    CGST
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    SGST
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    IGST
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    GST Amount
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    Total
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    Payment Method
                  </th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.data.map((purchase, index) => (
                  <tr key={index}>
                    <td className='border border-slate-400 px-2 py-2 text-xs font-medium whitespace-nowrap text-gray-900'>
                      {index + 1}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {dateFormatter(purchase.purchaseDate)}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {purchaseDetails.name}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {purchase.invoiceNumber}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {purchaseDetails.companyName}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {purchaseDetails.state}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {purchaseDetails.gstNumber}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {purchaseDetails.type}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {purchase.gstSlab}%
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-right text-xs whitespace-nowrap text-gray-900 capitalize'>
                      ₹{formattedAmount(purchase.taxableAmount)}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-right text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {purchase?.cgst
                        ? `₹${formattedAmount(purchase?.cgst)}`
                        : '--'}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-right text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {purchase?.sgst
                        ? `₹${formattedAmount(purchase?.sgst)}`
                        : '--'}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-right text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {purchase?.igst
                        ? `₹${formattedAmount(purchase?.igst)}`
                        : '--'}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-right text-xs whitespace-nowrap text-gray-900 capitalize'>
                      ₹{formattedAmount(purchase.gstAmount)}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-right text-xs whitespace-nowrap text-gray-900 capitalize'>
                      ₹{formattedAmount(purchase.total)}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-right text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {purchase.paymentMethod}
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
  purchaseDetails: PropTypes.object,
};

export default MonthTable;
