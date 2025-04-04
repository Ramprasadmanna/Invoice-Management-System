import {
  ArrowUpTrayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CurrencyRupeeIcon,
  PencilSquareIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import ItemsForm from './GstPaidForm';
import { toast } from 'react-toastify';
import Loader from '@components/Loader';
import Alert from '@components/Alert';
import { dateFormatter, monthYearFormatter } from '@utils/dateTimeFormatter';
import { ClipLoader } from 'react-spinners';
import { Delete } from '@components/Actions/index.jsx';
import {
  useAddGstPaidMutation,
  useDeleteGstPaidMutation,
  useDownloadGstPaidExcelMutation,
  useGetGstPaidQuery,
  useUpdateGstPaidMutation,
} from '@slices/gstPaidApiSlice';
import formattedAmount from '@utils/formatAmount';
import checkSessionExpired from '@utils/checkSession';
import { useDispatch } from 'react-redux';
import YearNavigator from '@components/YearSelector';

const GstPaidScreen = () => {
  const dispatch = useDispatch();

  const [showDownloadOption, setShowDownloadOption] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [initinalData, setInitinalData] = useState();
  const [year, setYear] = useState(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    return currentMonth < 4 ? currentYear - 1 : currentYear;
  });

  // API Slice Query
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetGstPaidQuery({ year });

  // API Slice Mutations
  const [addGstPaid, { isLoading: addGstPurchaseItemLoading }] =
    useAddGstPaidMutation();

  const [updateGstPaid, { isLoading: updateGstPaidLoading }] =
    useUpdateGstPaidMutation();

  const [downloadExcel, { isLoading: downloadExcelLoading }] =
    useDownloadGstPaidExcelMutation();

  // Add Data Action Handler
  const handleAddData = () => {
    setInitinalData(null);
    setShowForm(true);
  };

  // Edit Data Handler Function
  const handleEdit = (data) => {
    setShowForm(true);
    setInitinalData(data);
  };

  // Submit Data Action Handler
  const handleSubmitData = async (gstPaid) => {
    if (initinalData) {
      try {
        await updateGstPaid({
          ...gstPaid,
          id: initinalData.id,
        }).unwrap();
        toast.success('GST Paid Updated Sucessfully.');
        setShowForm(false);
        setInitinalData(null);
        refetch();
      } catch (error) {
        if (!checkSessionExpired(error, dispatch)) {
          console.error(error);
          return toast.error(error?.data?.message || error?.message);
        }
      }
    } else {
      try {
        await addGstPaid(gstPaid).unwrap();
        toast.success('GST Paid Added Sucessfully');
        setShowForm(false);
        refetch();
      } catch (error) {
        if (!checkSessionExpired(error, dispatch)) {
          console.error(error);
          return toast.error(error?.data?.message || error?.message);
        }
      }
    }
  };

  // Download Excel File
  const handleDownloadExcel = async () => {
    try {
      const url = await downloadExcel({ year }).unwrap();
      const link = document.createElement('a');
      link.href = url;
      link.download = `${Date.now()}.xlsx`;
      link.click();
      link.remove();
      toast.success('Excel File Downloaded');
    } catch (error) {
      if (!checkSessionExpired(error, dispatch)) {
        console.error(error);
        return toast.error('Error Downloading Excel File');
      }
    }
  };

  return (
    <div className='scrollbar-none flex flex-col gap-6 overflow-x-hidden overflow-y-scroll p-4 sm:p-6'>
      {/* Header */}
      <div className='flex flex-col justify-between gap-6 xl:flex-row'>
        <p className='text-2xl font-semibold md:text-3xl'>
          GST Paid ({`${year}-${year + 1}`})
        </p>

        <div className='flex flex-wrap justify-end gap-4'>
          <button
            onClick={handleAddData}
            className='bg-wovBlue flex grow items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm text-white transition-transform duration-500 active:scale-90 sm:grow-0'>
            <CurrencyRupeeIcon className='size-5' />
            Add GST Paid
          </button>

          <div className='relative z-50'>
            <button
              onClick={() => setShowDownloadOption(!showDownloadOption)}
              className='bg-wovBlue flex grow items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm text-white transition-transform duration-500 active:scale-95 sm:grow-0'>
              <ArrowUpTrayIcon className='size-5' />
              Export
            </button>

            {showDownloadOption && (
              <ul className='absolute top-14 right-0 flex flex-col gap-2 rounded-md bg-white p-2 text-sm shadow-md'>
                <li>
                  <button
                    onClick={handleDownloadExcel}
                    disabled={downloadExcelLoading}
                    className={`${!downloadExcelLoading && 'hover:bg-wovBlue transition-colors duration-300 hover:text-white'} border-wovBlue text-wovBlue flex w-full items-center justify-between gap-2 rounded-md border px-3 py-1.5 whitespace-nowrap disabled:cursor-not-allowed`}>
                    Excel File
                    {downloadExcelLoading ? (
                      <ClipLoader
                        size={15}
                        speedMultiplier={1}
                        color='#1e265a'
                      />
                    ) : (
                      <TableCellsIcon className='size-5' />
                    )}
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Year Handle Button */}
      <YearNavigator year={year} setYear={setYear} />

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Alert>{error?.data?.message}</Alert>
      ) : data.length ? (
        <div className='w-full overflow-hidden rounded-md bg-white p-4 shadow-xs sm:p-6'>
          <div className='scrollbar-thin scrollbar-track-white scrollbar-thumb-slate-300 h-full overflow-scroll'>
            {isFetching ? (
              <Loader />
            ) : (
              <>
                <table className='min-w-full border-collapse border border-slate-500 sm:mb-6'>
                  <thead className='bg-wovBlue sticky top-0 text-white'>
                    <tr>
                      <th
                        scope='col'
                        className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold text-gray-400'>
                        #
                      </th>
                      <th
                        scope='col'
                        className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                        Date Of Payment
                      </th>
                      <th
                        scope='col'
                        className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                        GST Paid Month
                      </th>
                      <th
                        scope='col'
                        className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                        Amount
                      </th>
                      <th
                        scope='col'
                        className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                        Payment Method
                      </th>
                      <th
                        scope='col'
                        className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                        Created By
                      </th>
                      <th
                        scope='col'
                        className='min-w-fit border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((gstPaid, index) => (
                      <tr key={index}>
                        <td className='border border-slate-400 px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900'>
                          {`${index + 1}`.padStart(2, '0')}
                        </td>
                        <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                          {dateFormatter(gstPaid?.dateOfPayment)}
                        </td>
                        <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                          {monthYearFormatter(gstPaid?.monthOfGstPaid)}
                        </td>
                        <td className='tex border border-slate-400 px-3 py-4 text-right text-sm whitespace-nowrap text-gray-900 capitalize'>
                          ₹{formattedAmount(gstPaid?.amount)}
                        </td>
                        <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900'>
                          {gstPaid?.paymentMethod}
                        </td>
                        <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                          {gstPaid?.user.name} |{' '}
                          {gstPaid?.user.isAdmin && 'Admin'}
                        </td>

                        <td className='gap-2 border border-slate-400 px-3 py-3.5 text-sm font-medium whitespace-nowrap text-gray-500'>
                          <div className='flex gap-4'>
                            <button
                              onClick={() => handleEdit(gstPaid)}
                              className='text-wovBlue ring-wovBlue flex items-center gap-1 rounded-sm bg-indigo-50 px-2 py-1 text-sm font-semibold shadow-xs ring-1 ring-inset hover:bg-white'>
                              <PencilSquareIcon className='h-3 w-3' />
                              Edit
                            </button>
                            <Delete
                              queryfunc={useDeleteGstPaidMutation}
                              id={gstPaid.id}
                              message='GST Paid Deleted Sucessfully'
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      ) : (
        <Alert type='info'>No Records Found</Alert>
      )}

      {/* Form Design */}
      <ItemsForm
        showForm={showForm}
        setShowForm={setShowForm}
        handleSubmitData={handleSubmitData}
        initinalData={initinalData}
        setInitinalData={setInitinalData}
        addGstPurchaseItemLoading={addGstPurchaseItemLoading}
        updateGstPaidLoading={updateGstPaidLoading}
      />
    </div>
  );
};

export default GstPaidScreen;
