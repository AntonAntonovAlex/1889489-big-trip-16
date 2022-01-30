import dayjs from 'dayjs';
import { FilterType } from '../const';
import isSameOrAfter  from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrAfter);

export const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs(point.startDate).isSameOrAfter(dayjs(), 'day')),
  [FilterType.PAST]: (points) => points.filter((point) => dayjs(point.endDate).isBefore(dayjs()) && !dayjs(point.endDate).isSame(dayjs(), 'day')),
};
