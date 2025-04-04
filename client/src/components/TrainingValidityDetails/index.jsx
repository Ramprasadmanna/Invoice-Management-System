import { dateFormatter } from '@utils/dateTimeFormatter';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const TrainingValidityDetails = ({ item, orderDetails, setOrderDetails }) => {
  const [edit, setEdit] = useState(false);
  const [validity, setValidity] = useState(item.validity);
  const [startDate, setStartDate] = useState(
    () => new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState('');

  // Handle Edit Click
  const handleEdit = (e) => {
    e.preventDefault();
    setEdit(!edit);
  };

  // Handle Validity Change
  const handleValidity = (e) => {
    if (/^\d{0,10}$/.test(e.target.value)) {
      setValidity(Number(e.target.value));
    }
  };

  // Handle Start Date
  const handleStartDate = (e) => {
    setStartDate(e.target.value);
  };

  // Trigger SideEffect When validity and startDate Changes
  useEffect(() => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + +validity);
    const endDate = date.toISOString().split('T')[0];
    setEndDate(endDate);

    const product = {
      ...item,
      validity,
      startDate,
      endDate,
    };

    const items = orderDetails.items.map((item) => {
      return item.id === product.id ? product : item;
    });

    setOrderDetails((prev) => ({ ...prev, items }));
  }, [validity, startDate]);

  return (
    <>
      <div className='mt-2 flex gap-4 text-xs whitespace-nowrap'>
        <p className='text-slate-700'>Validity: {validity} Days</p>
        <p className='text-slate-700'>Start Date: {dateFormatter(startDate)}</p>
        <p className='text-slate-700'>End Date: {dateFormatter(endDate)}</p>
        <button
          className='cursor-pointer text-indigo-700 underline'
          onClick={handleEdit}>
          Edit
        </button>
      </div>

      {edit && (
        <div className='mt-1 flex gap-4'>
          <div className='validity'>
            <label
              htmlFor='validity'
              className='block text-xs leading-6 font-medium text-gray-900'>
              Validity
            </label>
            <div className=''>
              <input
                id='validity'
                type='text'
                value={validity}
                onChange={handleValidity}
                className='font-regular block w-full rounded-xs border-transparent bg-slate-100 px-3 py-1.5 text-left text-xs text-gray-900 placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
              />
            </div>
          </div>

          <div className='start-date'>
            <label
              htmlFor='start-date'
              className='block text-xs leading-6 font-medium text-gray-900'>
              Start Date
            </label>
            <div className=''>
              <input
                id='start-date'
                type='date'
                value={startDate}
                onChange={handleStartDate}
                className='font-regular block w-full rounded-xs border-transparent bg-slate-100 px-3 py-1.5 text-left text-xs text-gray-900 placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0 disabled:cursor-not-allowed'
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

TrainingValidityDetails.propTypes = {
  item: PropTypes.object,
  orderDetails: PropTypes.object,
  setOrderDetails: PropTypes.func,
};

export default TrainingValidityDetails;
