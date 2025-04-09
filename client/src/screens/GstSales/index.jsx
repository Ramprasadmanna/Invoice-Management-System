import { useEffect, useState } from 'react';
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  DocumentTextIcon,
  EyeIcon,
  EyeSlashIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';
import GstSalesForm from './GstSalesForm';
import {
  useCreateGstSaleMutation,
  useDeleteGstSaleMutation,
  useDownloadGstSalesExcelMutation,
  useDownloadGstSalesPdfMutation,
  useGetGstSalesQuery,
  useLazyDownloadGstSaleInvoiceQuery,
  useLazyPreviewGstSaleInvoiceQuery,
  useLazySendGstSaleInvoiceMailQuery,
  useUpdateGstSaleMutation,
} from '@slices/gstSalesApiSlice';
import { toast } from 'react-toastify';
import Alert from '@components/Alert';
import Paginate from '@components/Paginate';
import Loader from '@components/Loader';
import { dateFormatter } from '@utils/dateTimeFormatter';
import formattedAmount from '@utils/formatAmount';
import ItemsTable from './ItemsTable';
import {
  Preview,
  Download,
  Delete,
  SendMail,
} from '@components/Actions/index.jsx';
import { ClipLoader } from 'react-spinners';
import PageSize from '@components/PageSize';
import checkSessionExpired from '@utils/checkSession';
import { useDispatch } from 'react-redux';

const GstSalesScreen = () => {
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const [keyword, setKeyword] = useState('');
  const [showDownloadOption, setShowDownloadOption] = useState(false);
  const [invoiceType, setInvoiceType] = useState('');
  const [accountType, setAccountType] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, seToDate] = useState('');
  const [balanceDue, setBalanceDue] = useState('');
  const [filter, setFilter] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [initinalData, setInitinalData] = useState(null);
  const [showItemsDetails, setShowItemsDetails] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // API Slice Query
  const {
    data: gstSales,
    isLoading,
    isError,
    error,
    isFetching,
  } = useGetGstSalesQuery({ keyword, pageNumber, pageSize, ...filter });

  // API Slice Mutation
  const [createGstSales, { isLoading: createGstSalesLoading }] =
    useCreateGstSaleMutation();

  const [updateGstSale, { isLoading: updateGstSaleLoading }] =
    useUpdateGstSaleMutation();

  const [downloadPdf, { isLoading: downloadPdfLoading }] =
    useDownloadGstSalesPdfMutation();

  const [downloadExcel, { isLoading: downloadExcelLoading }] =
    useDownloadGstSalesExcelMutation();

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
  const handleSubmitData = async (order) => {
    if (initinalData) {
      try {
        await updateGstSale({ ...order, id: initinalData.id }).unwrap();
        toast.success('GST Sale Updated Sucessfully.');
        setShowForm(false);
        setInitinalData(null);
      } catch (error) {
        if (!checkSessionExpired(error, dispatch)) {
          console.error(error);
          return toast.error(error?.data?.message || error?.message);
        }
      }
    } else {
      try {
        await createGstSales(order).unwrap();
        toast.success('GST Sale Generated Sucessfully.');
        setShowForm(false);
      } catch (error) {
        if (!checkSessionExpired(error, dispatch)) {
          console.error(error);
          return toast.error(error?.data?.message || error?.message);
        }
      }
    }
  };

  // Handle Filter
  const handleFilter = () => {
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
      invoiceType,
      accountType,
      fromDate,
      toDate,
      balanceDue,
    });
  };

  // Download Pdf File
  const handleDownloadPdf = async () => {
    try {
      const url = await downloadPdf({
        keyword,
        pageNumber,
        pageSize,
        ...filter,
      }).unwrap();
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
        ...filter,
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

  return (
    <div className='scrollbar-none flex flex-col gap-6 overflow-x-hidden overflow-y-scroll p-4 sm:p-6'>
      {/* Header */}
      <div className='flex flex-col justify-between gap-6 xl:flex-row'>
        <p className='text-2xl font-semibold whitespace-nowrap md:text-3xl'>
          GST Sales
        </p>

        <div className='flex w-full flex-wrap justify-end gap-4 lg:flex-nowrap'>
          <div className='flex w-full grow-1 items-center gap-3 rounded-lg bg-slate-300 px-4 py-1.5 xl:max-w-80'>
            <MagnifyingGlassIcon className='h-4 w-4 shrink-0 text-slate-800' />
            <input
              type='search'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Invoice/Order'
              className='w-full border-none bg-transparent p-1 text-sm placeholder:text-slate-500 focus:ring-0'
            />
          </div>

          <button
            onClick={handleOpenAddForm}
            className='bg-wovBlue flex grow items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm whitespace-nowrap text-white transition-transform duration-500 active:scale-90 sm:grow-0'>
            <DocumentTextIcon className='size-5' />
            Add Gst Sale
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
                      <DocumentTextIcon className='size-5' />
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
                      <TableCellsIcon className='size-5' />
                    )}
                  </button>
                </li>
              </ul>
            )}
          </div>

          <PageSize
            pageSize={pageSize}
            setPageSize={setPageSize}
            setPageNumber={setPageNumber}
          />
        </div>
      </div>

      {/* Filter */}
      <div className='grid grid-cols-2 gap-4 sm:flex sm:flex-wrap'>
        <div className=''>
          <label
            htmlFor='invoice-Status'
            className='block text-xs leading-6 font-medium text-black'>
            Invoice Status
          </label>

          <select
            id='invoice-Status'
            value={invoiceType}
            onChange={(e) => setInvoiceType(e.target.value)}
            className='border-salte-100 border-wovBlue text-wovBlue focus:border-wovBlue mt-1 block w-full rounded-md border bg-transparent px-3 py-1.5 pr-8 text-sm focus:ring-0 focus:outline-hidden'>
            <option value=''>All</option>
            <option value='Tax Invoice'>Tax Invoice</option>
            <option value='Proforma'>Proforma</option>
          </select>
        </div>

        <div className=''>
          <label
            htmlFor='account-Type'
            className='block text-xs leading-6 font-medium text-black'>
            Account Type
          </label>

          <select
            id='account-Type'
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className='border-salte-100 border-wovBlue text-wovBlue focus:border-wovBlue mt-1 block w-full rounded-md border bg-transparent px-3 py-1.5 pr-8 text-sm focus:ring-0 focus:outline-hidden'>
            <option value=''>All</option>
            <option value='Savings'>Savings</option>
            <option value='Current'>Current</option>
          </select>
        </div>

        <div className=''>
          <label
            htmlFor='from-Date'
            className='block text-xs leading-6 font-medium text-black'>
            From Invoice Date
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
            To Invoice Date
          </label>

          <input
            type='date'
            id='to-Date'
            value={toDate}
            onChange={(e) => seToDate(e.target.value)}
            className='border-salte-100 border-wovBlue text-wovBlue focus:border-wovBlue mt-1 block w-full rounded-md border bg-transparent px-3 py-1.5 text-sm focus:ring-0 focus:outline-hidden'></input>
        </div>

        <div className=''>
          <label
            htmlFor='balance-due'
            className='block text-xs leading-6 font-medium text-black'>
            Balance Due
          </label>

          <select
            id='balance-due'
            value={balanceDue}
            onChange={(e) => setBalanceDue(e.target.value)}
            className='border-salte-100 border-wovBlue text-wovBlue focus:border-wovBlue mt-1 block w-full rounded-md border bg-transparent px-3 py-1.5 pr-8 text-sm focus:ring-0 focus:outline-hidden'>
            <option value=''>All</option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </div>

        <button
          onClick={handleFilter}
          className='bg-wovBlue col-span-full flex h-fit items-center justify-center gap-2 self-end rounded-md px-4 py-2 text-sm text-white transition-transform duration-500 active:scale-90'>
          <FunnelIcon className='size-4' />
          Filter
        </button>
      </div>

      {/* Table */}

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Alert>{error?.data?.message}</Alert>
      ) : gstSales.gstSalesData.length ? (
        <>
          {/* Table */}
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
                          Invoice Date
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Invoice Number
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Name
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Company Name
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          GSTIN
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
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
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          B2B / B2C
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          State
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Total Taxable Amount
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Total CGST
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Total SGST
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Total IGST
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Total Tax
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Shipping
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Discount
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Adjustment
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Total Amount
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Advance Paid
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Balance Due
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Account
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Invoice Status
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Order Id
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Due Date
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Created By
                        </th>
                        <th
                          scope='col'
                          className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {gstSales.gstSalesData.map((invoice, index) => (
                        <tr key={index}>
                          <td className='border border-slate-400 px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900'>
                            {`${(+gstSales.pageNumber - 1) * pageSize + index + 1}`.padStart(
                              2,
                              '0'
                            )}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                            {dateFormatter(invoice.invoiceDate)}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                            {invoice.invoiceNumber}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                            {`${invoice.customer.salutation} ${invoice.customer.firstName} ${invoice.customer.lastName}`}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                            {invoice.customer.businessLegalName
                              ? invoice.customer.businessLegalName
                              : '---'}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                            {invoice.customer.gstNumber
                              ? invoice.customer.gstNumber
                              : '---'}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                            <ItemsTable
                              invoice={invoice}
                              showItemsDetails={showItemsDetails}
                            />
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                            {invoice.customer.businessLegalName ? 'B2B' : 'B2C'}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                            {invoice.customer.placeOfSupply}
                          </td>

                          <td className='border border-slate-400 px-3 py-4 text-right text-sm whitespace-nowrap text-gray-900 capitalize'>
                            ₹{formattedAmount(invoice.taxableAmount)}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-right text-sm whitespace-nowrap text-gray-900 capitalize'>
                            {invoice.cgst
                              ? `₹${formattedAmount(invoice.cgst)}`
                              : '--'}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-right text-sm whitespace-nowrap text-gray-900 capitalize'>
                            {invoice.cgst
                              ? `₹${formattedAmount(invoice.cgst)}`
                              : '--'}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-right text-sm whitespace-nowrap text-gray-900 capitalize'>
                            {invoice.igst
                              ? `₹${formattedAmount(invoice.igst)}`
                              : '--'}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-right text-sm whitespace-nowrap text-gray-900 capitalize'>
                            ₹{formattedAmount(invoice.gstAmount)}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-right text-sm whitespace-nowrap text-gray-900 capitalize'>
                            ₹{formattedAmount(invoice.shippingCharges)}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-right text-sm whitespace-nowrap text-gray-900 capitalize'>
                            ₹{formattedAmount(invoice.discount)}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-right text-sm whitespace-nowrap text-gray-900 capitalize'>
                            ₹{formattedAmount(invoice.otherAdjustments)}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-right text-sm whitespace-nowrap text-gray-900 capitalize'>
                            ₹{formattedAmount(invoice.total)}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-right text-sm whitespace-nowrap text-gray-900 capitalize'>
                            {invoice.advanceAmount
                              ? `₹${formattedAmount(invoice.advanceAmount)}`
                              : '---'}
                          </td>
                          <td
                            className={`${invoice.balanceDue > 0 && 'text-red-500'} border border-slate-400 px-3 py-4 text-right text-sm whitespace-nowrap text-gray-900 capitalize`}>
                            {invoice.balanceDue
                              ? `₹${formattedAmount(invoice.balanceDue)}`
                              : '---'}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-left text-sm whitespace-nowrap text-gray-900 capitalize'>
                            {invoice.accountType}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                            {invoice.invoiceType}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                            {invoice.orderNumber ? invoice.orderNumber : '---'}
                          </td>

                          <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                            {dateFormatter(invoice.dueDate)}
                          </td>

                          <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                            {invoice.user.name} |{' '}
                            {invoice.user.isAdmin && 'Admin'}
                          </td>

                          <td className='gap-2 border border-slate-400 px-3 py-3.5 text-sm font-medium whitespace-nowrap text-gray-500'>
                            <div className='flex gap-4'>
                              <button
                                onClick={() => handleEdit(invoice)}
                                className='text-wovBlue ring-wovBlue flex items-center gap-1 rounded-sm bg-indigo-50 px-2 py-1 text-sm font-semibold shadow-xs ring-1 ring-inset hover:bg-white'>
                                <PencilSquareIcon className='h-3 w-3' />
                                Edit
                              </button>

                              <Preview
                                queryfunc={useLazyPreviewGstSaleInvoiceQuery}
                                id={invoice.id}
                              />

                              <SendMail
                                queryfunc={useLazySendGstSaleInvoiceMailQuery}
                                id={invoice.id}
                              />

                              <Download
                                queryfunc={useLazyDownloadGstSaleInvoiceQuery}
                                id={invoice.id}
                                fileName={invoice.invoiceNumber}
                              />

                              <Delete
                                queryfunc={useDeleteGstSaleMutation}
                                id={invoice.id}
                                message='GST Sale Deleted Sucessfully'
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <Paginate
                    page={gstSales.pageNumber}
                    pages={gstSales.pages}
                    pageSize={pageSize}
                    setPageNumber={setPageNumber}
                  />
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <Alert type='info'>No GST Sales Found</Alert>
      )}

      <GstSalesForm
        showForm={showForm}
        setShowForm={setShowForm}
        handleSubmitData={handleSubmitData}
        initinalData={initinalData}
        setInitinalData={setInitinalData}
        createGstSalesLoading={createGstSalesLoading}
        updateGstSaleLoading={updateGstSaleLoading}
      />
    </div>
  );
};

export default GstSalesScreen;
