import Alert from '@components/Alert';
import Loader from '@components/Loader';
import YearNavigator from '@components/YearSelector';
import monthShort from '@data/monthShort';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useGetAggregatedGstPurchaseQuery } from '@slices/dashboardApiSlice';
import formattedAmount from '@utils/formatAmount';
import { useState } from 'react';

const GstPurchaseTable = () => {
  const [year, setYear] = useState(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    return currentMonth < 4 ? currentYear - 1 : currentYear;
  });

  const {
    data: gstPurchase,
    isFetching: gstPurchaseLoading,
    isError: isGstPurchaseError,
    error: gstPurchaseError,
  } = useGetAggregatedGstPurchaseQuery({ year });

  const handlePreviousYear = () => {
    setYear(+year - 1);
  };

  const handleCurrentYear = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    setYear(currentMonth < 4 ? currentYear - 1 : currentYear);
  };

  const handleNextYear = () => {
    setYear(+year + 1);
  };

  return (
    <>
      {gstPurchaseLoading ? (
        <Loader />
      ) : isGstPurchaseError ? (
        <Alert>{gstPurchaseError?.data?.message}</Alert>
      ) : (
        <div className='min-h-fit w-full overflow-x-hidden rounded-md bg-white p-4 shadow-xs sm:p-6'>
          <div className='flex flex-col justify-between items-center gap-4 sm:flex-row'>
            <p className='text-xl font-semibold'>
              GST Purchase Table ({`${year}-${year + 1}`})
            </p>

            <div className='flex hidden w-full items-center gap-2 whitespace-nowrap sm:w-fit'>
              <button
                onClick={handlePreviousYear}
                className='bg-wovBlue flex grow items-center justify-center gap-2 rounded-md border px-3 py-1.5 text-sm text-white'>
                <ChevronLeftIcon className='size-5' />
              </button>
              <button
                onClick={handleCurrentYear}
                className='bg-wovBlue flex grow items-center justify-center gap-2 rounded-md border px-3 py-1.5 text-sm text-white'>
                Current Year
              </button>
              <button
                onClick={handleNextYear}
                className='bg-wovBlue flex grow items-center justify-center gap-2 rounded-md border px-3 py-1.5 text-sm text-white'>
                <ChevronRightIcon className='size-5' />
              </button>
            </div>
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
                    Taxable Amount
                  </th>
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
                    Total Amount
                  </th>
                </tr>
              </thead>

              <tbody className='divide-y divide-gray-200'>
                {gstPurchase?.monthly_data.map((sale, index) => (
                  <tr key={index}>
                    <td className='py-4 text-sm font-medium whitespace-nowrap text-gray-900'>
                      {`${monthShort[sale.month]} ${sale.year}`}
                    </td>
                    <td className='px-3 py-4 text-left text-sm whitespace-nowrap text-gray-500 capitalize'>
                      ₹{formattedAmount(sale.taxableAmount)}
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
                    <td className='px-3 text-left text-sm font-medium whitespace-nowrap text-gray-900'>
                      ₹{formattedAmount(sale.total)}
                    </td>
                  </tr>
                ))}

                <tr>
                  <td className='text-sm font-semibold whitespace-nowrap text-gray-900'>
                    Total
                  </td>
                  <td className='px-3 py-4 text-sm font-semibold whitespace-nowrap text-gray-900 capitalize'>
                    ₹{formattedAmount(gstPurchase.taxableAmount)}
                  </td>
                  <td className='px-3 py-4 text-sm font-semibold whitespace-nowrap text-gray-900 capitalize'>
                    ₹{formattedAmount(gstPurchase.cgst)}
                  </td>
                  <td className='px-3 py-4 text-sm font-semibold whitespace-nowrap text-gray-900 capitalize'>
                    ₹{formattedAmount(gstPurchase.sgst)}
                  </td>
                  <td className='px-3 py-4 text-sm font-semibold whitespace-nowrap text-gray-900 capitalize'>
                    ₹{formattedAmount(gstPurchase.igst)}
                  </td>
                  <td className='px-3 py-4 text-sm font-semibold whitespace-nowrap text-gray-900 capitalize'>
                    ₹{formattedAmount(gstPurchase.gstAmount)}
                  </td>
                  <td className='px-3 py-4 text-sm font-semibold whitespace-nowrap text-gray-900 capitalize'>
                    ₹{formattedAmount(gstPurchase.total)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default GstPurchaseTable;
