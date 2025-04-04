import Alert from '@components/Alert';
import Loader from '@components/Loader';
import {
  CheckBadgeIcon,
  DocumentTextIcon,
  EyeIcon,
  EyeSlashIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';

import {
  useConfirmOrderMutation,
  useGetWebhookOrdersQuery,
} from '@slices/webhookApiSlice';
import { dateTimeFormatter } from '@utils/dateTimeFormatter';
import formattedAmount from '@utils/formatAmount';
import { useEffect, useState } from 'react';
import ItemsTable from './ItemsTable';
import { toast } from 'react-toastify';
import OrderForm from './OrderForm';
import PageSize from '@components/PageSize';
import Paginate from '@components/Paginate';
import checkSessionExpired from '@utils/checkSession';
import { useDispatch } from 'react-redux';

const OrderScreen = () => {
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const [keyword, setKeyword] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, seToDate] = useState('');
  const [filter, setFilter] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [initinalData, setInitinalData] = useState(null);
  const [showItemsDetails, setShowItemsDetails] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // API Slice Query
  const { data, isLoading, isError, error, isFetching } =
    useGetWebhookOrdersQuery({ keyword, pageNumber, pageSize, ...filter });

  // API Slice Mutation
  const [confirmOrder, { isLoading: confirmOrderLoading }] =
    useConfirmOrderMutation();

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

  // Edit Data Handler Function
  const handleEdit = (data) => {
    setShowForm(true);
    setInitinalData(data);
  };

  // Handle Change Pagesize
  const handlePageSize = (e) => {
    setPageSize(e.target.value);
    setPageNumber(1);
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
      fromDate,
      toDate,
    });
  };

  // Submit Data Action Handler
  const handleSubmitData = async (order) => {
    if (initinalData) {
      try {
        await confirmOrder({ ...order, id: initinalData.id }).unwrap();
        toast.success('Order Confirmed And Invoice Created.');
        setShowForm(false);
        setInitinalData(null);
      } catch (error) {
        if (!checkSessionExpired(error, dispatch)) {
          console.error(error);
          return toast.error(error?.data?.message || error?.message);
        }
      }
    }
  };

  return (
    <div className='scrollbar-none flex flex-col gap-6 overflow-x-hidden overflow-y-scroll p-4 sm:p-6'>
      {/* Header */}
      <div className='flex flex-col justify-between gap-6 xl:flex-row'>
        <p className='text-2xl font-semibold whitespace-nowrap md:text-3xl'>
          Orders
        </p>

        <div className='flex w-full flex-wrap justify-end gap-4 lg:flex-nowrap'>
          <div className='flex w-full grow-1 items-center gap-3 rounded-lg bg-slate-300 px-4 py-1.5 xl:max-w-80'>
            <MagnifyingGlassIcon className='h-4 w-4 shrink-0 text-slate-800' />
            <input
              type='search'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search ....'
              className='w-full border-none bg-transparent p-1 text-sm placeholder:text-slate-500 focus:ring-0'
            />
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
            From Order Date
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
            To Order Date
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

      {/* Table */}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Alert>{error?.data?.message}</Alert>
      ) : data?.orderData?.length ? (
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
                          Order Date & Time
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
                          Price
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
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.orderData.map((order, index) => (
                        <tr key={index}>
                          <td className='border border-slate-400 px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900'>
                            {`${(+data.pageNumber - 1) * pageSize + index + 1}`.padStart(
                              2,
                              '0'
                            )}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 uppercase'>
                            {dateTimeFormatter(order.createdAt)}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                            {`${order.customer.salutation} ${order.customer.firstName} ${order.customer.lastName}`}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                            {order.customer.businessLegalName
                              ? order.customer.businessLegalName
                              : '---'}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                            <ItemsTable
                              order={order}
                              showItemsDetails={showItemsDetails}
                            />
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                            {order.customer.businessLegalName ? 'B2B' : 'B2C'}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                            {order.customer.placeOfSupply}
                          </td>

                          <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                            ₹{formattedAmount(order.price)}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-right text-sm whitespace-nowrap text-gray-900 capitalize'>
                            ₹{formattedAmount(order.shippingCharges)}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-right text-sm whitespace-nowrap text-gray-900 capitalize'>
                            ₹{formattedAmount(order.discount)}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-right text-sm whitespace-nowrap text-gray-900 capitalize'>
                            ₹{formattedAmount(order.otherAdjustments)}
                          </td>
                          <td className='border border-slate-400 px-3 py-4 text-right text-sm whitespace-nowrap text-gray-900 capitalize'>
                            ₹{formattedAmount(order.total)}
                          </td>

                          <td className='gap-2 border border-slate-400 px-3 py-3.5 text-sm font-medium whitespace-nowrap text-gray-500'>
                            <div className='flex gap-4'>
                              <button
                                onClick={() => handleEdit(order)}
                                className='text-wovBlue ring-wovBlue flex items-center gap-1 rounded-sm bg-indigo-50 px-2 py-1 text-sm font-semibold shadow-xs ring-1 ring-inset hover:bg-white'>
                                <PencilSquareIcon className='size-3' />
                                Edit
                              </button>
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
        </>
      ) : (
        <Alert type='info'>No Orders Found</Alert>
      )}

      <OrderForm
        showForm={showForm}
        setShowForm={setShowForm}
        handleSubmitData={handleSubmitData}
        initinalData={initinalData}
        setInitinalData={setInitinalData}
        confirmOrderLoading={confirmOrderLoading}
      />
    </div>
  );
};

export default OrderScreen;
