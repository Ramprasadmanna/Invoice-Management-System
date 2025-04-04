import { useEffect, useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { CURRENT_STATE } from '/src/constants';
import { inputDateFormatter } from '@utils/dateTimeFormatter';
import { useLazySearchGstPurchaseItemQuery } from '@slices/gstPurchaseItemsApiSlice';
import { ClipLoader } from 'react-spinners';

const GstPruchaseForm = ({
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

  const [purchaseDate, setPurchaseDate] = useState('');
  const [invoiceNumber, setInvoiceId] = useState('');
  const [gstSlab, setGstSlab] = useState(18);
  const [taxableAmount, setTaxableAmount] = useState('');
  const [gstAmount, setTaxAmount] = useState('');
  const [cgst, setCgst] = useState('');
  const [sgst, setSgst] = useState('');
  const [igst, setIgst] = useState('');
  const [total, setTotal] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  // API Slice Query
  const [searchGstPurchaseItem, { isFetching: gstPurchaseItemSearchLoading }] =
    useLazySearchGstPurchaseItemQuery();

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
      const customers = await searchGstPurchaseItem({
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

  // Handel GST Percentage Change
  const handleGstPercentage = (e) => {
    setGstSlab(e.target.value);
    setTaxableAmount('');
    setTaxAmount('');
    setTotal('');
    setCgst('');
    setSgst('');
    setIgst('');
  };

  // Handel Taxable Amount Change
  const handleTaxableValue = (e) => {
    const taxableAmount = e.target.value;
    if (/^[\+]?\d*(\.\d{0,2})?$/.test(taxableAmount)) {
      const taxableAmountLocal = taxableAmount;
      const gstAmountLocal = (+taxableAmountLocal * +gstSlab) / 100;
      const sellingPriceLocal = +taxableAmountLocal + gstAmountLocal;

      setTaxableAmount(taxableAmountLocal);
      setTaxAmount(gstAmountLocal.toFixed(2));
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
      const taxableAmountLocal = (+gstAmountLocal / +gstSlab) * 100;
      const sellingPriceLocal = +taxableAmountLocal + +gstAmountLocal;

      setTaxAmount(gstAmountLocal);
      setTaxableAmount(taxableAmountLocal.toFixed(2));
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
      setTaxAmount(gstAmountLocal.toFixed(2));
      setTaxableAmount(rateLocal.toFixed(2));
      setCgst((+gstAmountLocal / 2).toFixed(2));
      setSgst((+gstAmountLocal / 2).toFixed(2));
      setIgst((+gstAmountLocal).toFixed(2));
    }
  };

  const fillInitinalData = ({
    item,
    purchaseDate,
    invoiceNumber,
    taxableAmount,
    gstAmount,
    gstSlab,
    cgst,
    sgst,
    igst,
    total,
    paymentMethod,
  }) => {
    setGstPurchaseItem(item);
    setPurchaseDate(inputDateFormatter(purchaseDate));
    setInvoiceId(invoiceNumber);
    setGstSlab(gstSlab);
    setTaxableAmount((+taxableAmount).toFixed(2));
    setCgst((+cgst).toFixed(2));
    setSgst((+sgst).toFixed(2));
    setIgst((+igst).toFixed(2));
    setTaxAmount((+gstAmount).toFixed(2));
    setTotal((+total).toFixed(2));
    setPaymentMethod(paymentMethod);
  };

  const clearForm = () => {
    setGstPurchaseItem({});
    setPurchaseDate('');
    setInvoiceId('');
    setGstSlab(18);
    setTaxableAmount('');
    setCgst('');
    setSgst('');
    setIgst('');
    setTaxAmount('');
    setTotal('');
    setPaymentMethod('');
  };

  const handleVerifyData = (e) => {
    e.preventDefault();

    if (!gstPurchaseItem.id) {
      return toast.error('Select Valid Item');
    }

    if (!purchaseDate) {
      return toast.error('Enter Valid Purchase Date');
    }

    if (!invoiceNumber) {
      return toast.error('Invalid Invoice Number');
    }

    if (taxableAmount <= 0) {
      return toast.error('Enter Valid Amount');
    }

    if (!paymentMethod) {
      return toast.error('Select Valid Payment Method');
    }

    // Tax Type
    const taxType =
      CURRENT_STATE === gstPurchaseItem.state.toLowerCase()
        ? {
            cgst: Number(cgst),
            sgst: Number(sgst),
          }
        : { igst: Number(igst) };

    const gstPurchase = {
      item: gstPurchaseItem.id,
      purchaseDate,
      invoiceNumber,
      taxableAmount: Number(taxableAmount),
      gstSlab: Number(gstSlab),
      gstAmount: Number(gstAmount),
      ...taxType,
      total: Number(total),
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
          {initinalData ? 'Edit GST Purchase' : 'Add GST Purchase'}
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
                          <div className='flex items-center gap-2'>
                            <p className='text-sm leading-5 capitalize'>
                              {item.name}
                            </p>
                            <p
                              className={`h-fit w-fit rounded-xs px-1 py-0.5 text-[8px] leading-[10px] font-medium uppercase ${item.type?.toLowerCase() === 'goods' ? 'bg-green-200 text-green-600' : 'bg-blue-200 text-blue-600'} `}>
                              {item.type}
                            </p>
                          </div>
                          <p className='mt-1 text-[10px] text-gray-500 capitalize'>
                            {item.companyName}
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
                    checked={gstPurchaseItem.type === 'goods'}
                    disabled
                    className='mr-2 focus:ring-0 focus:outline-0 active:ring-0 active:outline-0 disabled:cursor-not-allowed'
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
                    checked={gstPurchaseItem.type === 'service'}
                    disabled
                    className='mr-2 focus:ring-0 focus:outline-0 active:ring-0 active:outline-0 disabled:cursor-not-allowed'
                  />
                  <label htmlFor='service' className='cursor-pointer text-sm'>
                    Service
                  </label>
                </div>
              </div>
            </div>

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
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  onBlur={() => setPurchaseDate((prev) => prev.trim())}
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
                  onChange={(e) => setInvoiceId(e.target.value)}
                  onBlur={() => setInvoiceId((prev) => prev.trim())}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm capitalize placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0'
                />
              </div>
            </div>

            <div className='company-name'>
              <label
                htmlFor='company-name'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Company Name
              </label>

              <div className='mt-2 flex gap-2'>
                <input
                  id='company-name'
                  type='text'
                  defaultValue={gstPurchaseItem.companyName}
                  disabled
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm capitalize placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
                />
              </div>
            </div>

            <div className='billing-state'>
              <label
                htmlFor='billing-state'
                className='block text-sm leading-6 font-medium text-gray-900'>
                State
              </label>

              <div className='mt-2 flex gap-4'>
                <input
                  id='billing-state'
                  type='text'
                  defaultValue={gstPurchaseItem.state}
                  disabled
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm capitalize placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
                />
              </div>
            </div>

            <div className='gst-number'>
              <label
                htmlFor='gst-number'
                className='block text-sm leading-6 font-medium text-gray-900'>
                GST Number
              </label>

              <div className='mt-2 flex gap-2'>
                <input
                  id='gst-number'
                  type='text'
                  defaultValue={gstPurchaseItem.gstNumber}
                  disabled
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm capitalize placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
                />
              </div>
            </div>

            <div className='tax-slab'>
              <label
                htmlFor='tax-slab'
                className='block text-sm leading-6 font-medium text-gray-900'>
                GST %
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

            <div className='taxable-price'>
              <label
                htmlFor='taxable-price'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Taxable Amount
              </label>

              <div className='mt-2 flex gap-2'>
                <input
                  id='taxable-price'
                  type='text'
                  inputMode='numeric'
                  value={taxableAmount}
                  onChange={handleTaxableValue}
                  onBlur={() => setTaxableAmount((prev) => (+prev).toFixed(2))}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm capitalize placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0'
                />
              </div>
            </div>

            <div className='tax-price'>
              <label
                htmlFor='tax-price'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Tax Price
              </label>

              <div className='mt-2 flex gap-2'>
                <input
                  id='tax-price'
                  type='text'
                  inputMode='numeric'
                  value={gstAmount}
                  onChange={handleGstAmount}
                  onBlur={() => setTaxAmount((prev) => (+prev).toFixed(2))}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm capitalize placeholder:text-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
                />
              </div>
            </div>

            <div className='gst-Amounts flex gap-2'>
              {gstPurchaseItem.state?.toLowerCase() === CURRENT_STATE ? (
                <>
                  {/* CGST */}
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
                  {/* SGST */}
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
                </>
              ) : (
                <>
                  {/* IGST */}
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
                </>
              )}
            </div>

            <div className='final-amount'>
              <label
                htmlFor='final-amount'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Total
              </label>

              <div className='mt-2 flex gap-2'>
                <input
                  id='final-amount'
                  type='text'
                  inputMode='numeric'
                  value={total}
                  onChange={handleTotal}
                  onBlur={() => setTotal((prev) => (+prev).toFixed(2))}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm capitalize placeholder:text-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
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
                ? 'Updating Purchase...'
                : 'Update Purchase'
              : addGstPurchaseLoading
                ? 'Adding Purchase...'
                : 'Add Purchase'}
          </button>
        </form>
      </div>
    </div>
  );
};

GstPruchaseForm.propTypes = {
  showForm: PropTypes.bool,
  setShowForm: PropTypes.func,
  handleSubmitData: PropTypes.func,
  isEditMode: PropTypes.bool,
  initinalData: PropTypes.object,
  setInitinalData: PropTypes.func,
  addGstPurchaseLoading: PropTypes.bool,
  updatePurchaseLoading: PropTypes.bool,
};

export default GstPruchaseForm;
