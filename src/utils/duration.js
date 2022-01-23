import dayjs from 'dayjs';
import duration  from 'dayjs/plugin/duration';

dayjs.extend(duration);

const formatTime = (time) => (String(time).length === 1) ? `0${time}` : time;

export const getDurationFormat = (value) => {

  const days = dayjs.duration(value).days();
  const hours = dayjs.duration(value).hours();
  const minutes = dayjs.duration(value).minutes();

  if (days === 0 && hours === 0) {
    return `${formatTime(minutes)}M`;
  }

  if (days === 0 ) {
    return `${formatTime(hours)}H ${formatTime(minutes)}M`;
  }

  return `${formatTime(days)}D ${formatTime(hours)}H ${formatTime(minutes)}M`;
};
