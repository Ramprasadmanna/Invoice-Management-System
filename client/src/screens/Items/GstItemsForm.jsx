import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import SelectWithSearch from '@components/SelectWithSearch';

const GstItemsForm = ({
  showGstItemForm,
  setShowGstItemForm,
  handleSubmitData,
  initinalData,
  setInitinalData,
  addItemLoading,
  updateItemLoading,
}) => {
  // ------ Forms UseState
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [validity, setValidity] = useState(null);
  const [hsnsacCode, setHsnSacCode] = useState('');

  const [gstSlab, setGstSlab] = useState(18);
  const [rate, setRate] = useState('');
  const [gstAmount, setGstAmount] = useState('');
  const [cgst, setCgst] = useState('');
  const [sgst, setSgst] = useState('');
  const [igst, setIgst] = useState('');
  const [total, setTotal] = useState('');
  const [description, setDescription] = useState('');

  const trainingName = 'Other Education And Training Services N.E.C.';

  //  ------ Event Handler

  // Handle Close Form
  const handleCloseForm = () => {
    setShowGstItemForm(false);
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

  // Handel GST Percentage Change
  const handleGstPercentage = (e) => {
    setGstSlab(Number(e.target.value));
    setRate('');
    setGstAmount('');
    setTotal('');
    setCgst('');
    setSgst('');
    setIgst('');
  };

  // Handel Taxable Amount Change
  const handleTaxableValue = (e) => {
    const rate = e.target.value;
    if (/^[\+]?\d*(\.\d{0,2})?$/.test(rate)) {
      const rateLocal = rate;
      const gstAmountLocal = (+rateLocal * +gstSlab) / 100;
      const sellingPriceLocal = +rateLocal + gstAmountLocal;

      setRate(rateLocal);
      setGstAmount(gstAmountLocal.toFixed(2));
      setTotal(sellingPriceLocal.toFixed(2));
      setCgst((gstAmountLocal / 2).toFixed(2));
      setSgst((gstAmountLocal / 2).toFixed(2));
      setIgst(gstAmountLocal.toFixed(2));
    }
  };

  // Handel GST Amount Change
  const handleGstAmount = (e) => {
    const gstAmount = e.target.value;

    if (/^[\+]?\d*(\.\d{0,2})?$/.test(gstAmount)) {
      const gstAmountLocal = gstAmount;
      const rateLocal = (+gstAmountLocal / +gstSlab) * 100;
      const sellingPriceLocal = +rateLocal + +gstAmountLocal;

      setGstAmount(gstAmountLocal);
      setRate(rateLocal.toFixed(2));
      setTotal(sellingPriceLocal.toFixed(2));
      setCgst((+gstAmountLocal / 2).toFixed(2));
      setSgst((+gstAmountLocal / 2).toFixed(2));
      setIgst((+gstAmountLocal).toFixed(2));
    }
  };

  // Handle Selling Price
  const handleTotal = (e) => {
    const total = e.target.value;

    if (/^[\+]?\d*(\.\d{0,2})?$/.test(total)) {
      const rateLocal = (+total * 100) / (100 + +gstSlab);
      const gstAmountLocal = +total - +rateLocal;

      setTotal(+total);
      setGstAmount(gstAmountLocal.toFixed(2));
      setRate(rateLocal.toFixed(2));
      setCgst((+gstAmountLocal / 2).toFixed(2));
      setSgst((+gstAmountLocal / 2).toFixed(2));
      setIgst((+gstAmountLocal).toFixed(2));
    }
  };

  // Handle Amount Blur Events
  const handleBlur = (setterFunc, value) => {
    if (value) {
      setterFunc((prev) => (+prev).toFixed(2));
    }
  };

  // Set Initinal Data For Edit Mode
  const fillInitinalData = ({
    type,
    name,
    validity,
    hsnsacCode,
    rate,
    gstSlab,
    cgst,
    sgst,
    igst,
    total,
    description,
  }) => {
    setType(type);
    setName(name);
    setValidity(validity);
    setHsnSacCode(hsnsacCode);
    setGstSlab(gstSlab);
    setRate(rate.toFixed(2));
    setCgst(cgst.toFixed(2));
    setSgst(sgst.toFixed(2));
    setIgst(igst.toFixed(2));
    setGstAmount((cgst + sgst).toFixed(2));
    setTotal(total.toFixed(2));
    setDescription(description);
  };

  // Clear Form After Submitting
  const clearForm = () => {
    setType('');
    setName('');
    setValidity(null);
    setHsnSacCode('');
    setRate('');
    setGstSlab(18);
    setCgst('');
    setSgst('');
    setIgst('');
    setGstAmount('');
    setTotal('');
    setDescription('');
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

    if (rate <= 0) {
      return toast.error('Invalid Rate');
    }

    if (cgst !== sgst) {
      return toast.error('Tax Price Invalid');
    }

    if (!description) {
      return toast.error('Enter Valid Description ');
    }

    const gstItem = {
      type,
      name,
      validity,
      hsnsacCode,
      rate: Number(rate),
      gstSlab,
      gstAmount: Number(gstAmount),
      cgst: Number(cgst),
      sgst: Number(sgst),
      igst: Number(igst),
      total: Number(total),
      description,
    };
    handleSubmitData(gstItem);
  };

  // ------ Use Effects

  useEffect(() => {
    if (initinalData) {
      fillInitinalData(initinalData);
    } else {
      clearForm();
    }
  }, [initinalData, showGstItemForm]);

  useEffect(() => {
    if (name.toLowerCase() !== trainingName.toLowerCase()) {
      setValidity(null);
    }
  }, [name]);

  return (
    <div
      className={`fixed px-6 transition-all duration-300 ${showGstItemForm ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-[rgb(0,0,0,0.5)]`}>
      <div className='relative z-50 flex h-[600px] w-[400px] flex-col rounded-md bg-white shadow-md'>
        <p className='bg-wovBlue rounded-t-md py-5 text-center text-xl font-semibold text-white'>
          {initinalData ? 'Edit GST Items' : 'Add New GST Items'}
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
                Item Type <span className='text-red-500'>*</span>
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
                className='block text-sm leading-6 font-medium text-gray-900'>
                Item Name <span className='text-red-500'>*</span>
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
                  Validity (In Days) <span className='text-red-500'>*</span>
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

            <div className='hsn-code'>
              <label
                htmlFor='hsn-code'
                className='block text-sm leading-6 font-medium text-gray-900'>
                HSN/SAC Code <span className='text-red-500'>*</span>
              </label>

              <div className='mt-2 flex gap-2'>
                <input
                  id='hsn-code'
                  type='text'
                  value={hsnsacCode}
                  onChange={(e) => setHsnSacCode(e.target.value)}
                  onBlur={() => setHsnSacCode((prev) => prev.trim())}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm capitalize placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0'
                />
              </div>
            </div>

            <div className='tax-slab'>
              <label
                htmlFor='tax-slab'
                className='block text-sm leading-6 font-medium text-gray-900'>
                GST % <span className='text-red-500'>*</span>
              </label>

              <div className='mt-2 flex gap-4'>
                <select
                  id='tax-slab'
                  value={gstSlab}
                  onChange={handleGstPercentage}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0'>
                  {[0, 5, 12, 18, 28].map((gstSlab, index) => (
                    <option key={index} value={gstSlab}>
                      {gstSlab}%
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='rate'>
              <label
                htmlFor='rate'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Rate <span className='text-red-500'>*</span>
              </label>

              <div className='mt-2 flex gap-2'>
                <input
                  id='rate'
                  type='text'
                  inputMode='numeric'
                  value={rate}
                  onChange={handleTaxableValue}
                  onBlur={() => handleBlur(setRate, rate)}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm capitalize placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0'
                />
              </div>
            </div>

            <div className='tax-price'>
              <label
                htmlFor='tax-price'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Tax Price <span className='text-red-500'>*</span>
              </label>

              <div className='mt-2 flex gap-2'>
                <input
                  id='tax-price'
                  type='text'
                  inputMode='numeric'
                  value={gstAmount}
                  onChange={handleGstAmount}
                  onBlur={() => handleBlur(setGstAmount, gstAmount)}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm capitalize placeholder:text-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
                />
              </div>
            </div>

            <div className='gst-Amounts flex gap-2'>
              <div>
                <label
                  htmlFor='cgst'
                  className='mb-2 block text-sm leading-6 font-medium text-gray-900'>
                  CGST
                </label>

                <input
                  id='cgst'
                  type='text'
                  value={cgst}
                  disabled
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm capitalize placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
                />
              </div>

              <div>
                <label
                  htmlFor='cgst'
                  className='mb-2 block text-sm leading-6 font-medium text-gray-900'>
                  SGST
                </label>

                <input
                  id='cgst'
                  type='text'
                  value={sgst}
                  disabled
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm capitalize placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
                />
              </div>

              <div>
                <label
                  htmlFor='cgst'
                  className='mb-2 block text-sm leading-6 font-medium text-gray-900'>
                  IGST
                </label>

                <input
                  id='cgst'
                  type='text'
                  value={igst}
                  disabled
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm capitalize placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
                />
              </div>
            </div>

            <div className='total'>
              <label
                htmlFor='total'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Total <span className='text-red-500'>*</span>
              </label>

              <div className='mt-2 flex gap-2'>
                <input
                  id='total'
                  type='text'
                  inputMode='numeric'
                  value={total}
                  onChange={handleTotal}
                  onBlur={() => handleBlur(setTotal, total)}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm capitalize placeholder:text-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
                />
              </div>
            </div>

            <div className='item-description'>
              <label
                htmlFor='item-description'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Item Description <span className='text-red-500'>*</span>
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
                  ? 'Updating GST Item...'
                  : 'Update GST Item'
                : addItemLoading
                  ? 'Adding GST Item...'
                  : 'Add GST Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

GstItemsForm.propTypes = {
  showGstItemForm: PropTypes.bool,
  setShowGstItemForm: PropTypes.func,
  handleSubmitData: PropTypes.func,
  initinalData: PropTypes.object,
  setInitinalData: PropTypes.func,
  addItemLoading: PropTypes.bool,
  updateItemLoading: PropTypes.bool,
};

export default GstItemsForm;
