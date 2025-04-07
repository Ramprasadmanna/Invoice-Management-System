import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import {
  ArchiveBoxIcon,
  XMarkIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  NewspaperIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import OrderItems from './OrderItems';
import { useLazySearchCustomersQuery } from '@slices/customerApiSlice';
import { ClipLoader } from 'react-spinners';
import { inputDateFormatter } from '@utils/dateTimeFormatter';

const SalesForm = ({
  showForm,
  setShowForm,
  handleSubmitData,
  initinalData,
  setInitinalData,
  createCashSalesLoading,
  updateCashSalesLoading,
}) => {
  // Forms UseState

  // Customer Information
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [customerList, setCustomerList] = useState([]);
  const [customerListOpen, setCustomerListOpen] = useState(false);
  const [customer, setCustomer] = useState({});

  // Order Information
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Order Item's Information
  const [orderDetails, setOrderDetails] = useState({
    items: [],
    price: 0,
    shippingCharges: 0,
    discount: 0,
    otherAdjustments: 0,
    total: 0,
    advanceAmount: 0,
    balanceDue: 0,
  });

  // Payment Information
  const [accountType, setAccountType] = useState('Savings 1');

  // Customer Note
  const [customerNote, setCustomerNote] = useState(
    'Thank you for choosing Paresh Goshar. We appreciate your business! If you have any questions or concerns regarding this invoice, please feel free to contact our customer service at +91 9152937135. We look forward to serving you again'
  );

  const [termsAndCondition, setTermsAndCondition] = useState(
    'Goods once sold are not refundable,Exclusively Subject to Mumbai Jurisdiction only'
  );

  const [sendMail, setSendMail] = useState(false);

  // API Slice Query
  const [searchCustomer, { isFetching: customerSearchLoading }] =
    useLazySearchCustomersQuery();

  // --- Event Handlers

  // Handle Close Form
  const handleCloseForm = () => {
    setShowForm(false);
    if (initinalData) {
      setInitinalData(null);
    }
  };

  // Search Function
  const handleSearchCoustomer = async (keyword) => {
    try {
      const customers = await searchCustomer({
        keyword,
      }).unwrap();
      setCustomerList(customers);
      setCustomerListOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  // Set Customer On Customer List Click
  const handleSetCustomer = (customer) => {
    setCustomer(customer);
    setCustomerSearchTerm('');
    setCustomerListOpen(false);
  };

  // Handle Add Today Date
  const handleTodayDate = (e, type, setterfunc) => {
    e.preventDefault();
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    if (type === 'invoicedate') {
      setterfunc(`${yyyy}-${mm}-${dd}`);
    } else {
      setterfunc(`${yyyy}-${mm}-${dd}`);
    }
  };

  // Set Initinal Data For Edit Form
  const fillInitinalData = (invoice) => {
    setCustomer(invoice.customer);
    setInvoiceNumber(invoice.invoiceNumber);
    setOrderNumber(invoice.orderNumber);
    setInvoiceDate(inputDateFormatter(invoice.invoiceDate));
    setDueDate(inputDateFormatter(invoice.dueDate));
    setOrderDetails({
      items: invoice.items.map((item) => ({ ...item, id: item.itemId })),
      price: invoice.price,
      shippingCharges: invoice.shippingCharges,
      discount: invoice.discount,
      otherAdjustments: invoice.otherAdjustments,
      total: invoice.total,
      advanceAmount: invoice.advanceAmount,
      balanceDue: invoice.balanceDue,
    });
    setAccountType(invoice.accountType);
    setCustomerNote(invoice.customerNote);
    setTermsAndCondition(invoice.termsAndCondition);
  };

  // Clear Form
  const clearForm = () => {
    setCustomer({});
    setInvoiceNumber('');
    setOrderNumber('');
    setInvoiceDate('');
    setDueDate('');
    setOrderDetails({
      items: [],
      price: 0,
      shippingCharges: 0,
      discount: 0,
      otherAdjustments: 0,
      total: 0,
      advanceAmount: 0,
      balanceDue: 0,
    });
    setCustomerNote(
      'Thank you for choosing Center For Energy Sciences. We appreciate your business! If you have any questions or concerns regarding this invoice, please feel free to contact our customer service at +91 9152937135. We look forward to serving you again'
    );
    setTermsAndCondition(
      'Goods once sold are not refundable,Exclusively Subject to Mumbai Jurisdiction only'
    );
    setSendMail(false);
  };

  const handleVerifyData = (e) => {
    e.preventDefault();

    if (!customer.id) {
      return toast.error('Select Customer');
    }

    if (invoiceNumber) {
      const invoiceRegex =
        /^B(100[1-9]|10[1-9][0-9]|1[1-9][0-9]{2,}|[2-9][0-9]{3,})$/;

      if (!invoiceRegex.test(invoiceNumber)) {
        return toast.error(
          "Invalid Invoice Number! It should start with 'B' and be greater than 1000."
        );
      }
    }

    if (!invoiceDate) {
      return toast.error('Select Valid Invoice Date');
    }

    if (!dueDate) {
      return toast.error('Select Valid Invoice Due Date');
    }

    if (!orderDetails.items.length) {
      return toast.error('Select Order Items');
    }

    if (!termsAndCondition) {
      return toast.error('Enter Terms & Condition');
    }

    if (!customerNote) {
      return toast.error('Enter Terms & Condition');
    }

    const sale = {
      customer: customer.id,
      invoiceNumber,
      orderNumber,
      invoiceDate,
      dueDate,
      items: orderDetails.items,
      price: orderDetails.price,
      shippingCharges: orderDetails.shippingCharges,
      discount: orderDetails.discount,
      otherAdjustments: orderDetails.otherAdjustments,
      total: orderDetails.total,
      advanceAmount: orderDetails.advanceAmount,
      balanceDue: orderDetails.balanceDue,
      accountType,
      customerNote,
      termsAndCondition,
      sendMail,
    };

    handleSubmitData(sale);
  };

  // Debounce Customer Search Function
  useEffect(() => {
    const handler = setTimeout(() => {
      if (customerSearchTerm.trim()) {
        handleSearchCoustomer(customerSearchTerm.trim());
      } else {
        setCustomerListOpen(false);
        setCustomerList([]);
      }
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [customerSearchTerm]);

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
      <div className='relative z-50 flex h-[600px] w-[400px] flex-col rounded-md bg-white shadow-md md:w-[700px] lg:w-[800px]'>
        <p className='bg-wovBlue rounded-t-md py-5 text-center text-xl font-semibold text-white'>
          {initinalData ? 'Edit Cash Sale' : 'Add Cash Sale'}
        </p>
        <div
          onClick={handleCloseForm}
          className='absolute top-0 right-0 w-fit translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white p-0.5'>
          <XMarkIcon className='size-5' />
        </div>

        <form
          onSubmit={handleVerifyData}
          className='scrollbar-none max-h-full w-full space-y-8 overflow-x-hidden overflow-y-scroll p-6'>
          {/* Customer Information */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <p className='grid-full text-wovBlue col-span-full mb-2 flex items-center gap-2 text-base font-semibold'>
              <UserCircleIcon className='size-5' /> Customer Information{' '}
              <span className='text-red-500'>*</span>
            </p>

            <div className='search relative col-span-full'>
              <label
                htmlFor='search'
                className='sr-only block text-sm leading-6 font-medium text-gray-900'>
                Search Customer
              </label>

              <div className='flex items-center gap-2 rounded-md bg-slate-100 px-3 py-1.5'>
                <MagnifyingGlassIcon className='h-4 w-4 text-slate-800' />
                <input
                  type='search'
                  id='search'
                  value={customerSearchTerm}
                  onChange={(e) => setCustomerSearchTerm(e.target.value)}
                  onBlur={() => setCustomerListOpen(false)}
                  placeholder='Search Customer ....'
                  className='w-full border-none bg-transparent p-1 text-sm placeholder:text-slate-500 focus:ring-0'
                />
                {customerSearchLoading && (
                  <div>
                    <ClipLoader size={10} color='#4338ca' />
                  </div>
                )}
              </div>

              {/* List */}
              {customerListOpen && (
                <ul className='scrollbar-thin absolute top-12 grid max-h-52 w-full grid-cols-1 gap-2 overflow-y-scroll rounded-md bg-slate-100 px-1.5 py-2 shadow-md md:grid-cols-2'>
                  {customerList.length ? (
                    customerList.map((customer, index) => (
                      <li
                        key={index}
                        onMouseDown={() => handleSetCustomer(customer)}
                        className='cursor-pointer rounded-md px-2 py-2 transition-colors duration-300 hover:bg-white'>
                        <div className='flex items-center gap-2'>
                          <p className='text-sm leading-5 capitalize'>{`${customer.salutation}.${customer.firstName} ${customer.lastName}`}</p>
                          <p
                            className={`rounded-xs px-1 py-0.5 text-[8px] leading-[10px] font-medium uppercase ${customer.customerType === 'Business' ? 'bg-rose-200 text-rose-600' : 'bg-sky-200 text-sky-600'}`}>
                            {customer.customerType}
                          </p>
                        </div>

                        <p className='mt-1 text-[10px] text-gray-500 uppercase'>
                          {customer.businessLegalName}
                        </p>
                      </li>
                    ))
                  ) : (
                    <p className='p-2 text-sm text-red-400'>
                      Customer Not Found !!
                    </p>
                  )}
                </ul>
              )}
            </div>

            <div className='customer-id'>
              <label
                htmlFor='customer-id'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Customer Id
              </label>

              <div className='mt-2 flex gap-2'>
                <input
                  id='customer-id'
                  type='text'
                  disabled
                  defaultValue={customer.id}
                  // value={}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
                />
              </div>
            </div>

            <div className='customer-type'>
              <label
                htmlFor='customer-type'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Customer Type
              </label>

              <div className='mt-2 flex gap-2'>
                <input
                  id='customer-type'
                  type='text'
                  disabled
                  defaultValue={customer.customerType}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm capitalize placeholder:text-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
                />
              </div>
            </div>

            <div className='customer-name'>
              <label
                htmlFor='customer-name'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Customer Name
              </label>

              <div className='mt-2 flex gap-2'>
                <input
                  id='customer-name'
                  type='text'
                  disabled
                  defaultValue={
                    customer?.firstName
                      ? `${customer?.salutation} ${customer?.firstName} ${customer?.lastName}`
                      : ''
                  }
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm capitalize placeholder:text-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
                />
              </div>
            </div>

            <div className='customer-email'>
              <label
                htmlFor='customer-email'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Customer Email
              </label>

              <div className='mt-2 flex gap-2'>
                <input
                  id='customer-email'
                  type='text'
                  disabled
                  defaultValue={customer?.email}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
                />
              </div>
            </div>

            <div className='business-legal-name'>
              <label
                htmlFor='business-legal-name'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Business Legal Name
              </label>

              <div className='mt-2 flex gap-2'>
                <input
                  id='business-legal-name'
                  type='text'
                  disabled
                  defaultValue={customer?.businessLegalName}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm capitalize placeholder:text-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
                />
              </div>
            </div>

            <div className='customer-place-of-supply'>
              <label
                htmlFor='customer-place-of-supply'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Place Of Supply
              </label>

              <div className='mt-2 flex gap-2'>
                <input
                  id='customer-place-of-supply'
                  type='text'
                  disabled
                  defaultValue={customer?.placeOfSupply}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
                />
              </div>
            </div>

            <div className='billing'>
              <label
                htmlFor='billing'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Billing
              </label>

              <div className='mt-2 flex gap-2'>
                <textarea
                  id='billing'
                  value={
                    customer?.billingAddress
                      ? `${customer?.billingAddress}, ${customer?.billingCity}, ${customer?.billingState}-${customer?.billingZipcode}, ${customer?.billingCountry}`
                      : ''
                  }
                  disabled
                  rows={1}
                  className='block field-sizing-content w-full resize-none rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
                />
              </div>
            </div>

            <div className='shipping'>
              <label
                htmlFor='shipping'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Shipping
              </label>

              <div className='mt-2'>
                <textarea
                  id='shipping'
                  value={
                    customer?.shippingAddress
                      ? `${customer?.shippingAddress}, ${customer?.shippingCity}, ${customer?.shippingState}-${customer?.shippingZipcode}, ${customer?.shippingCountry}`
                      : ''
                  }
                  disabled
                  rows={1}
                  className='block field-sizing-content w-full resize-none rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
                />
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <p className='grid-full text-wovBlue col-span-full mb-2 flex items-center gap-2 text-base font-semibold'>
              <ArchiveBoxIcon className='size-5' />
              Order Information
            </p>

            <div className='invoice-number'>
              <label
                htmlFor='invoice-number'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Invoice Number
              </label>
              <div className='mt-2 flex gap-2'>
                <input
                  id='invoice-number'
                  type='text'
                  value={invoiceNumber}
                  disabled={initinalData}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  onBlur={() => setInvoiceNumber(invoiceNumber.trim())}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
                />
              </div>
            </div>

            <div className='order-number'>
              <label
                htmlFor='order-number'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Order Number
              </label>
              <div className='mt-2 flex gap-2'>
                <input
                  id='order-number'
                  type='text'
                  value={orderNumber}
                  disabled={initinalData}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  onBlur={() => setOrderNumber(orderNumber.trim())}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
                />
              </div>
            </div>

            <div className='invoice-date'>
              <label
                htmlFor='invoice-date'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Invoice Date <span className='text-red-500'>*</span>
              </label>
              <div className='mt-2 flex gap-2'>
                <input
                  id='invoice-date'
                  type='date'
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0'
                />

                <button
                  onClick={(e) =>
                    handleTodayDate(e, 'invoicedate', setInvoiceDate)
                  }
                  className='bg-wovBlue rounded-md px-3 py-1.5 text-xs text-white transition-transform duration-300 active:scale-95'>
                  Today
                </button>
              </div>
            </div>

            <div className='due-date'>
              <label
                htmlFor='due-date'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Due Date  <span className='text-red-500'>*</span>
              </label>
              <div className='mt-2 flex gap-2'>
                <input
                  id='due-date'
                  type='date'
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0'
                />

                <button
                  onClick={(e) => handleTodayDate(e, 'duedate', setDueDate)}
                  className='bg-wovBlue rounded-md px-3 py-1.5 text-xs text-white transition-transform duration-300 active:scale-95'>
                  Today
                </button>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <OrderItems
            orderDetails={orderDetails}
            setOrderDetails={setOrderDetails}
            customer={customer}
            initinalData={initinalData}
            showForm={showForm}
          />

          {/* Payment Type */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <p className='grid-full text-wovBlue col-span-full mb-2 flex items-center gap-2 text-base font-semibold'>
              <BanknotesIcon className='size-5' /> Payment Information{' '}
              <span className='text-red-500'>*</span>
            </p>

            <div className='flex flex-wrap gap-2'>
              <div
                className={`w-fit shrink-0 rounded-md border-2 bg-slate-100 px-2 py-1 ${accountType === 'Savings' ? 'border-slate-300' : 'border-slate-100'}`}>
                <input
                  type='radio'
                  name='accountType'
                  id='savings1'
                  value='Savings 1'
                  checked={accountType === 'Savings 1'}
                  onChange={(e) => setAccountType(e.target.value)}
                  className='mr-2 focus:ring-0 focus:outline-0 active:ring-0 active:outline-0'
                />
                <label htmlFor='savings1' className='cursor-pointer text-sm'>
                  Savings 1
                </label>
              </div>

              <div
                className={`w-fit shrink-0 rounded-md border-2 bg-slate-100 px-2 py-1 ${accountType === 'Current' ? 'border-slate-300' : 'border-slate-100'}`}>
                <input
                  type='radio'
                  name='accountType'
                  id='savings2'
                  value='Savings 2'
                  checked={accountType === 'Savings 2'}
                  onChange={(e) => setAccountType(e.target.value)}
                  className='mr-2 focus:ring-0 focus:outline-0 active:ring-0 active:outline-0'
                />
                <label htmlFor='savings2' className='cursor-pointer text-sm'>
                  Savings 2
                </label>
              </div>
            </div>
          </div>

          {/* Terms And Condition */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <p className='grid-full text-wovBlue col-span-full mb-2 flex items-center gap-2 text-base font-semibold'>
              <NewspaperIcon className='size-5' />
              Terms & Condition <span className='text-red-500'>*</span>
            </p>

            <div className='terms-conditon col-span-full'>
              <label
                htmlFor='terms-conditon'
                className='sr-only block text-sm leading-6 font-medium text-gray-900'>
                Terms and Conditon
              </label>
              <div className='flex gap-2'>
                <textarea
                  id='terms-conditon'
                  rows={5}
                  value={termsAndCondition}
                  onChange={(e) => setTermsAndCondition(e.target.value)}
                  onBlur={(e) => setTermsAndCondition(e.target.value.trim())}
                  className='block w-full resize-none rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0'
                />
              </div>
            </div>
          </div>

          {/* Customer Note */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <p className='grid-full text-wovBlue col-span-full mb-2 flex items-center gap-2 text-base font-semibold'>
              <PencilSquareIcon className='size-5' />
              Customer Note <span className='text-red-500'>*</span>
            </p>

            <div className='customer-note col-span-full'>
              <label
                htmlFor='customer-note'
                className='sr-only block text-sm leading-6 font-medium text-gray-900'>
                Customer Note
              </label>
              <div className='flex gap-2'>
                <textarea
                  id='customer-note'
                  rows={5}
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  onBlur={(e) => setCustomerNote(e.target.value.trim())}
                  className='block w-full resize-none rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0'
                />
              </div>
            </div>
          </div>

          {/* Send Mail */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='customer-note col-span-full'>
              <div className='flex items-center gap-2'>
                <input
                  id='send-mail'
                  type='checkbox'
                  checked={sendMail}
                  onChange={() => setSendMail(!sendMail)}
                  className='block cursor-pointer resize-none rounded-xs text-sm focus:ring-0 focus:ring-transparent'
                />
                <label
                  htmlFor='send-mail'
                  className='block cursor-pointer text-sm leading-6 font-medium text-gray-900 select-none'>
                  {initinalData
                    ? 'Send Mail After Updating Sale'
                    : 'Send Mail After Creating Sale'}
                </label>
              </div>
            </div>
          </div>

          {/* Submitting Data */}
          <div className='flex items-center justify-end border-t border-slate-900/10'>
            <button
              className='bg-wovBlue mt-8 w-full rounded-md px-4 py-2 text-white transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-80 sm:w-fit'
              disabled={updateCashSalesLoading || createCashSalesLoading}>
              {initinalData
                ? updateCashSalesLoading
                  ? 'Updating Cash Sale ....'
                  : 'Update Cash Sale'
                : createCashSalesLoading
                  ? 'Creating Cash Sale ....'
                  : 'Create Cash Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

SalesForm.propTypes = {
  showForm: PropTypes.bool,
  setShowForm: PropTypes.func,
  handleSubmitData: PropTypes.func,
  initinalData: PropTypes.object,
  setInitinalData: PropTypes.func,
  createCashSalesLoading: PropTypes.bool,
  updateCashSalesLoading: PropTypes.bool,
};

export default SalesForm;
