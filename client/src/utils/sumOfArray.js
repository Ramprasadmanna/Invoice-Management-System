const sumOfArray = (data) => {
  const total = data.reduce((acc, val) => acc + val, 0);
  const decimalFix = +total.toFixed(2);
  const format = decimalFix.toLocaleString();
  return format;
}

export default sumOfArray;