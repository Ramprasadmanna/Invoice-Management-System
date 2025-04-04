import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import MonthTable from './MonthTable';
import formattedAmount from '@utils/formatAmount';
import PropTypes from 'prop-types';
import { useState } from 'react';

const Summary = ({ saleDetails }) => {
  const [showData, setShowData] = useState(false);

  const { firstName, lastName, businessLegalName, customerType } = saleDetails.customer;

  return (
    <div className='overflow-hidden rounded-md bg-white shadow-xs'>
      <div
        onClick={() => setShowData(!showData)}
        className={`sticky grid cursor-pointer grid-cols-5 gap-4 border-l-2 p-4 text-base shadow-md lg:grid-cols-12 lg:gap-6 ${customerType?.toLowerCase() == 'individual' ? 'border-l-green-500' : 'border-l-blue-500'}`}>
        <div className='col-span-4 lg:col-span-5'>
          {customerType?.toLowerCase() === 'individual' ? (
            <p className='font-medium uppercase'>{`${firstName} ${lastName} `}</p>
          ) : (
            <p className='font-medium uppercase'>
              {`${businessLegalName} | ${firstName} ${lastName} `}
            </p>
          )}
        </div>

        <div className='col-span-2 whitespace-nowrap lg:col-span-2'>
          <p className='text-sm font-medium text-slate-500'>
            Total Sales : {saleDetails.total_purchase}
          </p>
        </div>

        <div className='col-span-3 text-right whitespace-nowrap lg:col-span-4 lg:text-left'>
          <p className='text-sm font-medium text-slate-500'>
            Total Amount : ₹{formattedAmount(saleDetails.total_amount)}
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
          {saleDetails?.monthly_data?.map((monthlyData, index) => (
            <MonthTable
              key={index}
              monthlyData={monthlyData}
              saleDetails={saleDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};

Summary.propTypes = {
  saleDetails: PropTypes.object,
};

export default Summary;
