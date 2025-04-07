import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const ExpenseItemForm = ({
  showForm,
  setShowForm,
  handleSubmitData,
  initinalData,
  setInitinalData,
  addGstPurchaseItemLoading,
  updateGstPurchaseItemLoading,
}) => {
  // Forms UseState
  const [name, setName] = useState('');

  // Handle Close Form
  const handleCloseForm = () => {
    setShowForm(false);
    if (initinalData) {
      setInitinalData(null);
    }
  };

  const fillInitinalData = ({ name }) => {
    setName(name);
  };

  const clearForm = () => {
    setName('');
  };

  const handleVerifyData = (e) => {
    e.preventDefault();

    if (!name) {
      return toast.error('Enter Valid Name');
    }

    const gstPurchase = {
      name,
    };

    handleSubmitData(gstPurchase);
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
          {initinalData ? 'Edit Expense Item' : 'Add Expense Item'}
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
            <div className='name'>
              <label
                htmlFor='name'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Item Name <span className='text-red-500'>*</span>
              </label>

              <div className='mt-2 flex gap-2'>
                <input
                  id='name'
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setName((prev) => prev.trim())}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0'
                />
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
                  ? 'Updating Expense Item...'
                  : 'Update Expense Item'
                : addGstPurchaseItemLoading
                  ? 'Adding Expense Item...'
                  : 'Add Expense Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ExpenseItemForm.propTypes = {
  showForm: PropTypes.bool,
  setShowForm: PropTypes.func,
  handleSubmitData: PropTypes.func,
  isEditMode: PropTypes.bool,
  initinalData: PropTypes.object,
  setInitinalData: PropTypes.func,
  addGstPurchaseItemLoading: PropTypes.bool,
  updateGstPurchaseItemLoading: PropTypes.bool,
};

export default ExpenseItemForm;
