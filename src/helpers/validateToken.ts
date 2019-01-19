import { addMinutes, isBefore, parse } from 'date-fns';

export const isTokenTimeValid = (time: any) => {
  return isBefore(new Date(), addMinutes(parse(time), 30));
};
