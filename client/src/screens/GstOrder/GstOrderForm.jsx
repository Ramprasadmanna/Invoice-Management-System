import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import {
  ArchiveBoxIcon,
  XMarkIcon,
  UserCircleIcon,
  BanknotesIcon,
  PencilSquareIcon,
  NewspaperIcon,
  DocumentIcon,
} from '@heroicons/react/24/outline';
import { CURRENT_STATE } from '/src/constants';
import OrderItems from './OrderItems';

const GstOrderForm = ({
  showForm,
  setShowForm,
  handleSubmitData,
  initinalData,
  setInitinalData,
  confirmOrderLoading,
}) => {
  // Forms UseState

  // Invoice Type
  const [invoiceType, setInvoiceType] = useState('');

  // Customer Information
  const [customer, setCustomer] = useState({});

  // Order Information
  const [invoiceNumber, setInvoiceId] = useState('');
  const [orderNumber, setOrderId] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Order Item's Information
  const [orderDetails, setOrderDetails] = useState({
    items: [],
    taxableAmount: 0,
    gstAmount: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    shippingCharges: 0,
    discount: 0,
    otherAdjustments: 0,
    total: 0,
    advanceAmount: 0,
    balanceDue: 0,
  });

  // Payment Information
  const [accountType, setAccountType] = useState('');

  // Customer Note
  const [customerNote, setCustomerNote] = useState(
    'Thank you for choosing Center For Energy Sciences. We appreciate your business! If you have any questions or concerns regarding this invoice, please feel free to contact our customer service at +91 9152937135. We look forward to serving you again'
  );

  const [termsAndCondition, setTermsAndCondition] = useState(
    'Goods once sold are not refundable,Exclusively Subject to Mumbai Jurisdiction only'
  );

  const [sendMail, setSendMail] = useState(true);

  // Handle Close Form
  const handleCloseForm = () => {
    setShowForm(false);
    if (initinalData) {
      setInitinalData(null);
    }
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
  const fillInitinalData = (order) => {
    setCustomer(order.customer);
    setOrderDetails({
      ...orderDetails,
      items: order.items.map((item) => ({ ...item, id: item.itemId })),
      taxableAmount: order.taxableAmount,
      gstAmount: order.gstAmount,
      cgst: order.cgst,
      sgst: order.sgst,
      igst: order.igst,
      shippingCharges: order.shippingCharges,
      discount: order.discount,
      otherAdjustments: order.otherAdjustments,
      total: order.total,
    });
  };

  // Clear Form Data
  const clearForm = () => {
    setInvoiceType('');
    setCustomer({});
    setInvoiceId('');
    setOrderId('');
    setInvoiceDate('');
    setDueDate('');
    setOrderDetails({
      items: [],
      taxableAmount: 0,
      gstAmount: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      shippingCharges: 0,
      discount: 0,
      otherAdjustments: 0,
      total: 0,
      advanceAmount: 0,
      balanceDue: 0,
    });
    setAccountType('');
    setCustomerNote(
      'Thank you for choosing Center For Energy Sciences. We appreciate your business! If you have any questions or concerns regarding this invoice, please feel free to contact our customer service at +91 9152937135. We look forward to serving you again'
    );
    setTermsAndCondition(
      'Goods once sold are not refundable,Exclusively Subject to Mumbai Jurisdiction only'
    );
  };

  // Verify Form Data Before Submitting
  const handleVerifyData = (e) => {
    e.preventDefault();

    if (!customer.id) {
      return toast.error('Select Customer');
    }

    if (!invoiceType) {
      return toast.error('Select Valid Invoice Type');
    }

    if (!invoiceDate) {
      return toast.error('Select Valid Invoice Date');
    }

    if (!dueDate) {
      return toast.error('Select Valid Invoice Due Date');
    }

    if (!accountType) {
      return toast.error('Select Valid Account Type');
    }

    if (!orderDetails.items.length) {
      return toast.error('Select Order Items');
    }

    if (!termsAndCondition) {
      return toast.error('Enter Terms & Condition');
    }

    if (!customerNote) {
      return toast.error('Enter Customer Note');
    }

    // Tax Type
    const taxType =
      CURRENT_STATE === customer.placeOfSupply.toLowerCase()
        ? {
            cgst: orderDetails.cgst,
            sgst: orderDetails.sgst,
          }
        : { igst: orderDetails.igst };

    const order = {
      invoiceType,
      customer: customer.id,
      invoiceNumber,
      orderNumber,
      invoiceDate,
      dueDate,
      items: orderDetails.items,
      taxableAmount: orderDetails.taxableAmount,
      gstAmount: orderDetails.gstAmount,
      ...taxType,
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

    handleSubmitData(order);
  };

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
          Edit GST Order
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
              <UserCircleIcon className='size-5' /> Customer Information
            </p>

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
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
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
                  defaultValue={customer.email}
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
                  defaultValue={customer.businessLegalName}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
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
                  defaultValue={customer.placeOfSupply}
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

          {/* Order Items Information */}
          <OrderItems
            orderDetails={orderDetails}
            setOrderDetails={setOrderDetails}
            customer={customer}
            initinalData={initinalData}
            showForm={showForm}
          />

          {/* Invoice Type */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <p className='grid-full text-wovBlue col-span-full mb-2 flex items-center gap-2 text-base font-semibold'>
              <DocumentIcon className='size-5' /> Invoice Type{' '}
              <span className='text-red-500'>*</span>
            </p>

            <div className='flex flex-wrap gap-2'>
              <div
                className={`w-fit shrink-0 rounded-md border-2 bg-slate-100 px-2 py-1 ${invoiceType === 'Tax Invoice' ? 'border-slate-300' : 'border-slate-100'}`}>
                <input
                  type='radio'
                  name='invoiceType'
                  id='taxInvoice'
                  value='Tax Invoice'
                  checked={invoiceType === 'Tax Invoice'}
                  onChange={(e) => setInvoiceType(e.target.value)}
                  className='mr-2 focus:ring-0 focus:outline-0 active:ring-0 active:outline-0'
                />
                <label htmlFor='taxInvoice' className='cursor-pointer text-sm'>
                  Tax Invoice
                </label>
              </div>

              <div
                className={`w-fit shrink-0 rounded-md border-2 bg-slate-100 px-2 py-1 ${invoiceType === 'Proforma' ? 'border-slate-300' : 'border-slate-100'}`}>
                <input
                  type='radio'
                  name='invoiceType'
                  id='proforma'
                  value='Proforma'
                  checked={invoiceType === 'Proforma'}
                  onChange={(e) => setInvoiceType(e.target.value)}
                  className='mr-2 focus:ring-0 focus:outline-0 active:ring-0 active:outline-0'
                />
                <label htmlFor='proforma' className='cursor-pointer text-sm'>
                  Proforma
                </label>
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <p className='grid-full text-wovBlue col-span-full mb-2 flex items-center gap-2 text-base font-semibold'>
              <ArchiveBoxIcon className='size-5' />
              Order Information
            </p>

            <div className='invoice-id'>
              <label
                htmlFor='invoice-id'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Invoice Number
              </label>
              <div className='mt-2 flex gap-2'>
                <input
                  id='invoice-id'
                  type='text'
                  value={invoiceNumber}
                  disabled={initinalData}
                  onChange={(e) => setInvoiceId(e.target.value)}
                  onBlur={() => setInvoiceId(invoiceNumber.trim())}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
                />
              </div>
            </div>

            <div className='order-id'>
              <label
                htmlFor='order-id'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Order Number
              </label>
              <div className='mt-2 flex gap-2'>
                <input
                  id='order-id'
                  type='text'
                  value={orderNumber}
                  disabled={initinalData}
                  onChange={(e) => setOrderId(e.target.value)}
                  onBlur={() => setOrderId(orderNumber.trim())}
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
                Due Date <span className='text-red-500'>*</span>
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
                  id='savings'
                  value='Savings'
                  checked={accountType === 'Savings'}
                  onChange={(e) => setAccountType(e.target.value)}
                  className='mr-2 focus:ring-0 focus:outline-0 active:ring-0 active:outline-0'
                />
                <label htmlFor='savings' className='cursor-pointer text-sm'>
                  Savings Account
                </label>
              </div>

              <div
                className={`w-fit shrink-0 rounded-md border-2 bg-slate-100 px-2 py-1 ${accountType === 'Current' ? 'border-slate-300' : 'border-slate-100'}`}>
                <input
                  type='radio'
                  name='accountType'
                  id='current'
                  value='Current'
                  checked={accountType === 'Current'}
                  onChange={(e) => setAccountType(e.target.value)}
                  className='mr-2 focus:ring-0 focus:outline-0 active:ring-0 active:outline-0'
                />
                <label htmlFor='current' className='cursor-pointer text-sm'>
                  Current Account
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
                Invoice Id
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
                Invoice Id
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
                    ? 'Send Mail After Confirming Gst Order'
                    : 'Send Mail After Confirming Gst Order'}
                </label>
              </div>
            </div>
          </div>

          {/* Submitting Data */}
          <div className='flex items-center justify-end border-t border-slate-900/10'>
            <button
              disabled={confirmOrderLoading}
              className='bg-wovBlue mt-8 w-full rounded-md px-4 py-2 text-white transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-80 sm:w-fit'>
              {confirmOrderLoading
                ? 'Confirming GST Order ....'
                : 'Confirm GST Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

GstOrderForm.propTypes = {
  showForm: PropTypes.bool,
  setShowForm: PropTypes.func,
  handleSubmitData: PropTypes.func,
  initinalData: PropTypes.object,
  setInitinalData: PropTypes.func,
  confirmOrderLoading: PropTypes.bool,
};

export default GstOrderForm;
