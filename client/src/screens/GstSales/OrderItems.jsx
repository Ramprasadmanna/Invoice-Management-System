import {
  ListBulletIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import formattedAmount from '@utils/formatAmount';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import QuantitySelector from '@components/QuantitySelector';
import { toast } from 'react-toastify';
import { CURRENT_STATE } from '/src/constants';
import { useLazySearchGstItemsQuery } from '@slices/gstItemsApiSlice';
import { ClipLoader } from 'react-spinners';
import TrainingValidityDetails from '@components/TrainingValidityDetails';

const OrderItems = ({
  orderDetails,
  setOrderDetails,
  customer,
  initinalData,
  showForm,
}) => {
  const [productSearchTerm, setProductSearchterm] = useState('');
  const [productListOpen, setProductListOpen] = useState(false);
  const [productList, setProductList] = useState([]);

  const [shipping, setShipping] = useState('0.00');
  const [discount, setDiscount] = useState('0.00');
  const [adjustments, setAdjustments] = useState('0.00');
  const [advanceAmount, setAdvanceAmount] = useState('0.00');

  const [fullPayment, setFullPayment] = useState(true);

  // Order API Slice
  const [searchItems, { isFetching: searchItemLoading }] =
    useLazySearchGstItemsQuery();

  // Search Function
  const handleSearchProduct = async (val) => {
    try {
      const res = await searchItems({ keyword: val }).unwrap();
      setProductList(res);
      setProductListOpen(true);
    } catch (error) {
      toast.error(error?.data?.message || error?.message);
      console.log(error);
    }
  };

  // Calculate OrderDetails And Set
  const calculateAndSetOrderDetails = (updatedValues) => {
    const taxableAmount = updatedValues.items
      .reduce((acc, item) => acc + +item.taxableAmount, 0)
      .toFixed(2);

    const gstAmount = updatedValues.items
      .reduce((sum, item) => sum + +item.gstAmount, 0)
      .toFixed(2);

    const cgst = (+gstAmount / 2).toFixed(2);
    const sgst = (+gstAmount / 2).toFixed(2);
    const igst = (+gstAmount).toFixed(2);
    const shippingCharges = (+updatedValues.shippingCharges).toFixed(2);
    const discount = (+updatedValues.discount).toFixed(2);
    const baseTotal =
      Number(taxableAmount) +
      Number(gstAmount) +
      Number(shippingCharges) -
      Number(discount);

    const decimalPart = Number((baseTotal % 1).toFixed(2));

    const otherAdjustments = (
      decimalPart > 0.5 ? 1 - decimalPart : -decimalPart
    ).toFixed(2);

    setAdjustments(otherAdjustments);

    const total = (
      +taxableAmount +
      +gstAmount +
      +shippingCharges -
      +discount +
      +otherAdjustments
    ).toFixed(2);

    const advanceAmount = fullPayment
      ? 0
      : (+updatedValues.advanceAmount || 0).toFixed(2);

    const balanceDue = fullPayment ? 0 : (total - advanceAmount).toFixed(2);

    setOrderDetails({
      ...updatedValues,
      taxableAmount: Number(taxableAmount),
      gstAmount: Number(gstAmount),
      cgst: Number(cgst),
      sgst: Number(sgst),
      igst: Number(igst),
      shippingCharges: Number(shippingCharges),
      discount: Number(discount),
      otherAdjustments: Number(otherAdjustments),
      total: Number(total),
      advanceAmount: Number(advanceAmount),
      balanceDue: Number(balanceDue),
    });
  };

  // Logic To Add Items In Table
  const handleAddItem = (item) => {
    setProductListOpen(false);
    setProductSearchterm('');

    const quantity = 1;
    const taxableAmount = (+item.rate * quantity).toFixed(2);
    const gstAmount = item.igst.toFixed(2);
    const total = (+taxableAmount + +gstAmount).toFixed(2);

    const product = {
      ...item,
      cgst: Number(item.cgst),
      sgst: Number(item.sgst),
      igst: Number(item.igst),
      quantity: Number(quantity),
      taxableAmount: Number(taxableAmount),
      gstAmount: Number(gstAmount),
      total: Number(total),
    };

    const existingItem = orderDetails.items.find(
      (item) => item.id === product.id
    );

    if (existingItem) {
      const items = orderDetails.items.map((item) => {
        return item.id === existingItem.id ? product : item;
      });

      calculateAndSetOrderDetails({
        ...orderDetails,
        items,
      });
    } else {
      const items = [...orderDetails.items, product];
      calculateAndSetOrderDetails({
        ...orderDetails,
        items,
      });
    }
  };

  //Logic To Update Quantity
  const updateQuantity = (item) => {
    const taxableAmount = (+item.rate * +item.quantity).toFixed(2);
    const gstAmount = ((+taxableAmount * item.gstSlab) / 100).toFixed(2);
    item.cgst = (+gstAmount / 2).toFixed(2);
    item.sgst = (+gstAmount / 2).toFixed(2);
    item.igst = (+gstAmount).toFixed(2);
    const total = (+taxableAmount + +gstAmount).toFixed(2);

    const product = {
      ...item,
      cgst: Number(item.cgst),
      sgst: Number(item.sgst),
      igst: Number(item.igst),
      taxableAmount: Number(taxableAmount),
      gstAmount: Number(gstAmount),
      total: Number(total),
    };

    const items = orderDetails.items.map((item) => {
      return item.id === product.id ? product : item;
    });

    calculateAndSetOrderDetails({
      ...orderDetails,
      items,
    });
  };

  // Logic To Delete Item
  const removeItem = (id) => {
    const updatedItems = orderDetails.items.filter((item) => item.id !== id);
    calculateAndSetOrderDetails({
      ...orderDetails,
      items: updatedItems,
    });
  };

  // Handling Shipping Charges
  const handleShippingCharges = (e) => {
    const value = e.target.value;
    if (/^[\+]?\d*(\.\d{0,2})?$/.test(value)) {
      setShipping(value);
      calculateAndSetOrderDetails({
        ...orderDetails,
        shippingCharges: +value || 0,
      });
    }
  };

  // Handling Discount Charges
  const handleDiscount = (e) => {
    const value = e.target.value;
    if (/^[\+]?\d*(\.\d{0,2})?$/.test(value)) {
      setDiscount(value);
      calculateAndSetOrderDetails({
        ...orderDetails,
        discount: +value || 0,
      });
    }
  };

  // Handling Adjustments
  const handleAdjustments = (e) => {
    const value = e.target.value;
    if (/^[\+\-]?\d*(\.\d{0,2})?$/.test(value)) {
      setAdjustments(value);
      calculateAndSetOrderDetails({
        ...orderDetails,
        otherAdjustments: +value || 0,
      });
    }
  };

  // Handle Payment Type
  const handlePaymentType = (e) => {
    const isFullPayment = e.target.name === 'fullpayment';
    setFullPayment(isFullPayment);

    setOrderDetails((prev) => ({
      ...prev,
      advanceAmount: isFullPayment ? 0 : Number(advanceAmount) || 0,
      balanceDue: isFullPayment
        ? 0
        : Number((orderDetails.total - +advanceAmount).toFixed(2)),
    }));
    setAdvanceAmount(isFullPayment ? 0 : advanceAmount);
  };

  // Handling Advance Payment
  const handleAdvance = (e) => {
    const value = e.target.value;
    if (/^[\+\-]?\d*(\.\d{0,2})?$/.test(value)) {
      setAdvanceAmount(value);
      calculateAndSetOrderDetails({
        ...orderDetails,
        advanceAmount: +value || 0,
      });
    }
  };

  const fillInitinalData = () => {
    setShipping((+initinalData.shippingCharges).toFixed(2));
    setDiscount((+initinalData.discount).toFixed(2));
    setAdjustments((+initinalData.otherAdjustments).toFixed(2));

    if (+initinalData.advanceAmount) {
      setFullPayment(false);
      setAdvanceAmount((+initinalData.advanceAmount).toFixed(2));
    }
  };

  const clearForm = () => {
    setShipping('0.00');
    setDiscount('0.00');
    setAdjustments('0.00');
    setFullPayment(true);
    setAdvanceAmount('0.00');
  };

  // Calculate Order Details When Customer Changes
  useEffect(() => {
    if (initinalData) {
      calculateAndSetOrderDetails(orderDetails);
    }
  }, [customer]);

  // Debounce Customer Search Function
  useEffect(() => {
    const handler = setTimeout(() => {
      if (productSearchTerm) {
        handleSearchProduct(productSearchTerm);
      } else {
        setProductListOpen(false);
        setProductList([]);
      }
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [productSearchTerm]);

  useEffect(() => {
    if (initinalData) {
      fillInitinalData(initinalData);
    } else {
      clearForm();
    }
  }, [initinalData, showForm]);

  return (
    <>
      {/* Order Items Information */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <p className='grid-full text-wovBlue col-span-full mb-2 flex items-center gap-2 text-base font-semibold'>
          <ListBulletIcon className='size-5' />
          Order Items Information
        </p>

        {/* Search Box */}
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
              value={productSearchTerm}
              onChange={(e) => setProductSearchterm(e.target.value)}
              onBlur={() => setProductListOpen(false)}
              placeholder='Search Items Here .....'
              className='w-full border-none bg-transparent p-1 text-sm placeholder:text-slate-500 focus:ring-0'
            />
            {searchItemLoading && (
              <div>
                <ClipLoader size={10} color='#4338ca' />
              </div>
            )}
          </div>

          {/* List */}
          {productListOpen && (
            <ul className='grid-col-1 scrollbar-thin absolute bottom-14 grid max-h-52 w-full gap-2 overflow-y-scroll rounded-md bg-slate-100 px-1.5 py-2 shadow-md md:grid-cols-2'>
              {productList.length ? (
                productList.map((item) => (
                  <li
                    key={item.id}
                    onMouseDown={() => handleAddItem(item)}
                    className='cursor-pointer rounded-md px-2 py-2 transition-colors duration-300 hover:bg-white'>
                    <div className='flex items-center gap-2'>
                      <p className='text-sm leading-5 capitalize'>
                        {item.name}
                      </p>
                      <p
                        className={`h-fit w-fit rounded-xs px-1 py-0.5 text-[8px] leading-[10px] font-medium uppercase ${item.type === 'goods' ? 'bg-green-200 text-green-600' : 'bg-blue-200 text-blue-600'} `}>
                        {item.type}
                      </p>
                    </div>
                    <p className='mt-1 text-[10px] text-gray-500 capitalize'>
                      {item.description}
                    </p>
                  </li>
                ))
              ) : (
                <p className='p-2 text-sm text-red-400'>Product Not Found !!</p>
              )}
            </ul>
          )}
        </div>

        {/*ITEMS TABLE */}
        <div className='col-span-full min-h-fit w-full overflow-x-hidden border bg-white shadow-xs'>
          <div className='scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300 overflow-x-scroll'>
            <table className='min-w-full border-collapse border border-slate-500'>
              <thead className='bg-wovBlue text-white'>
                <tr>
                  <th
                    scope='col'
                    className='border border-slate-400 px-3 py-3.5 text-left text-xs font-semibold text-gray-400'>
                    #
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-3 py-3.5 text-left text-xs font-semibold whitespace-nowrap'>
                    Item ID
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-3 py-3.5 text-left text-xs font-semibold whitespace-nowrap'>
                    Item Details
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-3 py-3.5 text-left text-xs font-semibold whitespace-nowrap'>
                    HSN/SAC
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-3 py-3.5 text-left text-xs font-semibold whitespace-nowrap'>
                    Quantity
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-3 py-3.5 text-left text-xs font-semibold whitespace-nowrap'>
                    Rate
                  </th>

                  <th
                    scope='col'
                    className='border border-slate-400 px-3 py-3.5 text-left text-xs font-semibold whitespace-nowrap'>
                    Taxable Amount
                  </th>

                  <th
                    scope='col'
                    className='border border-slate-400 px-3 py-3.5 text-left text-xs font-semibold whitespace-nowrap'>
                    GST %
                  </th>

                  {/* Render CGST/SGST or IGST */}
                  {CURRENT_STATE === customer.placeOfSupply?.toLowerCase() ? (
                    <>
                      <th
                        scope='col'
                        className='border border-slate-400 px-3 py-3.5 text-left text-xs font-semibold whitespace-nowrap'>
                        CGST
                      </th>
                      <th
                        scope='col'
                        className='border border-slate-400 px-3 py-3.5 text-left text-xs font-semibold whitespace-nowrap'>
                        SGST
                      </th>
                    </>
                  ) : (
                    <>
                      <th
                        scope='col'
                        className='border border-slate-400 px-3 py-3.5 text-left text-xs font-semibold whitespace-nowrap'>
                        IGST
                      </th>
                    </>
                  )}

                  <th
                    scope='col'
                    className='border border-slate-400 px-3 py-3.5 text-left text-xs font-semibold whitespace-nowrap'>
                    Tax Amount
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-3 py-3.5 text-left text-xs font-semibold whitespace-nowrap'>
                    Total Amount
                  </th>
                  <th
                    scope='col'
                    className='border border-slate-400 px-3 py-3.5 text-left text-xs font-semibold whitespace-nowrap'>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.items.map((item, index) => (
                  <tr key={index}>
                    <td className='border border-slate-400 px-3 py-2 text-xs font-medium whitespace-nowrap text-gray-900'>
                      {`${index + 1}`.padStart(2, '0')}
                    </td>
                    <td className='border border-slate-400 px-3 py-2 text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {item.id}
                    </td>
                    <td className='min-w-[400px] border border-slate-400 px-3 py-2 text-gray-900 capitalize'>
                      <div className='flex items-center gap-2'>
                        <p className='text-xs font-semibold whitespace-nowrap text-gray-800'>
                          {item.name}
                        </p>

                        <span
                          className={`${item.type === 'goods' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'} mb-1 rounded-xs px-1 py-0.5 text-[8px] leading-[10px] font-medium text-black uppercase`}>
                          {item.type}
                        </span>
                      </div>

                      <p className='mt-1 text-[10px] text-gray-500'>
                        {item.description}
                      </p>

                      {(item.validity || item.startDate) && (
                        <TrainingValidityDetails
                          item={item}
                          setOrderDetails={setOrderDetails}
                          orderDetails={orderDetails}
                        />
                      )}
                    </td>
                    <td className='border border-slate-400 px-3 py-2 text-xs whitespace-nowrap text-gray-900 capitalize'>
                      {item.hsnsacCode}
                    </td>
                    <td className='border border-slate-400 px-3 py-2 text-xs whitespace-nowrap text-gray-900 capitalize'>
                      <div className='quantity'>
                        <label
                          htmlFor='quantity'
                          className='sr-only block text-sm leading-6 font-medium text-gray-900'>
                          Quantity
                        </label>
                        <div className='mt-2 flex gap-2' htmlFor='quantity'>
                          <QuantitySelector
                            data={item}
                            updateQuantity={updateQuantity}
                          />
                        </div>
                      </div>
                    </td>
                    <td className='border border-slate-400 px-3 py-2 text-right text-xs whitespace-nowrap text-gray-900'>
                      ₹{formattedAmount(item.rate)}
                    </td>

                    <td className='border border-slate-400 px-3 py-2 text-right text-xs whitespace-nowrap text-gray-900'>
                      ₹{formattedAmount(item.taxableAmount)}
                    </td>

                    <td className='border border-slate-400 px-3 py-2 text-right text-xs whitespace-nowrap text-gray-900'>
                      {item.gstSlab}%
                    </td>

                    {CURRENT_STATE === customer.placeOfSupply?.toLowerCase() ? (
                      <>
                        <td className='border border-slate-400 px-3 py-2 text-right text-xs whitespace-nowrap text-gray-900'>
                          ₹{formattedAmount(item.cgst)}
                        </td>
                        <td className='border border-slate-400 px-3 py-2 text-right text-xs whitespace-nowrap text-gray-900'>
                          ₹{formattedAmount(item.sgst)}
                        </td>
                      </>
                    ) : (
                      <td className='border border-slate-400 px-3 py-2 text-right text-xs whitespace-nowrap text-gray-900'>
                        ₹{formattedAmount(item.igst)}
                      </td>
                    )}

                    <td className='border border-slate-400 px-3 py-2 text-right text-xs whitespace-nowrap text-gray-900'>
                      ₹{formattedAmount(item.gstAmount)}
                    </td>
                    <td className='border border-slate-400 px-3 py-2 text-right text-xs whitespace-nowrap text-gray-900'>
                      ₹{formattedAmount(item.total)}
                    </td>
                    <td className='border border-slate-400 px-3 py-2 text-xs whitespace-nowrap text-gray-900'>
                      <TrashIcon
                        onClick={() => removeItem(item.id)}
                        className='mx-auto size-5 cursor-pointer text-red-600 hover:text-red-400'
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SUMMARY TABLE */}
        <div className='col-span-full min-h-fit w-full overflow-x-hidden border bg-white shadow-xs'>
          <div className='scrollbar-none overflow-x-scroll'>
            <table className='min-w-full border-collapse border border-slate-500'>
              <tbody>
                {/* Sub Total */}
                <tr>
                  <td className='border border-slate-400 px-3 py-2 text-base font-medium whitespace-nowrap text-gray-900'>
                    Sub Total
                  </td>
                  <td
                    colSpan={2}
                    className='border border-slate-400 px-3 py-2 text-right text-base font-semibold whitespace-nowrap text-gray-900'>
                    ₹{formattedAmount(orderDetails.taxableAmount)}
                  </td>
                </tr>

                {/* Render CGST/SGST or IGST */}
                {CURRENT_STATE === customer.placeOfSupply?.toLowerCase() ? (
                  <>
                    {/* CGST */}
                    <tr>
                      <td className='border border-slate-400 px-3 py-2 text-base font-medium whitespace-nowrap text-gray-900'>
                        CGST
                      </td>
                      <td
                        colSpan={2}
                        className='border border-slate-400 px-3 py-2 text-right text-base font-semibold whitespace-nowrap text-gray-900'>
                        ₹{formattedAmount(orderDetails.cgst)}
                      </td>
                    </tr>
                    {/* SGST */}
                    <tr>
                      <td className='border border-slate-400 px-3 py-2 text-base font-medium whitespace-nowrap text-gray-900'>
                        SGST
                      </td>
                      <td
                        colSpan={2}
                        className='border border-slate-400 px-3 py-2 text-right text-base font-semibold whitespace-nowrap text-gray-900'>
                        ₹{formattedAmount(orderDetails.sgst)}
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    {/* IGST */}
                    <tr>
                      <td className='border border-slate-400 px-3 py-2 text-base font-medium whitespace-nowrap text-gray-900'>
                        IGST
                      </td>
                      <td
                        colSpan={2}
                        className='border border-slate-400 px-3 py-2 text-right text-base font-semibold whitespace-nowrap text-gray-900'>
                        ₹{formattedAmount(orderDetails.igst)}
                      </td>
                    </tr>
                  </>
                )}

                {/* Shipping */}
                <tr>
                  <td className='border border-slate-400 px-3 py-2 text-base font-medium whitespace-nowrap text-gray-900'>
                    Shipping
                  </td>
                  <td className='max-w-20 border border-slate-400 px-3 py-2 text-right text-base font-semibold whitespace-nowrap text-gray-900'>
                    <div className='shipping-charges'>
                      <label
                        htmlFor='shipping-charges'
                        className='sr-only block text-sm leading-6 font-medium text-gray-900'>
                        Add Shipping Charges
                      </label>
                      <div className=''>
                        <input
                          id='shipping-charges'
                          type='text'
                          disabled={!orderDetails.items.length}
                          value={shipping}
                          onChange={handleShippingCharges}
                          onBlur={() => setShipping((+shipping).toFixed(2))}
                          className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-right text-base font-semibold placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
                        />
                      </div>
                    </div>
                  </td>
                  <td className='border border-slate-400 px-3 py-2 text-right text-base font-semibold whitespace-nowrap text-gray-900'>
                    ₹{formattedAmount(orderDetails.shippingCharges)}
                  </td>
                </tr>

                {/* Discount */}
                <tr>
                  <td className='border border-slate-400 px-3 py-2 text-base font-medium whitespace-nowrap text-gray-900'>
                    Discount
                  </td>
                  <td className='max-w-20 border border-slate-400 px-3 py-2 text-right text-base font-semibold whitespace-nowrap text-gray-900'>
                    <div className='total-discount'>
                      <label
                        htmlFor='total-discount'
                        className='sr-only block text-sm leading-6 font-medium text-gray-900'>
                        Total Discount
                      </label>
                      <div className=''>
                        <input
                          id='total-discount'
                          type='text'
                          disabled={!orderDetails.items.length}
                          value={discount}
                          onChange={handleDiscount}
                          onBlur={() => setDiscount((+discount).toFixed(2))}
                          className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-right text-base font-semibold placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
                        />
                      </div>
                    </div>
                  </td>
                  <td
                    className={`${+orderDetails.discount > 0 ? 'text-red-500' : 'text-gray-900'} border border-slate-400 px-3 py-2 text-right text-base font-semibold whitespace-nowrap`}>
                    ₹{formattedAmount(orderDetails.discount)}
                  </td>
                </tr>

                {/* Adjustments */}
                <tr>
                  <td className='border border-slate-400 px-3 py-2 text-base font-medium whitespace-nowrap text-gray-900'>
                    Adjustments
                  </td>
                  <td className='max-w-20 border border-slate-400 px-3 py-2 text-right text-base font-semibold whitespace-nowrap text-gray-900'>
                    <div className='total-adjustments'>
                      <label
                        htmlFor='total-adjustments'
                        className='sr-only block text-sm leading-6 font-medium text-gray-900'>
                        Total Adjustments
                      </label>
                      <div className=''>
                        <input
                          id='total-adjustments'
                          type='text'
                          disabled={!orderDetails.items.length}
                          value={adjustments}
                          onChange={handleAdjustments}
                          onBlur={() =>
                            setAdjustments((+adjustments).toFixed(2))
                          }
                          className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-right text-base font-semibold placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
                        />
                      </div>
                    </div>
                  </td>
                  <td
                    className={`${+orderDetails.otherAdjustments < 0 ? 'text-red-500' : 'text-green-500'} border border-slate-400 px-3 py-2 text-right text-base font-semibold whitespace-nowrap`}>
                    ₹{formattedAmount(orderDetails.otherAdjustments)}
                  </td>
                </tr>

                {/* Final Amount */}
                <tr>
                  <td className='bg-wovBlue border border-slate-400 px-3 py-2 text-base font-medium whitespace-nowrap text-white'>
                    Final Amount
                  </td>
                  <td
                    colSpan={2}
                    className='bg-wovBlue border border-slate-400 px-3 py-2 text-right text-base font-semibold whitespace-nowrap text-gray-900 text-white'>
                    ₹{formattedAmount(orderDetails.total)}
                  </td>
                </tr>

                {/* Payment Type */}
                <tr>
                  <td className='border border-slate-400 px-3 py-2 text-base font-medium whitespace-nowrap text-gray-900'>
                    Payment Type
                  </td>
                  <td
                    colSpan='2'
                    className='border border-slate-400 px-3 py-2 text-base font-medium whitespace-nowrap text-gray-900'>
                    <div className='flex justify-end gap-2'>
                      <div
                        className={`w-fit shrink-0 rounded-md border-2 bg-slate-100 px-2 py-1 ${fullPayment === 'Savings' ? 'border-slate-300' : 'border-slate-100'}`}>
                        <input
                          type='radio'
                          name='partialpayment'
                          id='partialpayment'
                          disabled={!orderDetails.items.length}
                          checked={!fullPayment}
                          onChange={handlePaymentType}
                          className='mr-2 focus:ring-0 focus:outline-0 active:ring-0 active:outline-0 disabled:cursor-not-allowed'
                        />
                        <label
                          htmlFor='partialpayment'
                          className='cursor-pointer text-sm'>
                          Partial Payment
                        </label>
                      </div>

                      <div
                        className={`w-fit shrink-0 rounded-md border-2 bg-slate-100 px-2 py-1 ${fullPayment === 'Current' ? 'border-slate-300' : 'border-slate-100'}`}>
                        <input
                          type='radio'
                          name='fullpayment'
                          id='fullpayment'
                          disabled={!orderDetails.items.length}
                          checked={fullPayment}
                          onChange={handlePaymentType}
                          className='mr-2 focus:ring-0 focus:outline-0 active:ring-0 active:outline-0 disabled:cursor-not-allowed'
                        />
                        <label
                          htmlFor='fullpayment'
                          disabled={!orderDetails.items.length}
                          className='cursor-pointer text-sm'>
                          Full Payment
                        </label>
                      </div>
                    </div>
                  </td>
                </tr>

                {!fullPayment && (
                  <>
                    {/* Advance Payment */}
                    <tr>
                      <td className='border border-slate-400 px-3 py-2 text-base font-medium whitespace-nowrap text-gray-900'>
                        Advance Payment
                      </td>
                      <td className='max-w-20 border border-slate-400 px-3 py-2 text-right text-base font-semibold whitespace-nowrap text-gray-900'>
                        <div className='advanceAmount-payment'>
                          <label
                            htmlFor='advanceAmount-payment'
                            className='sr-only block text-sm leading-6 font-medium text-gray-900'>
                            Advance Payment
                          </label>
                          <div className=''>
                            <input
                              id='advanceAmount-payment'
                              type='text'
                              disabled={!orderDetails.items.length}
                              value={advanceAmount}
                              onChange={handleAdvance}
                              onBlur={() =>
                                setAdvanceAmount((+advanceAmount).toFixed(2))
                              }
                              className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-right text-base font-semibold placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
                            />
                          </div>
                        </div>
                      </td>
                      <td
                        className={`${+orderDetails.advanceAmount > +orderDetails.finalAmount && 'text-red-500'} border border-slate-400 px-3 py-2 text-right text-base font-semibold whitespace-nowrap text-gray-900`}>
                        ₹{formattedAmount(orderDetails.advanceAmount)}
                      </td>
                    </tr>
                    {/* Balance Amount */}
                    <tr>
                      <td className='bg-wovBlue border border-slate-400 px-3 py-2 text-base font-medium whitespace-nowrap text-white'>
                        Balance Due
                      </td>
                      <td
                        colSpan={2}
                        className='bg-wovBlue border border-slate-400 px-3 py-2 text-right text-base font-semibold whitespace-nowrap text-gray-900 text-white'>
                        ₹{formattedAmount(orderDetails.balanceDue)}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

OrderItems.propTypes = {
  orderDetails: PropTypes.object,
  setOrderDetails: PropTypes.func,
  customer: PropTypes.object,
  initinalData: PropTypes.object,
  showForm: PropTypes.bool,
};

export default OrderItems;
