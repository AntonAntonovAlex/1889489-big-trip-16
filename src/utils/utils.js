import dayjs from 'dayjs';

export const sortPointPrice = (pointA, pointB) => pointB.price - pointA.price;

export const sortPointTime = (pointA, pointB) => dayjs(pointB.endDate).diff(pointB.startDate) - dayjs(pointA.endDate).diff(pointA.startDate);

export const sortPointDate = (pointA, pointB) => dayjs(pointA.startDate) - dayjs(pointB.startDate);
