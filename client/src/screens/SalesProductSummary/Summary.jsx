import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import MonthTable from './MonthTable';
import formattedAmount from '@utils/formatAmount';
import PropTypes from 'prop-types';
import { useState } from 'react';

const Summary = ({ productSalesDetails }) => {
  const [showData, setShowData] = useState(false);

  return (
    <div className='overflow-hidden rounded-md bg-white shadow-xs'>
      <div
        onClick={() => setShowData(!showData)}
        className={`sticky grid cursor-pointer grid-cols-5 gap-4 border-l-2 p-4 text-base shadow-md lg:grid-cols-12 lg:gap-6`}>
        <div className='col-span-4 lg:col-span-5'>
          {productSalesDetails.validity ? (
            <p className='font-medium uppercase'>
              {productSalesDetails.description}
            </p>
          ) : (
            <p className='font-medium uppercase'>
              {productSalesDetails.name}
            </p>
          )}
        </div>

        <div className='col-span-2 whitespace-nowrap lg:col-span-2'>
          <p className='text-sm font-medium text-slate-500'>
            Total Sales : {productSalesDetails.total_purchase}
          </p>
        </div>

        <div className='col-span-3 whitespace-nowrap text-right lg:col-span-4 lg:text-left'>
          <p className='text-sm font-medium text-slate-500'>
            Total Amount : ₹{formattedAmount(productSalesDetails.total_amount)}
          </p>
        </div>

        <div className='col-start-5 col-end-6 row-start-1 row-end-2 whitespace-nowrap lg:col-start-12 lg:col-end-13'>
          {showData ? (
            <ChevronUpIcon className='ml-auto size-4' />
          ) : (
            <ChevronDownIcon className='ml-auto size-4' />
          )}
        </div>
      </div>

      {showData && (
        <div className='divide-y divide-slate-300'>
          {productSalesDetails?.monthly_data?.map((monthlyData, index) => (
            <MonthTable key={index} monthlyData={monthlyData} />
          ))}
        </div>
      )}
    </div>
  );
};

Summary.propTypes = {
  productSalesDetails: PropTypes.object,
};

export default Summary;
