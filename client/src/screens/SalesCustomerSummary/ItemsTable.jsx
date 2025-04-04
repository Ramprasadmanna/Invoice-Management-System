import PropTypes from 'prop-types';
import formattedAmount from '@utils/formatAmount';
import { useEffect, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { dateFormatter } from '@utils/dateTimeFormatter';

const ItemsTable = ({ invoice, showItemsDetails }) => {
  const [showTable, setShowTable] = useState(false);
  useEffect(() => {
    setShowTable(showItemsDetails);
  }, [showItemsDetails]);
  return (
    <>
      <div
        className='flex w-fit cursor-pointer items-center gap-4 rounded-md border border-wovBlue px-2 py-1 text-wovBlue'
        onClick={() => setShowTable(!showTable)}>
        {showTable ? (
          <>
            Hide Details
            <ChevronDownIcon className='size-4' />
          </>
        ) : (
          <>
            Show Details
            <ChevronUpIcon className='size-4' />
          </>
        )}
      </div>

      {(showTable || showItemsDetails) && (
        <table className='mt-2 min-w-full border-collapse overflow-hidden border border-slate-500'>
          <thead className='bg-wovBlue text-white'>
            <tr>
              <th
                scope='col'
                className='border border-slate-400 px-2 py-2 text-left text-xs font-semibold text-gray-400'>
                #
              </th>
              <th
                scope='col'
                className='border border-slate-400 px-2 py-2 text-left text-xs font-semibold text-white'>
                Item Name
              </th>
              <th
                scope='col'
                className='border border-slate-400 px-2 py-2 text-left text-xs font-semibold text-white'>
                Description
              </th>
              <th
                scope='col'
                className='border border-slate-400 px-2 py-2 text-left text-xs font-semibold text-white'>
                Item Type
              </th>
              <th
                scope='col'
                className='border border-slate-400 px-2 py-2 text-left text-xs font-semibold text-white'>
                Price
              </th>
              <th
                scope='col'
                className='border border-slate-400 px-2 py-2 text-left text-xs font-semibold text-white'>
                Quantity
              </th>
              <th
                scope='col'
                className='border border-slate-400 px-2 py-2 text-left text-xs font-semibold text-white'>
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <th
                  scope='col'
                  className='border border-slate-400 px-2 py-2 text-left text-xs font-medium text-gray-900'>
                  {index + 1}
                </th>
                <th
                  scope='col'
                  className='border border-slate-400 px-2 py-2 text-left text-xs font-medium text-gray-900'>
                  {item.name}
                  {item.validity && (
                    <div className='mt-1 flex gap-2 text-[10px] text-slate-500'>
                      <p className=''>
                        {dateFormatter(item.startDate)} -{' '}
                        {dateFormatter(item.endDate)}
                      </p>
                      <div className='min-h-full w-[1px] shrink-0 bg-slate-300'></div>
                      <p>{item.validity} Days</p>
                    </div>
                  )}
                </th>
                <th
                  scope='col'
                  className='border border-slate-400 px-2 py-2 text-left text-[10px] font-medium text-gray-900'>
                  {item.description}
                </th>
                <th
                  scope='col'
                  className='border border-slate-400 px-2 py-2 text-left text-xs font-medium text-gray-900'>
                  {item.type}
                </th>
                <th
                  scope='col'
                  className='border border-slate-400 px-2 py-2 text-right text-xs font-medium text-gray-900'>
                  ₹{formattedAmount(item.price)}
                </th>
                <th
                  scope='col'
                  className='border border-slate-400 px-2 py-2 text-left text-xs font-medium text-gray-900'>
                  {item.quantity}
                </th>
                <th
                  scope='col'
                  className='border border-slate-400 px-2 py-2 text-right text-xs font-medium text-gray-900'>
                  ₹{formattedAmount(item.total)}
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

ItemsTable.propTypes = {
  invoice: PropTypes.object,
  showItemsDetails: PropTypes.bool,
};

export default ItemsTable;
