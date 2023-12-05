import dayjs from 'dayjs';

export const fetchWithTimeout = async(resource, options = {}) => {
  const { timeout = 4000 } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal  
  });
  clearTimeout(id);

  return response;
}

export const formatedDate = (date) => {
  const relativeTime = require('dayjs/plugin/relativeTime')
  dayjs.extend(relativeTime)
  const now = dayjs();
  const targetDate = dayjs(date);

  const diffInYears = now.diff(targetDate, 'year');
  const diffInDays = now.diff(targetDate, 'day');

  if (diffInYears >= 1) {
    return targetDate.format('MMMM D, YYYY')
  } else if (diffInDays >= 1) {
    return targetDate.format('MMMM D')
  } else {
    return targetDate.fromNow()
  }
}