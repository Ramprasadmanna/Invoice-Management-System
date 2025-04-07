import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { inputDateFormatter, inputMYFormatter } from '@utils/dateTimeFormatter';

const GstPaidForm = ({
  showForm,
  setShowForm,
  handleSubmitData,
  initinalData,
  setInitinalData,
  addGstPurchaseItemLoading,
  updateGstPurchaseItemLoading,
}) => {
  // Forms UseState
  const [dateOfPayment, setDateOfPayment] = useState('');
  const [monthOfGstPaid, setMonthOfGstPaid] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  // Handle Selling Price
  const handleTotal = (e) => {
    const total = e.target.value;

    if (/^[\+]?\d*(\.\d{0,2})?$/.test(total)) {
      setAmount(total);
    }
  };

  // Handle Close Form
  const handleCloseForm = () => {
    setShowForm(false);
    if (initinalData) {
      setInitinalData(null);
    }
  };

  const fillInitinalData = ({
    dateOfPayment,
    monthOfGstPaid,
    amount,
    paymentMethod,
  }) => {
    setDateOfPayment(inputDateFormatter(dateOfPayment));
    setMonthOfGstPaid(inputMYFormatter(monthOfGstPaid));
    setAmount(amount.toFixed(2));
    setPaymentMethod(paymentMethod);
  };

  const clearForm = () => {
    setDateOfPayment('');
    setMonthOfGstPaid('');
    setAmount('');
    setPaymentMethod('');
  };

  const handleVerifyData = (e) => {
    e.preventDefault();

    if (!dateOfPayment) {
      return toast.error('Enter Valid Date Of Payment');
    }

    if (!monthOfGstPaid) {
      return toast.error('Enter Valid Month Of Gst Paid');
    }

    if (!amount) {
      return toast.error('Enter Valid Amount');
    }

    if (!paymentMethod) {
      return toast.error('Select Valid Account Type');
    }

    const gstPaid = {
      dateOfPayment,
      monthOfGstPaid,
      amount: Number(amount),
      paymentMethod,
    };

    handleSubmitData(gstPaid);
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
      <div className='relative z-50 flex max-h-[600px] w-[400px] flex-col rounded-md bg-white shadow-md'>
        <p className='bg-wovBlue rounded-t-md py-5 text-center text-xl font-semibold text-white'>
          {initinalData ? 'Edit GST Paid' : 'Add GST Paid'}
        </p>
        <div
          onClick={handleCloseForm}
          className='absolute top-0 right-0 w-fit translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white p-0.5'>
          <XMarkIcon className='size-5' />
        </div>

        <form
          onSubmit={handleVerifyData}
          className='scrollbar-none max-h-full w-full space-y-8 overflow-x-hidden overflow-y-scroll p-6'>
          <div className='grid grid-cols-1 gap-4'>
            <div className='gst-paid-date'>
              <label
                htmlFor='gst-paid-date'
                className='block text-sm leading-6 font-medium text-gray-900'>
                GST Paid Date  <span className='text-red-500'>*</span>
              </label>

              <div className='mt-2 flex gap-2'>
                <input
                  id='gst-paid-date'
                  type='date'
                  value={dateOfPayment}
                  onChange={(e) => setDateOfPayment(e.target.value)}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0'
                />
              </div>
            </div>

            <div className='gst-paid-month'>
              <label
                htmlFor='gst-paid-month'
                className='block text-sm leading-6 font-medium text-gray-900'>
                GST Paid Month  <span className='text-red-500'>*</span>
              </label>

              <div className='mt-2 flex gap-2'>
                <input
                  id='gst-paid-month'
                  type='month'
                  value={monthOfGstPaid}
                  onChange={(e) => setMonthOfGstPaid(e.target.value)}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm capitalize placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0'
                />
              </div>
            </div>

            <div className='amount'>
              <label
                htmlFor='amount'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Amount  <span className='text-red-500'>*</span>
              </label>

              <div className='mt-2 flex gap-2'>
                <input
                  id='amount'
                  type='text'
                  inputMode='numeric'
                  value={amount}
                  onChange={handleTotal}
                  onBlur={() => setAmount((prev) => (+prev).toFixed(2))}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm capitalize placeholder:text-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
                />
              </div>
            </div>

            <div className='payment-method'>
              <p className='mb-2 block text-sm leading-6 font-medium text-gray-900'>
                Payment Method  <span className='text-red-500'>*</span>
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
          <div className='flex items-center justify-center border-t border-slate-900/10'>
            <button
              className='bg-wovBlue mt-8 w-full rounded-md px-4 py-2 text-white transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-80'
              disabled={
                updateGstPurchaseItemLoading || addGstPurchaseItemLoading
              }>
              {initinalData
                ? updateGstPurchaseItemLoading
                  ? 'Updating GST Paid...'
                  : 'Update GST Paid'
                : addGstPurchaseItemLoading
                  ? 'Adding GST Paid...'
                  : 'Add GST Paid'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

GstPaidForm.propTypes = {
  showForm: PropTypes.bool,
  setShowForm: PropTypes.func,
  handleSubmitData: PropTypes.func,
  isEditMode: PropTypes.bool,
  initinalData: PropTypes.object,
  setInitinalData: PropTypes.func,
  addGstPurchaseItemLoading: PropTypes.bool,
  updateGstPurchaseItemLoading: PropTypes.bool,
};

export default GstPaidForm;
