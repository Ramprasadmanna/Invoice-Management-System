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
                    Invoice Date
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    Invoice Number
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    Name
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    Company Name
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    GSTIN
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    State
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    B2B / B2C
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    Item Name
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    Description
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
                    HSN/SAC
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    Quantity
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    Rate
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
                    Tax Amount
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-2 py-2 text-left text-xs font-medium whitespace-nowrap uppercase'>
                    Total Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.data.map((saleDetails, index) => (
                  <tr key={index}>
                    <td className='border border-slate-400 px-2 py-2 text-xs font-medium whitespace-nowrap text-gray-900'>
                      {index + 1}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {dateFormatter(saleDetails.invoiceDate)}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {saleDetails.invoiceNumber}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {`${saleDetails.customer.salutation} ${saleDetails.customer.firstName} ${saleDetails.customer.lastName}`}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {saleDetails.customer.businessLegalName
                        ? saleDetails.customer.businessLegalName
                        : '---'}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {saleDetails.customer.gstNumber
                        ? saleDetails.customer.gstNumber
                        : '---'}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {saleDetails.customer.placeOfSupply}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {saleDetails.customer.businessLegalName ? 'B2B' : 'B2C'}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {saleDetails.items.name}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {saleDetails.items.description}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {saleDetails.items.type}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {saleDetails.items.gstSlab}%
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {saleDetails.items.hsnCode}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {saleDetails.items.quantity}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-right text-xs whitespace-nowrap text-gray-900 capitalize'>
                      ₹{formattedAmount(saleDetails.items.rate)}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-right text-xs whitespace-nowrap text-gray-900 capitalize'>
                      ₹{formattedAmount(saleDetails.items.taxableAmount)}
                    </td>

                    {CURRENT_STATE ===
                    saleDetails.customer.placeOfSupply?.toLowerCase() ? (
                      <>
                        <td className='border border-slate-400 px-2 py-2 text-right text-xs whitespace-nowrap text-gray-900 capitalize'>
                          {saleDetails.items.cgst
                            ? `₹${formattedAmount(saleDetails.items.cgst)}`
                            : '--'}
                        </td>
                        <td className='border border-slate-400 px-2 py-2 text-right text-xs whitespace-nowrap text-gray-900 capitalize'>
                          {saleDetails.items.sgst
                            ? `₹${formattedAmount(saleDetails.items.sgst)}`
                            : '--'}
                        </td>
                        <td className='border border-slate-400 px-2 py-2 text-right text-xs whitespace-nowrap text-gray-900 capitalize'>
                          ---
                        </td>
                      </>
                    ) : (
                      <>
                        <td className='border border-slate-400 px-2 py-2 text-right text-xs whitespace-nowrap text-gray-900 capitalize'>
                          ---
                        </td>
                        <td className='border border-slate-400 px-2 py-2 text-right text-xs whitespace-nowrap text-gray-900 capitalize'>
                          ---
                        </td>
                        <td className='border border-slate-400 px-2 py-2 text-right text-xs whitespace-nowrap text-gray-900 capitalize'>
                          {saleDetails.items.igst
                            ? `₹${formattedAmount(saleDetails.items.igst)}`
                            : '--'}
                        </td>
                      </>
                    )}

                    <td className='border border-slate-400 px-2 py-2 text-right text-xs whitespace-nowrap text-gray-900 capitalize'>
                      ₹{formattedAmount(saleDetails.items.gstAmount)}
                    </td>
                    <td className='border border-slate-400 px-2 py-2 text-right text-xs whitespace-nowrap text-gray-900 capitalize'>
                      ₹{formattedAmount(saleDetails.items.total)}
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
