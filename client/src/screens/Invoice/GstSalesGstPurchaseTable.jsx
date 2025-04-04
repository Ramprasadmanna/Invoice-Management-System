import Alert from '@components/Alert';
import Loader from '@components/Loader';
import YearNavigator from '@components/YearSelector';
import monthShort from '@data/monthShort';
import {
  ArrowLongRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useGetAggregatedGstSalesGstPurchaseQuery } from '@slices/dashboardApiSlice';
import formattedAmount from '@utils/formatAmount';
import { useState } from 'react';

const GstSalesGstPurchaseTable = () => {
  const [year, setYear] = useState(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    return currentMonth < 4 ? currentYear - 1 : currentYear;
  });

  const { data, isFetching, isError, error } =
    useGetAggregatedGstSalesGstPurchaseQuery({ year });

  return (
    <>
      {isFetching ? (
        <Loader />
      ) : isError ? (
        <Alert>{error?.data?.message}</Alert>
      ) : (
        <div className='min-h-fit w-full overflow-x-hidden rounded-md bg-white p-4 shadow-xs sm:p-6'>
          <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
            <p className='text-xl font-semibold'>
              GST Sales - Gst Purchase Table ({`${year}-${year + 1}`})
            </p>
            <YearNavigator year={year} setYear={setYear} />
          </div>

          <div className='scrollbar-none overflow-x-scroll'>
            <table className='mt-4 min-w-full divide-y divide-gray-300'>
              <thead>
                <tr>
                  <th
                    scope='col'
                    className='py-3.5 pr-3 text-left text-sm font-semibold whitespace-nowrap text-gray-900'></th>
                  <th
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap text-gray-900'>
                    CGST Amount
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap text-gray-900'>
                    SGST Amount
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap text-gray-900'>
                    IGST Amount
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap text-gray-900'>
                    GST Amount
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap text-gray-900'>
                    GST Paid
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap text-gray-900'>
                    Difference
                  </th>
                </tr>
              </thead>

              {data?.monthly_data?.length ? (
                <tbody className='divide-y divide-gray-200'>
                  {data?.monthly_data?.map((sale, index) => (
                    <tr key={index}>
                      <td className='py-4 text-sm font-medium whitespace-nowrap text-gray-900'>
                        {`${monthShort[sale.month]} ${sale.year}`}
                      </td>
                      <td className='px-3 py-4 text-left text-sm whitespace-nowrap text-gray-500 capitalize'>
                        ₹{formattedAmount(sale.cgst)}
                      </td>
                      <td className='px-3 py-4 text-left text-sm whitespace-nowrap text-gray-500 capitalize'>
                        ₹{formattedAmount(sale.sgst)}
                      </td>
                      <td className='px-3 py-4 text-left text-sm whitespace-nowrap text-gray-500 capitalize'>
                        ₹{formattedAmount(sale.igst)}
                      </td>
                      <td className='px-3 py-4 text-left text-sm whitespace-nowrap text-gray-500 capitalize'>
                        ₹{formattedAmount(sale.gstAmount)}
                      </td>
                      <td className='px-3 py-4 text-left text-sm whitespace-nowrap text-gray-500 capitalize'>
                        ₹{formattedAmount(sale.gstPaidAmount)}
                      </td>
                      <td
                        className={`px-3 py-4 text-left text-sm whitespace-nowrap text-gray-500 capitalize ${sale.gstAmount - sale.gstPaidAmount < 0 && 'text-red-500'} ${sale.gstAmount - sale.gstPaidAmount > 0 && 'text-green-500'}`}>
                        ₹{formattedAmount(sale.gstAmount - sale.gstPaidAmount)}
                      </td>
                    </tr>
                  ))}

                  <tr>
                    <td className='text-sm font-semibold whitespace-nowrap text-gray-900'>
                      Total
                    </td>
                    <td className='px-3 py-4 text-sm font-semibold whitespace-nowrap text-gray-900 capitalize'>
                      ₹{formattedAmount(data?.cgst)}
                    </td>
                    <td className='px-3 py-4 text-sm font-semibold whitespace-nowrap text-gray-900 capitalize'>
                      ₹{formattedAmount(data?.sgst)}
                    </td>
                    <td className='px-3 py-4 text-sm font-semibold whitespace-nowrap text-gray-900 capitalize'>
                      ₹{formattedAmount(data?.igst)}
                    </td>
                    <td className='px-3 py-4 text-sm font-semibold whitespace-nowrap text-gray-900 capitalize'>
                      ₹{formattedAmount(data?.gstAmount)}
                    </td>
                    <td className='px-3 py-4 text-sm font-semibold whitespace-nowrap text-gray-900 capitalize'>
                      ₹{formattedAmount(data?.gstPaidAmount)}
                    </td>
                    <td
                      className={`px-3 py-4 text-sm font-semibold whitespace-nowrap text-gray-900 capitalize ${data.gstAmount - data.gstPaidAmount < 0 && 'text-red-500'} ${data.gstAmount - data.gstPaidAmount > 0 && 'text-green-500'}`}>
                      ₹{formattedAmount(data?.gstAmount - data?.gstPaidAmount)}
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  <td colSpan={7}>
                    <Alert type='info'>No GST Sales Found</Alert>
                  </td>
                </tbody>
              )}
            </table>

            <ul className='mt-6'>
              <li className='flex items-center gap-4'>
                <ArrowLongRightIcon className='size-4 text-slate-500' />
                <p className='text-sm text-slate-500'>
                  Only Invoice Type TAX INVOICE Included In This Data
                </p>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default GstSalesGstPurchaseTable;
