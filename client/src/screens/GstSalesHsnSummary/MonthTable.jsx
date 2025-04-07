import { dateFormatter } from '@utils/dateTimeFormatter';
import formattedAmount from '@utils/formatAmount';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import monthsLong from '@data/monthsLong';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { CURRENT_STATE } from '/src/constants';

const MonthTable = ({ monthlyData }) => {
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
                    GSTIN
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    State
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    B2B / B2C
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    Item Name
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    Description
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    Item Type
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    GST %
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    Quantity
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    Rate
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    Taxable Amount
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    CGST
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    SGST
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    IGST
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    Tax Amount
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap border border-slate-400 px-2 py-2 text-left text-xs font-medium uppercase'>
                    Total Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.data.map((saleDetails, index) => (
                  <tr key={index}>
                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-xs font-medium text-gray-900'>
                      {index + 1}
                    </td>
                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-xs capitalize text-gray-900'>
                      {dateFormatter(saleDetails.invoiceDate)}
                    </td>
                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-xs capitalize text-gray-900'>
                      {saleDetails.invoiceNumber}
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
                      {saleDetails.customer.gstNumber
                        ? saleDetails.customer.gstNumber
                        : '---'}
                    </td>
                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-xs capitalize text-gray-900'>
                      {saleDetails.customer.placeOfSupply}
                    </td>
                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-xs capitalize text-gray-900'>
                      {saleDetails.customer.businessLegalName ? 'B2B' : 'B2C'}
                    </td>
                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-xs capitalize text-gray-900'>
                      {saleDetails.item.name}
                    </td>
                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-xs capitalize text-gray-900'>
                      {saleDetails.item.description}
                    </td>
                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-xs capitalize text-gray-900'>
                      {saleDetails.item.type}
                    </td>
                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-xs capitalize text-gray-900'>
                      {saleDetails.item.gstSlab}%
                    </td>
                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-xs capitalize text-gray-900'>
                      {saleDetails.item.quantity}
                    </td>
                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-right text-xs capitalize text-gray-900'>
                      ₹{formattedAmount(saleDetails.item.rate)}
                    </td>
                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-right text-xs capitalize text-gray-900'>
                      ₹{formattedAmount(saleDetails.item.taxableAmount)}
                    </td>

                    {CURRENT_STATE ===
                    saleDetails.customer.placeOfSupply?.toLowerCase() ? (
                      <>
                        <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-right text-xs capitalize text-gray-900'>
                          {saleDetails.item.cgst
                            ? `₹${formattedAmount(saleDetails.item.cgst)}`
                            : '--'}
                        </td>
                        <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-right text-xs capitalize text-gray-900'>
                          {saleDetails.item.sgst
                            ? `₹${formattedAmount(saleDetails.item.sgst)}`
                            : '--'}
                        </td>
                        <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-right text-xs capitalize text-gray-900'>
                          ---
                        </td>
                      </>
                    ) : (
                      <>
                        <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-right text-xs capitalize text-gray-900'>
                          ---
                        </td>
                        <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-right text-xs capitalize text-gray-900'>
                          ---
                        </td>
                        <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-right text-xs capitalize text-gray-900'>
                          {saleDetails.item.igst
                            ? `₹${formattedAmount(saleDetails.item.igst)}`
                            : '--'}
                        </td>
                      </>
                    )}

                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-right text-xs capitalize text-gray-900'>
                      ₹{formattedAmount(saleDetails.item.gstAmount)}
                    </td>
                    <td className='whitespace-nowrap border border-slate-400 px-2 py-2 text-right text-xs capitalize text-gray-900'>
                      ₹{formattedAmount(saleDetails.item.total)}
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
