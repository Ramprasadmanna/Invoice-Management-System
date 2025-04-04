import { ClipLoader } from 'react-spinners';

const Loader = () => {
  return (
    <div className='flex h-full items-center justify-center'>
      <ClipLoader size={40} color='#1E265A' speedMultiplier={1} />
    </div>
  );
};

export default Loader;
