import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PencilSquareIcon,
  TableCellsIcon,
  TrashIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import CustomerForm from './CustomerForm';
import {
  useAddCustomerMutation,
  useDeleteCustomerMutation,
  useDownloadCustomerExcelMutation,
  useDownloadCustomerPdfMutation,
  useGetCustomersQuery,
  useUpdateCustomerMutation,
} from '@slices/customerApiSlice';
import Loader from '@components/Loader';
import Alert from '@components/Alert';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { dateTimeFormatter } from '@utils/dateTimeFormatter';
import Paginate from '@components/Paginate';
import { Delete } from '@components/Actions/index.jsx';
import PageSize from '@components/PageSize';
import { useDispatch } from 'react-redux';
import { logout } from '@slices/authSlice';
import checkSessionExpired from '@utils/checkSession';

const CustomerScreen = () => {
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const [keyword, setKeyword] = useState('');
  const [showDownloadOption, setShowDownloadOption] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [initinalData, setInitinalData] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // API Slice Query
  const {
    data: customersData,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetCustomersQuery({ keyword, pageNumber, pageSize });

  // API Slice Mutations
  const [addCustomer, { isLoading: addCustomerLoading }] =
    useAddCustomerMutation();

  const [updateCustomer, { isLoading: updateCustomerLoading }] =
    useUpdateCustomerMutation();

  const [downloadPdf, { isLoading: downloadPdfLoading }] =
    useDownloadCustomerPdfMutation();

  const [downloadExcel, { isLoading: downloadExcelLoading }] =
    useDownloadCustomerExcelMutation();

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

  const handleOpenAddForm = () => {
    setInitinalData(null);
    setShowForm(true);
  };

  // Edit Data Handler Function
  const handleEdit = (data) => {
    setShowForm(true);
    setInitinalData(data);
  };

  // Submit Data Action Handler
  const handleSubmitData = async (userData) => {
    if (initinalData) {
      try {
        await updateCustomer({ ...userData, id: initinalData.id }).unwrap();
        toast.success('Customer Updated Sucessfully');
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
        await addCustomer(userData).unwrap();
        toast.success('Customer Added SucessFully');
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

  // Download Pdf File
  const handleDownloadPdf = async () => {
    try {
      const url = await downloadPdf({ keyword, pageNumber, pageSize }).unwrap();
      const link = document.createElement('a');
      link.href = url;
      link.download = `${Date.now()}.pdf`;
      link.click();
      link.remove();
      toast.success('PDF File Downloaded');
    } catch (error) {
      if (!checkSessionExpired(error, dispatch)) {
        console.error(error);
        return toast.error('Error Downloading PDF File');
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
        return toast.error('Error Downloading EXCEL File');
      }
    }
  };

  // Handle Change Pagesize
  const handlePageSize = (e) => {
    setPageSize(e.target.value);
    setPageNumber(1);
  };

  return (
    <div className='scrollbar-none flex flex-col gap-6 overflow-hidden p-4 sm:p-6'>
      {/* Header */}
      <div className='flex flex-col justify-between gap-10 xl:flex-row'>
        <p className='text-2xl font-semibold md:text-3xl'>Customers</p>

        <div className='flex flex-wrap justify-end gap-4'>
          <div className='flex min-w-full flex-1 items-center gap-3 rounded-lg bg-slate-300 px-4 py-1.5 lg:min-w-fit'>
            <MagnifyingGlassIcon className='h-4 w-4 text-slate-800' />
            <input
              type='search'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Company / Name / Business Name'
              className='w-full border-none bg-transparent p-1 text-sm placeholder:text-slate-500 focus:ring-0'
            />
          </div>

          <button
            onClick={handleOpenAddForm}
            className='bg-wovBlue flex grow cursor-pointer items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm text-white transition-transform duration-500 active:scale-90 sm:grow-0'>
            <UserPlusIcon className='size-5' />
            Add Customer
          </button>

          <div className='relative z-50'>
            <button
              onClick={() => setShowDownloadOption(!showDownloadOption)}
              className='bg-wovBlue flex grow cursor-pointer items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm text-white transition-transform duration-500 active:scale-95 sm:grow-0'>
              <ArrowUpTrayIcon className='size-5' />
              Export
            </button>

            {showDownloadOption && (
              <ul className='absolute top-14 right-0 flex flex-col gap-2 rounded-md bg-white p-2 text-sm shadow-md'>
                <li>
                  <button
                    onClick={handleDownloadPdf}
                    disabled={downloadPdfLoading}
                    className={`${!downloadPdfLoading && 'hover:bg-wovBlue transition-colors duration-300 hover:text-white'} border-wovBlue text-wovBlue flex w-full items-center justify-between gap-2 rounded-md border px-3 py-1.5 whitespace-nowrap disabled:cursor-not-allowed`}>
                    Pdf File
                    {downloadPdfLoading ? (
                      <ClipLoader
                        size={15}
                        speedMultiplier={1}
                        color='#1e265a'
                      />
                    ) : (
                      <DocumentTextIcon className='size-5 shrink-0' />
                    )}
                  </button>
                </li>
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
                      <TableCellsIcon className='size-5 shrink-0' />
                    )}
                  </button>
                </li>
              </ul>
            )}
          </div>

          <PageSize handlePageSize={handlePageSize} />
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <div>
          <Alert type='error'>{error.data?.message || error?.message}</Alert>
        </div>
      ) : customersData?.customers?.length ? (
        <>
          {/* Table */}
          <div className='scrollbar-none w-full overflow-hidden rounded-md bg-white p-4 shadow-xs sm:p-6'>
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
                          Customer Name
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Business Legal Name
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          GSTIN
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Place Of Supply
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Email
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Customer Phone
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Billing Address
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Shipping Address
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Customer Type
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Customer ID
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Created By
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Created At
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Updated At
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {customersData.customers.map((data, index) => (
                        <tr key={index}>
                          <td className='border border-slate-400 px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900'>
                            {`${(+customersData?.pageNumber - 1) * pageSize + index + 1}`.padStart(
                              2,
                              '0'
                            )}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                            {`${data?.salutation} ${data?.firstName} ${data?.lastName}`}
                          </td>
                          <td className='border border-slate-400 px-3 text-sm font-medium whitespace-nowrap text-gray-900 capitalize'>
                            {data?.businessLegalName
                              ? data?.businessLegalName
                              : '---'}
                          </td>
                          <td className='border border-slate-400 px-3 text-sm font-medium whitespace-nowrap text-gray-900'>
                            {data?.gstNumber ? data?.gstNumber : '---'}
                          </td>
                          <td className='border border-slate-400 px-3 text-sm font-medium whitespace-nowrap text-gray-900'>
                            {data?.placeOfSupply}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900'>
                            {data?.email}
                          </td>
                          <td className='border border-slate-400 px-3 py-3.5 text-xs font-medium whitespace-nowrap text-gray-900'>
                            <p className='mb-1'>Work : {data?.workPhone}</p>
                            <p>Mobile : {data?.mobile}</p>
                          </td>
                          <td className='border border-slate-400 px-3 py-3.5 text-xs font-medium whitespace-nowrap text-gray-900'>
                            <p className='mb-0.5 flex items-center gap-1'>
                              <MapPinIcon className='size-3' />{' '}
                              {data?.billingAddress}
                            </p>
                            <p>{`${data?.billingCity}, ${data?.billingState} - ${data?.billingZipcode}, ${data?.billingCountry}`}</p>
                          </td>

                          <td className='border border-slate-400 px-3 py-3.5 text-xs font-medium whitespace-nowrap text-gray-900'>
                            <p className='mb-0.5 flex items-center gap-1'>
                              <MapPinIcon className='size-3' />{' '}
                              {data?.shippingAddress}
                            </p>
                            <p>{`${data?.shippingCity}, ${data?.shippingState} - ${data?.shippingZipcode}, ${data?.shippingCountry}`}</p>
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                            {data?.customerType}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                            {data?.id}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                            {data?.user.name} | {data?.user.isAdmin && 'Admin'}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 uppercase'>
                            {dateTimeFormatter(data?.createdAt)}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 uppercase'>
                            {dateTimeFormatter(data?.updatedAt)}
                          </td>
                          <td className='gap-2 border border-slate-400 px-3 py-3.5 text-sm font-medium whitespace-nowrap text-gray-500'>
                            <div className='flex gap-4'>
                              <button
                                onClick={() => handleEdit(data)}
                                className='text-wovBlue ring-wovBlue flex items-center gap-1 rounded-sm bg-indigo-50 px-2 py-1 text-sm font-semibold shadow-xs ring-1 ring-inset hover:bg-white'>
                                <PencilSquareIcon className='h-3 w-3' />
                                Edit
                              </button>

                              <Delete
                                queryfunc={useDeleteCustomerMutation}
                                id={data.id}
                                message='Customer Deleted Sucessfully'
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <Paginate
                    page={customersData.pageNumber}
                    pages={customersData.pages}
                    pageSize={pageSize}
                    setPageNumber={setPageNumber}
                  />
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <Alert type='info'>No Records Found</Alert>
      )}

      {/* Form Design */}

      <CustomerForm
        showForm={showForm}
        setShowForm={setShowForm}
        handleSubmitData={handleSubmitData}
        initinalData={initinalData}
        addCustomerLoading={addCustomerLoading}
        updateCustomerLoading={updateCustomerLoading}
      />
    </div>
  );
};

export default CustomerScreen;
