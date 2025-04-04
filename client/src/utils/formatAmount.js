const formattedAmount = (amount) => Number(amount).toLocaleString('en-IN', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default formattedAmount;

