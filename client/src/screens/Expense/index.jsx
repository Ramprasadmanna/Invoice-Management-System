import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  BanknotesIcon,
  DocumentTextIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  ShoppingBagIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import ItemsForm from './ExpenseForm';
import formattedAmount from '@utils/formatAmount';
import { toast } from 'react-toastify';
import Loader from '@components/Loader';
import Alert from '@components/Alert';
import { dateFormatter, dateTimeFormatter } from '@utils/dateTimeFormatter';
import { ClipLoader } from 'react-spinners';
import Paginate from '@components/Paginate';
import { Delete } from '@components/Actions/index.jsx';
import PageSize from '@components/PageSize';
import checkSessionExpired from '@utils/checkSession';
import { useDispatch } from 'react-redux';
import {
  useAddExpenseMutation,
  useDeleteExpenseMutation,
  useDownloadExpenseExcelMutation,
  useGetExpenseQuery,
  useUpdateExpenseMutation,
} from '@slices/expenseApiSlice';

const ExpenseScreen = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [keyword, setKeyword] = useState('');
  const [showDownloadOption, setShowDownloadOption] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [initinalData, setInitinalData] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [fromDate, setFromDate] = useState('');
  const [toDate, seToDate] = useState('');
  const [filter, setFilter] = useState({});

  // API Slice Query
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetExpenseQuery({ keyword, pageNumber, pageSize, ...filter });

  // API Slice Mutations
  const [addExpense, { isLoading: addGstPurchaseLoading }] =
    useAddExpenseMutation();

  const [updateExpense, { isLoading: updateExpenseLoading }] =
    useUpdateExpenseMutation();

  const [downloadExcel, { isLoading: downloadExcelLoading }] =
    useDownloadExpenseExcelMutation();

  // Debounce Search Function
  useEffect(() => {
    const handler = setTimeout(() => {
      setKeyword(search);
      setPageNumber(1);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

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

  // Handle Filter
  const handleFilter = () => {
    if (!fromDate || !toDate) {
      return toast.error('Select Valid Filter Option');
    }

    if (fromDate && !toDate) {
      return toast.error('Enter To Date');
    }

    if (toDate && !fromDate) {
      return toast.error('Enter From Date');
    }

    if (fromDate > toDate) {
      return toast.error('From Date Cannot Be Greater Than To Date!!');
    }

    setFilter({
      fromDate,
      toDate,
    });
  };

  // Submit Data Action Handler
  const handleSubmitData = async (itemData) => {
    if (initinalData) {
      try {
        await updateExpense({ ...itemData, id: initinalData.id }).unwrap();
        toast.success('GST Purchase Updated Sucessfully.');
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
        await addExpense(itemData).unwrap();
        toast.success('GST Purchase Added Sucessfully');
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
      const url = await downloadExcel({
        keyword,
        pageNumber,
        pageSize,
      }).unwrap();
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

  // Handle Change Pagesize
  const handlePageSize = (e) => {
    setPageSize(e.target.value);
    setPageNumber(1);
  };

  return (
    <div className='scrollbar-none flex flex-col gap-6 overflow-x-hidden overflow-y-scroll p-4 sm:p-6'>
      {/* Header */}
      <div className='flex flex-col justify-between gap-6 xl:flex-row'>
        <p className='text-2xl font-semibold md:text-3xl'>Expenses</p>

        <div className='flex flex-wrap justify-end gap-4'>
          <div className='flex min-w-full flex-1 items-center gap-3 rounded-lg bg-slate-300 px-4 py-1.5 lg:min-w-fit'>
            <MagnifyingGlassIcon className='h-4 w-4 text-slate-800' />
            <input
              type='search'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search ...'
              className='w-full border-none bg-transparent p-1 text-sm placeholder:text-slate-500 focus:ring-0'
            />
          </div>

          <button
            onClick={handleAddData}
            className='bg-wovBlue flex grow items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm text-white transition-transform duration-500 active:scale-90 sm:grow-0'>
            <BanknotesIcon className='size-5' />
            Add Expense
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

          <PageSize handlePageSize={handlePageSize} />
        </div>
      </div>

      {/* Filter */}
      <div className='grid grid-cols-2 gap-4 sm:flex sm:flex-wrap'>
        <div className=''>
          <label
            htmlFor='from-Date'
            className='block text-xs leading-6 font-medium text-black'>
            From Purchase Date
          </label>

          <input
            type='date'
            id='from-Date'
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className='border-salte-100 border-wovBlue text-wovBlue focus:border-wovBlue mt-1 block w-full rounded-md border bg-transparent px-3 py-1.5 text-sm focus:ring-0 focus:outline-hidden'></input>
        </div>

        <div className=''>
          <label
            htmlFor='to-Date'
            className='block text-xs leading-6 font-medium text-black'>
            To Purchase Date
          </label>

          <input
            type='date'
            id='to-Date'
            value={toDate}
            onChange={(e) => seToDate(e.target.value)}
            className='border-salte-100 border-wovBlue text-wovBlue focus:border-wovBlue mt-1 block w-full rounded-md border bg-transparent px-3 py-1.5 text-sm focus:ring-0 focus:outline-hidden'></input>
        </div>

        <button
          onClick={handleFilter}
          className='bg-wovBlue col-span-full flex h-fit items-center justify-center gap-2 self-end rounded-md px-4 py-2 text-sm text-white transition-transform duration-500 active:scale-90'>
          <FunnelIcon className='size-4' />
          Filter
        </button>
      </div>

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Alert>{error?.data?.message}</Alert>
      ) : data.expensesData.length ? (
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
                        Expense Date
                      </th>
                      <th
                        scope='col'
                        className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                        Item Name
                      </th>
                      <th
                        scope='col'
                        className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                        Price
                      </th>
                      <th
                        scope='col'
                        className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                        Payment Method
                      </th>
                      <th
                        scope='col'
                        className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                        Quantity
                      </th>
                      <th
                        scope='col'
                        className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                        Remarks
                      </th>
                      <th
                        scope='col'
                        className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                        Created At
                      </th>
                      <th
                        scope='col'
                        className='min-w-fit border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                        Updated At
                      </th>
                      <th
                        scope='col'
                        className='min-w-fit border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.expensesData.map((purchase, index) => (
                      <tr key={index}>
                        <td className='border border-slate-400 px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900'>
                          {`${index + 1}`.padStart(2, '0')}
                        </td>
                        <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                          {dateFormatter(purchase.expenseDate)}
                        </td>
                        <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                          {purchase.item.name}
                        </td>
                        <td className='border border-slate-400 px-3 py-4 text-right text-sm whitespace-nowrap text-gray-900'>
                          ₹{formattedAmount(purchase.price)}
                        </td>
                        <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                          {purchase.paymentMethod}
                        </td>
                        <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                          {purchase.quantity}
                        </td>
                        <td className='border border-slate-400 px-3 py-4 text-xs whitespace-nowrap text-gray-900 capitalize'>
                          {purchase.remarks}
                        </td>
                        <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 uppercase'>
                          {dateTimeFormatter(purchase.createdAt)}
                        </td>
                        <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 uppercase'>
                          {dateTimeFormatter(purchase.updatedAt)}
                        </td>

                        <td className='gap-2 border border-slate-400 px-3 py-3.5 text-sm font-medium whitespace-nowrap text-gray-500'>
                          <div className='flex gap-4'>
                            <button
                              onClick={() => handleEdit(purchase)}
                              className='text-wovBlue ring-wovBlue flex items-center gap-1 rounded-sm bg-indigo-50 px-2 py-1 text-sm font-semibold shadow-xs ring-1 ring-inset hover:bg-white'>
                              <PencilSquareIcon className='h-3 w-3' />
                              Edit
                            </button>
                            <Delete
                              queryfunc={useDeleteExpenseMutation}
                              id={purchase.id}
                              message='Expense Deleted Sucessfully'
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Paginate
                  page={data?.pageNumber}
                  pages={data?.pages}
                  pageSize={pageSize}
                  setPageNumber={setPageNumber}
                />
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
        addGstPurchaseLoading={addGstPurchaseLoading}
        updateExpenseLoading={updateExpenseLoading}
      />
    </div>
  );
};

export default ExpenseScreen;
