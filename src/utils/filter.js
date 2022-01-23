import dayjs from 'dayjs';
import { FilterType } from '../const';

export const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs(point.startDate).format('DD/MM/YYYY') >= dayjs().format('DD/MM/YYYY')),
  [FilterType.PAST]: (points) => points.filter((point) => dayjs(point.endDate).format('DD/MM/YYYY') < dayjs().format('DD/MM/YYYY')),
};
