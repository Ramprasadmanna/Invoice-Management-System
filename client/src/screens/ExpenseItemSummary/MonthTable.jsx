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
              Total Sales : {monthlyData.total_expenses}
            </p>
          </div>

          <div className='col-span-3 text-right whitespace-nowrap lg:col-span-4 lg:text-left'>
            <p className='text-xs font-medium text-slate-500'>
              Total Amount : ₹{formattedAmount(monthlyData.total_price)}
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
                    Expense Date
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    Name
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    Price
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    Payment Method
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    Quantity
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    Remarks
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
                      {dateFormatter(purchase.expenseDate)}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {purchaseDetails.name}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {purchase.price}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {purchase.paymentMethod}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {purchase.quantity}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {purchase.remarks}
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
