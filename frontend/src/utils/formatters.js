import { format, isValid } from 'date-fns';

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  const parsedDate = new Date(date);
  if (!isValid(parsedDate)) return 'Invalid Date';
  return format(parsedDate, formatStr);
};

export const formatNumber = (num, options) => {
  return new Intl.NumberFormat('en-US', options).format(num);
};

export const formatCO2 = (value) => {
  return `${formatNumber(value, { maximumFractionDigits: 2 })} mtCO2e`;
};

export const formatCurrency = (value, currency = 'USD') => {
  return formatNumber(value, { style: 'currency', currency });
};
