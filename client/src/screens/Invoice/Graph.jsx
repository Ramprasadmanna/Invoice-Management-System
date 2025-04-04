import YearNavigator from '@components/YearSelector';
import monthShort from '@data/monthShort';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useGetAggregatedGraphDataQuery } from '@slices/dashboardApiSlice';
import formattedAmount from '@utils/formatAmount';
import { useMemo, useState } from 'react';
import Chart from 'react-apexcharts';

const Graph = () => {
  const [year, setYear] = useState(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    return currentMonth < 4 ? currentYear - 1 : currentYear;
  });

  const { data } = useGetAggregatedGraphDataQuery({ year });

  const chart = useMemo(
    () => ({
      series: [
        {
          name: 'GST Sales',
          data: data?.map((i) => i.gstSalesTotal) || [],
        },
        {
          name: 'GST Purchase',
          data: data?.map((i) => i.gstPurchaseTotal) || [],
        },
        {
          name: 'Sales',
          data: data?.map((i) => i.salesTotal) || [],
        },
      ],
      options: {
        chart: {
          type: 'area',
          height: 300,
          stacked: false,
          zoom: { enabled: true },
          fontFamily: 'Inter", serif',
          width: '100%',
          redrawOnParentResize: true,
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth' },
        xaxis: {
          type: 'category',
          categories: data?.map((i) => `${monthShort[i.month]} ${i.year}`),
        },
        yaxis: {
          opposite: false,
          labels: {
            formatter: (value) => `₹${formattedAmount(value)}`,
          },
        },
        legend: { horizontalAlign: 'left' },
      },
    }),
    [data]
  );

  return (
    <div className='w-full rounded-md bg-white p-4 shadow-xs sm:p-6'>
      <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
        <p className='text-xl font-semibold'>
          Total Sales Chart ({`${year}-${year + 1}`})
        </p>

        <YearNavigator year={year} setYear={setYear} />
      </div>

      <Chart
        className='mt-4'
        options={chart.options}
        series={chart.series}
        type='area'
        height={350}
      />
    </div>
  );
};

export default Graph;
