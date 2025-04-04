import monthsLong from "@data/monthsLong";

const dateTimeFormatter = (dateTime) => {
  const dateUTC = new Date(dateTime);

  const options = {
    timeZone: "Asia/Kolkata",
    hour12: true,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  const indianDateTime = dateUTC.toLocaleString("en-IN", options);

  return indianDateTime;
}

const dateFormatter = (dateTime) => {
  const dateUTC = new Date(dateTime);
  const yyyy = dateUTC.getFullYear();
  const mm = String(dateUTC.getMonth() + 1).padStart(2, '0');
  const dd = String(dateUTC.getDate()).padStart(2, '0');

  return `${dd}-${mm}-${yyyy}`;
}

const inputDateFormatter = (dateTime) => {
  const dateUTC = new Date(dateTime);
  const yyyy = dateUTC.getFullYear();
  const mm = String(dateUTC.getMonth() + 1).padStart(2, '0');
  const dd = String(dateUTC.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
}

const inputMYFormatter = (dateTime) => {
  const dateUTC = new Date(dateTime);
  const yyyy = dateUTC.getFullYear();
  const mm = String(dateUTC.getMonth() + 1).padStart(2, '0');

  return `${yyyy}-${mm}`;
}

const monthYearFormatter = (monthYear) => {
  const dateUTC = new Date(monthYear);
  const yyyy = dateUTC.getFullYear();
  const mm = String(dateUTC.getMonth() + 1);

  return `${monthsLong[mm]} ${yyyy}`;
}

export { dateTimeFormatter, dateFormatter, inputDateFormatter, monthYearFormatter, inputMYFormatter };