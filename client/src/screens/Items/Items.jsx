import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import formattedAmount from '@utils/formatAmount';
import { toast } from 'react-toastify';
import Loader from '@components/Loader';
import Alert from '@components/Alert';
import { dateTimeFormatter } from '@utils/dateTimeFormatter';
import Paginate from '@components/Paginate';
import { Delete } from '@components/Actions/index.jsx';
import PropTypes from 'prop-types';
import CashItemsForm from './ItemsForm';
import {
  useAddCashItemMutation,
  useGetCashItemsQuery,
  useUpdateCashItemMutation,
  useDeleteCashItemMutation,
} from '@slices/cashItemsApiSlice';
import { logout } from '@slices/authSlice';
import { useDispatch } from 'react-redux';
import checkSessionExpired from '@utils/checkSession';

const Items = ({
  pageNumber,
  setPageNumber,
  keyword,
  pageSize,
  showCashItemForm,
  setShowCashItemForm,
}) => {
  const dispatch = useDispatch();

  const [initinalData, setInitinalData] = useState(null);

  // API Slice Query
  const {
    data: gstItems,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetCashItemsQuery({ keyword, pageNumber, pageSize });

  // API Slice Mutations
  const [addItem, { isLoading: addItemLoading }] = useAddCashItemMutation();

  const [updateItem, { isLoading: updateItemLoading }] =
    useUpdateCashItemMutation();

  // Edit Data Action Handler
  const handleEdit = (data) => {
    setShowCashItemForm(true);
    setInitinalData(data);
  };

  // Submit Data Action Handler
  const handleSubmitData = async (itemData) => {
    if (initinalData) {
      try {
        await updateItem({ ...itemData, id: initinalData.id }).unwrap();
        toast.success('Item Updated Sucessfully.');
        setShowCashItemForm(false);
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
        await addItem(itemData).unwrap();
        toast.success('Item Added Sucessfully');
        setShowCashItemForm(false);
        refetch();
      } catch (error) {
        if (!checkSessionExpired(error, dispatch)) {
          console.error(error);
          return toast.error(error?.data?.message || error?.message);
        }
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Alert>{error?.data?.message}</Alert>
      ) : gstItems.items.length ? (
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
                        Item Name
                      </th>
                      <th
                        scope='col'
                        className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                        Item Type
                      </th>
                      <th
                        scope='col'
                        className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                        Price
                      </th>
                      <th
                        scope='col'
                        className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                        Description
                      </th>
                      <th
                        scope='col'
                        className='border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                        Item ID
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
                        className='min-w-fit border border-slate-400 px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap'>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {gstItems.items.map((item, index) => (
                      <tr key={index}>
                        <td className='border border-slate-400 px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900'>
                          {`${(+gstItems.pageNumber - 1) * pageSize + index + 1}`.padStart(
                            2,
                            '0'
                          )}
                        </td>
                        <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                          {item.name}
                          {item.validity && (
                            <p className='mt-1 text-xs text-slate-500'>
                              Training Validity : {item.validity} Days
                            </p>
                          )}
                        </td>
                        <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                          {item.type}
                        </td>
                        <td className='border border-slate-400 px-3 py-4 text-right text-sm whitespace-nowrap text-gray-900'>
                          ₹{formattedAmount(item.price)}
                        </td>
                        <td className='max-w-80 min-w-80 border border-slate-400 px-3 py-4 text-xs text-gray-900 capitalize'>
                          {item.description}
                        </td>
                        <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                          {item.id}
                        </td>
                        <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 capitalize'>
                          {item.user.name} | {item.user.isAdmin && 'Admin'}
                        </td>
                        <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 uppercase'>
                          {dateTimeFormatter(item.createdAt)}
                        </td>
                        <td className='border border-slate-400 px-3 py-4 text-sm whitespace-nowrap text-gray-900 uppercase'>
                          {dateTimeFormatter(item.updatedAt)}
                        </td>

                        <td className='gap-2 border border-slate-400 px-3 py-3.5 text-sm font-medium whitespace-nowrap text-gray-500'>
                          <div className='flex gap-4'>
                            <button
                              onClick={() => handleEdit(item)}
                              className='text-wovBlue ring-wovBlue flex items-center gap-1 rounded-sm bg-indigo-50 px-2 py-1 text-sm font-semibold shadow-xs ring-1 ring-inset hover:bg-white'>
                              <PencilSquareIcon className='h-3 w-3' />
                              Edit
                            </button>

                            <Delete
                              queryfunc={useDeleteCashItemMutation}
                              id={item.id}
                              message='Item Deleted Sucessfully'
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Paginate
                  page={gstItems.pageNumber}
                  pages={gstItems.pages}
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
      <CashItemsForm
        showCashItemForm={showCashItemForm}
        setShowCashItemForm={setShowCashItemForm}
        handleSubmitData={handleSubmitData}
        initinalData={initinalData}
        setInitinalData={setInitinalData}
        addItemLoading={addItemLoading}
        updateItemLoading={updateItemLoading}
      />
    </>
  );
};

Items.propTypes = {
  keyword: PropTypes.string,
  pageNumber: PropTypes.number,
  setPageNumber: PropTypes.func,
  pageSize: PropTypes.number,
  showCashItemForm: PropTypes.bool,
  setShowCashItemForm: PropTypes.func,
};

export default Items;
