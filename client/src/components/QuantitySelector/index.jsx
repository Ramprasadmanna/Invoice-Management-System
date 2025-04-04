import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';

const QuantitySelector = ({ data, updateQuantity }) => {
  const handleIncrement = (e) => {
    e.preventDefault();
    const incrementedQuantity = data.quantity + 1;
    updateQuantity({ ...data, quantity: incrementedQuantity });
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    const decrementedQuantity = Math.max(data.quantity - 1, 1);
    updateQuantity({ ...data, quantity: Number(decrementedQuantity) });
  };

  return (
    <div className='inline-flex items-center gap-2 rounded-lg border p-1'>
      <button
        onClick={handleDecrement}
        className={`flex h-8 w-8 items-center justify-center rounded-sm bg-slate-200 text-slate-600 hover:bg-slate-300 ${data.quantity <= 1 && 'cursor-not-allowed opacity-50'}`}>
        <MinusIcon className='size-4 text-slate-900' />
      </button>
      <span className='w-8 text-center font-bold text-slate-900'>
        {data.quantity}
      </span>
      <button
        onClick={handleIncrement}
        className={`flex h-8 w-8 items-center justify-center rounded-sm bg-slate-200 text-slate-600 hover:bg-slate-300`}>
        <PlusIcon className='size-4 text-slate-900' />
      </button>
    </div>
  );
};

QuantitySelector.propTypes = {
  data: PropTypes.object,
  updateQuantity: PropTypes.func,
};
export default QuantitySelector;
