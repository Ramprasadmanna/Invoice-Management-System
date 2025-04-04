import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import SelectWithSearch from '@components/SelectWithSearch';

const ItemsForm = ({
  showCashItemForm,
  setShowCashItemForm,
  handleSubmitData,
  initinalData,
  setInitinalData,
  addItemLoading,
  updateItemLoading,
}) => {
  // Forms UseState
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [validity, setValidity] = useState(null);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const trainingName = 'Education And Training Services';

  //  ------ Event Handler

  // Handle Close Form
  const handleCloseForm = () => {
    setShowCashItemForm(false);
    if (initinalData) {
      setInitinalData(null);
    }
  };

  // Handle Validity
  const handleValidity = (e) => {
    if (/^\d{0,10}$/.test(e.target.value)) {
      setValidity(Number(e.target.value));
    }
  };

  const handlePrice = (e) => {
    const price = e.target.value;
    if (/^[\+]?\d*(\.\d{0,2})?$/.test(price)) {
      setPrice(price);
    }
  };

  // Set Initinal Data For Edit Mode
  const fillInitinalData = ({ type, name, description, price, validity }) => {
    setType(type);
    setName(name);
    setValidity(validity);
    setDescription(description);
    setPrice(price.toFixed(2));
  };

  // Clear Form After Submitting
  const clearForm = () => {
    setType('');
    setName('');
    setValidity(null);
    setDescription('');
    setPrice('');
  };

  // Verify Data Before Submitting
  const handleVerifyData = (e) => {
    e.preventDefault();

    if (!type) {
      return toast.error('Select Item Type');
    }

    if (!name) {
      return toast.error('Enter Valid Item Name');
    }

    if (
      name.toLocaleLowerCase() === trainingName.toLocaleLowerCase() &&
      !validity &&
      validity <= 0
    ) {
      return toast.error('Invalid Validity');
    }

    if (price <= 0) {
      return toast.error('Invalid Price');
    }

    if (!description) {
      return toast.error('Enter Valid Description ');
    }

    const item = {
      type,
      name,
      validity,
      description,
      price: Number(price),
    };
    handleSubmitData(item);
  };

  // ------ Use Effects

  useEffect(() => {
    if (initinalData) {
      fillInitinalData(initinalData);
    } else {
      clearForm();
    }
  }, [initinalData, showCashItemForm]);

  useEffect(() => {
    if (name.toLowerCase() !== trainingName.toLowerCase()) {
      setValidity(null);
    }
  }, [name]);

  return (
    <div
      className={`fixed px-6 transition-all duration-300 ${showCashItemForm ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-[rgb(0,0,0,0.5)]`}>
      <div className='relative z-50 flex max-h-[600px] w-[400px] flex-col rounded-md bg-white shadow-md'>
        <p className='bg-wovBlue rounded-t-md py-5 text-center text-xl font-semibold text-white'>
          {initinalData ? 'Edit Items' : 'Add New Items'}
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
            <div className='item-type'>
              <p className='mb-2 block text-sm leading-6 font-medium text-gray-900'>
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
                    className='mr-2 focus:ring-0 focus:outline-0 active:ring-0 active:outline-0'
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
                    className='mr-2 focus:ring-0 focus:outline-0 active:ring-0 active:outline-0'
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
                className='mb-2 block text-sm leading-6 font-medium text-gray-900'>
                Item Name
              </label>

              <SelectWithSearch
                state={name}
                setState={setName}
                list={[trainingName]}
              />
            </div>

            {/* Render Only If The Item Is Training */}
            {name.toLowerCase() === trainingName.toLowerCase() && (
              <div className='validity'>
                <label
                  htmlFor='validity'
                  className='block text-sm leading-6 font-medium text-gray-900'>
                  Validity (In Days)
                </label>

                <div className='mt-2 flex gap-2'>
                  <input
                    id='validity'
                    type='text'
                    value={validity}
                    onChange={handleValidity}
                    className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm capitalize placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0'
                  />
                </div>
              </div>
            )}

            <div className='rate'>
              <label
                htmlFor='rate'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Price
              </label>

              <div className='mt-2 flex gap-2'>
                <input
                  id='rate'
                  type='text'
                  inputMode='numeric'
                  value={price}
                  onChange={handlePrice}
                  onBlur={() => setPrice((+price).toFixed(2))}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm capitalize placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0'
                />
              </div>
            </div>

            <div className='item-description'>
              <label
                htmlFor='item-description'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Item Description
              </label>
              <div className='mt-2 flex gap-4'>
                <textarea
                  id='item-description'
                  type='text'
                  value={description}
                  rows={5}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={() => setDescription((prev) => prev.trim())}
                  className='block w-full resize-none rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0'
                />
              </div>
            </div>
          </div>

          {/* Submitting Data */}
          <div className='flex items-center justify-center border-t border-slate-900/10'>
            <button
              className='bg-wovBlue mt-8 w-full rounded-md px-4 py-2 text-white transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-80'
              disabled={updateItemLoading || addItemLoading}>
              {initinalData
                ? updateItemLoading
                  ? 'Updating Item...'
                  : 'Update Item'
                : addItemLoading
                  ? 'Adding Item...'
                  : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ItemsForm.propTypes = {
  showCashItemForm: PropTypes.bool,
  setShowCashItemForm: PropTypes.func,
  handleSubmitData: PropTypes.func,
  initinalData: PropTypes.object,
  setInitinalData: PropTypes.func,
  addItemLoading: PropTypes.bool,
  updateItemLoading: PropTypes.bool,
};

export default ItemsForm;
