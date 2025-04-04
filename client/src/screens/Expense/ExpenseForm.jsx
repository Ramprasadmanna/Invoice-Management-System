import { useEffect, useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { CURRENT_STATE } from '/src/constants';
import { inputDateFormatter } from '@utils/dateTimeFormatter';
import { ClipLoader } from 'react-spinners';
import { useLazySearchExpenseItemQuery } from '@slices/expenseItemsApiSlice';

const ExpenseForm = ({
  showForm,
  setShowForm,
  handleSubmitData,
  initinalData,
  setInitinalData,
  addGstPurchaseLoading,
  updatePurchaseLoading,
}) => {
  // Forms UseState

  // Customer Information
  const [gstPurchaseItemSearchTerm, setGstPurchaseItemSearchTerm] =
    useState('');
  const [gstPurchaseItemList, setGstPurchaseItemList] = useState([]);
  const [gstPurchaseItemListOpen, setGstPurchaseItemListOpen] = useState(false);
  const [gstPurchaseItem, setGstPurchaseItem] = useState({});

  const [expenseDate, setExpenseDate] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [remarks, setRemarks] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  // API Slice Query
  const [searchExpenseItem, { isFetching: gstPurchaseItemSearchLoading }] =
    useLazySearchExpenseItemQuery();

  // Handle Close Form
  const handleCloseForm = () => {
    setShowForm(false);
    if (initinalData) {
      setInitinalData(null);
    }
  };

  // Search Function
  const handleSearchGstPurchaseItem = async (keyword) => {
    try {
      const customers = await searchExpenseItem({
        keyword,
      }).unwrap();
      setGstPurchaseItemList(customers);
      setGstPurchaseItemListOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  // Set Gst Purchase Item On Item List Click
  const handleSetGstPurchaseItem = (item) => {
    setGstPurchaseItem(item);
    setGstPurchaseItemSearchTerm('');
    setGstPurchaseItemListOpen(false);
  };

  const handlePrice = (e) => {
    const price = e.target.value;
    if (/^[\+]?\d*(\.\d{0,2})?$/.test(price)) {
      setPrice(price);
    }
  };

  const fillInitinalData = ({
    item,
    expenseDate,
    quantity,
    remarks,
    price,
    paymentMethod,
  }) => {
    setGstPurchaseItem(item);
    setExpenseDate(inputDateFormatter(expenseDate));
    setPrice((+price).toFixed(2));
    setQuantity(quantity);
    setRemarks(remarks);
    setPaymentMethod(paymentMethod);
  };

  const clearForm = () => {
    setGstPurchaseItem({});
    setExpenseDate('');
    setPrice('');
    setPaymentMethod('');
    setQuantity('');
    setRemarks('');
  };

  const handleVerifyData = (e) => {
    e.preventDefault();

    if (!gstPurchaseItem.id) {
      return toast.error('Select Valid Item');
    }

    if (!expenseDate) {
      return toast.error('Enter Valid Purchase Date');
    }

    if (!paymentMethod) {
      return toast.error('Select Valid Payment Method');
    }

    const gstPurchase = {
      item: gstPurchaseItem.id,
      expenseDate,
      price: Number(price),
      quantity: Number(quantity),
      remarks,
      paymentMethod,
    };
    handleSubmitData(gstPurchase);
  };

  // Debounce Customer Search Function
  useEffect(() => {
    const handler = setTimeout(() => {
      if (gstPurchaseItemSearchTerm.trim()) {
        handleSearchGstPurchaseItem(gstPurchaseItemSearchTerm.trim());
      } else {
        setGstPurchaseItemList([]);
        setGstPurchaseItemListOpen(false);
      }
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [gstPurchaseItemSearchTerm]);

  useEffect(() => {
    if (initinalData) {
      fillInitinalData(initinalData);
    } else {
      clearForm();
    }
  }, [initinalData, showForm]);

  return (
    <div
      className={`fixed px-6 transition-all duration-300 ${showForm ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-[rgb(0,0,0,0.5)]`}>
      <div className='relative z-50 flex h-[600px] w-[400px] flex-col rounded-md bg-white shadow-md'>
        <p className='bg-wovBlue rounded-t-md py-5 text-center text-xl font-semibold text-white'>
          {initinalData ? 'Edit Expense' : 'Add Expense'}
        </p>
        <div
          onClick={handleCloseForm}
          className='absolute top-0 right-0 w-fit translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white p-0.5'>
          <XMarkIcon className='size-5' />
        </div>

        <form
          onSubmit={handleVerifyData}
          className='scrollbar-none max-h-full w-full space-y-8 overflow-x-hidden overflow-y-scroll p-6'>
          {/* Item Information */}
          <div className='grid grid-cols-1 gap-4'>
            {/* Search Box */}
            {!initinalData && (
              <div className='search relative col-span-full'>
                <label
                  htmlFor='search'
                  className='sr-only block text-sm leading-6 font-medium text-gray-900'>
                  Search Items
                </label>

                <div className='flex items-center gap-2 rounded-md bg-slate-100 px-3 py-1.5'>
                  <MagnifyingGlassIcon className='h-4 w-4 text-slate-800' />
                  <input
                    type='search'
                    id='search'
                    value={gstPurchaseItemSearchTerm}
                    onChange={(e) =>
                      setGstPurchaseItemSearchTerm(e.target.value)
                    }
                    onBlur={() => setGstPurchaseItemListOpen(false)}
                    placeholder='Search Items Here .....'
                    className='w-full border-none bg-transparent p-1 text-sm placeholder:text-slate-500 focus:ring-0'
                  />
                  {gstPurchaseItemSearchLoading && (
                    <div>
                      <ClipLoader size={10} color='#4338ca' />
                    </div>
                  )}
                </div>

                {/* List */}
                {gstPurchaseItemListOpen && (
                  <ul className='grid-col-1 scrollbar-thin absolute top-14 grid max-h-52 w-full gap-2 overflow-y-auto rounded-md bg-slate-100 px-1.5 py-2 shadow-md'>
                    {gstPurchaseItemList.length ? (
                      gstPurchaseItemList.map((item) => (
                        <li
                          key={item.id}
                          onMouseDown={() => handleSetGstPurchaseItem(item)}
                          className='cursor-pointer rounded-md px-2 py-2 transition-colors duration-300 hover:bg-white'>
                          <p className='text-sm leading-5 capitalize'>
                            {item.name}
                          </p>
                        </li>
                      ))
                    ) : (
                      <p className='p-2 text-sm text-red-400'>
                        Product Not Found !!
                      </p>
                    )}
                  </ul>
                )}
              </div>
            )}

            <div className='purchase-date'>
              <label
                htmlFor='purchase-date'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Purchase Date
              </label>

              <div className='mt-2 flex gap-2'>
                <input
                  id='purchase-date'
                  type='date'
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  onBlur={() => setExpenseDate((prev) => prev.trim())}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0'
                />
              </div>
            </div>

            <div className='name'>
              <label
                htmlFor='name'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Item Name
              </label>

              <div className='mt-2 flex gap-2'>
                <input
                  id='name'
                  type='text'
                  defaultValue={gstPurchaseItem.name}
                  disabled
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm capitalize placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
                />
              </div>
            </div>

            <div className='quantity'>
              <label
                htmlFor='quantity'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Quantity
              </label>

              <div className='mt-2 flex gap-2'>
                <input
                  id='quantity'
                  type='text'
                  inputMode='numeric'
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm capitalize placeholder:text-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
                />
              </div>
            </div>

            <div className='price'>
              <label
                htmlFor='price'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Total
              </label>

              <div className='mt-2 flex gap-2'>
                <input
                  id='price'
                  type='text'
                  inputMode='numeric'
                  value={price}
                  onChange={handlePrice}
                  onBlur={() => setPrice((prev) => (+prev).toFixed(2))}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm capitalize placeholder:text-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
                />
              </div>
            </div>

            <div className='remarks'>
              <label
                htmlFor='remarks'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Remarks
              </label>
              <div className='mt-2 flex gap-4'>
                <textarea
                  id='remarks'
                  type='text'
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  onBlur={() => setRemarks((prev) => prev.trim())}
                  className='block field-sizing-content w-full resize-none rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0'
                />
              </div>
            </div>

            <div className='payment-method'>
              <p className='mb-2 block text-sm leading-6 font-medium text-gray-900'>
                Payment Method
              </p>

              <div className='grid grid-cols-2 gap-2'>
                <div className='w-full shrink-0 rounded-md bg-slate-100 px-2 py-1'>
                  <input
                    type='radio'
                    name='paymentMethod'
                    id='Savings'
                    value='Savings'
                    checked={paymentMethod === 'Savings'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className='mr-2 focus:ring-0 focus:outline-0 active:ring-0 active:outline-0'
                  />
                  <label htmlFor='Savings' className='cursor-pointer text-sm'>
                    Savings Account
                  </label>
                </div>

                <div className='w-full shrink-0 rounded-md bg-slate-100 px-2 py-1'>
                  <input
                    type='radio'
                    name='paymentMethod'
                    id='Current'
                    value='Current'
                    checked={paymentMethod === 'Current'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className='mr-2 focus:ring-0 focus:outline-0 active:ring-0 active:outline-0'
                  />
                  <label htmlFor='Current' className='cursor-pointer text-sm'>
                    Current Account
                  </label>
                </div>

                <div className='w-full shrink-0 rounded-md bg-slate-100 px-2 py-1'>
                  <input
                    type='radio'
                    name='paymentMethod'
                    id='Debit'
                    value='Debit'
                    checked={paymentMethod === 'Debit'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className='mr-2 focus:ring-0 focus:outline-0 active:ring-0 active:outline-0'
                  />
                  <label htmlFor='Debit' className='cursor-pointer text-sm'>
                    Debit Card
                  </label>
                </div>

                <div className='w-full shrink-0 rounded-md bg-slate-100 px-2 py-1'>
                  <input
                    type='radio'
                    name='paymentMethod'
                    id='Credit'
                    value='Credit'
                    checked={paymentMethod === 'Credit'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className='mr-2 focus:ring-0 focus:outline-0 active:ring-0 active:outline-0'
                  />
                  <label htmlFor='Credit' className='cursor-pointer text-sm'>
                    Credit Card
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submitting Data */}
          <button className='bg-wovBlue w-full rounded-md py-1.5 text-white transition-transform active:scale-95'>
            {initinalData
              ? updatePurchaseLoading
                ? 'Updating Expense...'
                : 'Update Expense'
              : addGstPurchaseLoading
                ? 'Adding Expense...'
                : 'Add Expense'}
          </button>
        </form>
      </div>
    </div>
  );
};

ExpenseForm.propTypes = {
  showForm: PropTypes.bool,
  setShowForm: PropTypes.func,
  handleSubmitData: PropTypes.func,
  isEditMode: PropTypes.bool,
  initinalData: PropTypes.object,
  setInitinalData: PropTypes.func,
  addGstPurchaseLoading: PropTypes.bool,
  updatePurchaseLoading: PropTypes.bool,
};

export default ExpenseForm;
