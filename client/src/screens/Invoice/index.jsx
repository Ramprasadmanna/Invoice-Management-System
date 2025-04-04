import GstSalesTable from './GstSalesTable';
import GstPurchaseTable from './GstPurchaseTable';
import SalesTable from './SalesTable';
import Graph from './Graph';
import GstSalesGstPurchaseTable from './GstSalesGstPurchaseTable';

const InvoiceScreen = () => {
  return (
    <div className='flex flex-col gap-6 overflow-x-hidden overflow-y-scroll p-4 sm:p-6'>
      <p className='text-2xl font-semibold whitespace-nowrap md:text-3xl'>
        Invoice Dashboard
      </p>

      <Graph />
      <GstSalesTable />
      <GstPurchaseTable />
      <GstSalesGstPurchaseTable />
      <SalesTable />

    </div>
  );
};

export default InvoiceScreen;
