import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import SelectWithSearch from '@components/SelectWithSearch';
import countryDataSet from '@data/countryDataSet';


const GstPruchaseItemForm = ({
  showForm,
  setShowForm,
  handleSubmitData,
  initinalData,
  setInitinalData,
  addGstPurchaseItemLoading,
  updateGstPurchaseItemLoading,
}) => {
  // Forms UseState
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [state, setState] = useState('Maharashtra');

  // Handle Close Form
  const handleCloseForm = () => {
    setShowForm(false);
    if (initinalData) {
      setInitinalData(null);
    }
  };

  // Get State
  const getStates = (country) => {
    const countryObj = countryDataSet.find(
      (countries) => countries.country == country
    );

    return countryObj
      ? countryObj.states.map((stateObj) => stateObj.state)
      : [];
  };

  const fillInitinalData = ({ type, name, companyName, gstNumber, state }) => {
    setType(type);
    setName(name);
    setCompanyName(companyName);
    setGstNumber(gstNumber);
    setState(state);
  };

  const clearForm = () => {
    setType('');
    setCompanyName('');
    setGstNumber('');
    setName('');
    setState('Maharashtra');
  };

  const handleVerifyData = (e) => {
    e.preventDefault();

    if (!type) {
      return toast.error('Select Item Type');
    }

    if (!name) {
      return toast.error('Enter Valid Name');
    }

    if (!companyName) {
      return toast.error('Invalid Company Name');
    }

    if (!state) {
      return toast.error('Invalid State');
    }
    if (!gstNumber) {
      return toast.error('Invalid GST Number');
    }
    if (!state) {
      return toast.error('Invalid State');
    }

    const gstPurchase = {
      type,
      name,
      companyName,
      state,
      gstNumber,
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
      className={`fixed px-6 transition-all duration-300 ${showForm ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-[rgb(0,0,0,0.5)]`}>
      <div className='relative z-50 flex max-h-[600px] w-[400px] flex-col rounded-md bg-white shadow-md'>
        <p className='rounded-t-md bg-wovBlue py-5 text-center text-xl font-semibold text-white'>
          {initinalData ? 'Edit Purchase Item' : 'Add Purchase Item'}
        </p>
        <div
          onClick={handleCloseForm}
          className='absolute right-0 top-0 w-fit -translate-y-1/2 translate-x-1/2 cursor-pointer rounded-full bg-white p-0.5'>
          <XMarkIcon className='size-5' />
        </div>

        <form
          onSubmit={handleVerifyData}
          className='max-h-full w-full space-y-8 overflow-x-hidden overflow-y-scroll p-6 scrollbar-none'>
          {/* Item Information */}
          <div className='grid grid-cols-1 gap-4'>
            <div className='item-type'>
              <p className='mb-2 block text-sm font-medium leading-6 text-gray-900'>
                Item Type
              </p>

              <div className='flex flex-wrap gap-2'>
                <div className='w-fit shrink-0 rounded-md bg-slate-100 px-2 py-1'>
                  <input
                    type='radio'
                    name='itemType'
                    id='goods'
                    value='goods'
                    checked={type === 'goods'}
                    onChange={(e) => setType(e.target.value)}
                    className='mr-2 focus:outline-0 focus:ring-0 active:outline-0 active:ring-0'
                  />
                  <label htmlFor='goods' className='cursor-pointer text-sm'>
                    Goods
                  </label>
                </div>

                <div className='w-fit shrink-0 rounded-md bg-slate-100 px-2 py-1'>
                  <input
                    type='radio'
                    name='itemType'
                    id='service'
                    value='service'
                    checked={type === 'service'}
                    onChange={(e) => setType(e.target.value)}
                    className='mr-2 focus:outline-0 focus:ring-0 active:outline-0 active:ring-0'
                  />
                  <label htmlFor='service' className='cursor-pointer text-sm'>
                    Service
                  </label>
                </div>
              </div>
            </div>

            <div className='name'>
              <label
                htmlFor='name'
                className='block text-sm font-medium leading-6 text-gray-900'>
                Item Name
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

            <div className='company-name'>
              <label
                htmlFor='company-name'
                className='block text-sm font-medium leading-6 text-gray-900'>
                Company Name
              </label>

              <div className='mt-2 flex gap-2'>
                <input
                  id='company-name'
                  type='text'
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  onBlur={() => setCompanyName((prev) => prev.trim())}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm capitalize placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0'
                />
              </div>
            </div>

            <div className='billing-state'>
              <label
                htmlFor='billing-state'
                className='block text-sm font-medium leading-6 text-gray-900'>
                State
              </label>

              <div className='mt-2 flex gap-4'>
                <SelectWithSearch
                  state={state}
                  setState={setState}
                  list={getStates('India')}
                  placeholder='Select State'
                />
              </div>
            </div>

            <div className='gst-number'>
              <label
                htmlFor='gst-number'
                className='block text-sm font-medium leading-6 text-gray-900'>
                GST Number
              </label>

              <div className='mt-2 flex gap-2'>
                <input
                  id='gst-number'
                  type='text'
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  onBlur={() => setGstNumber((prev) => prev.trim())}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm capitalize placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0'
                />
              </div>
            </div>
          </div>

          {/* Submitting Data */}
          <div className='flex items-center justify-center border-t border-slate-900/10'>
            <button
              className='mt-8 w-full rounded-md bg-wovBlue px-4 py-2 text-white transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-80'
              disabled={
                updateGstPurchaseItemLoading || addGstPurchaseItemLoading
              }>
              {initinalData
                ? updateGstPurchaseItemLoading
                  ? 'Updating Purchase Item...'
                  : 'Update Purchase Item'
                : addGstPurchaseItemLoading
                  ? 'Adding Purchase Item...'
                  : 'Add Purchase Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

GstPruchaseItemForm.propTypes = {
  showForm: PropTypes.bool,
  setShowForm: PropTypes.func,
  handleSubmitData: PropTypes.func,
  isEditMode: PropTypes.bool,
  initinalData: PropTypes.object,
  setInitinalData: PropTypes.func,
  addGstPurchaseItemLoading: PropTypes.bool,
  updateGstPurchaseItemLoading: PropTypes.bool,
};

export default GstPruchaseItemForm;
