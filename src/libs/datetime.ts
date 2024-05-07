import { format } from "date-fns";
import { ja } from "date-fns/locale";

function getNextDayFromDate(currentDate: Date) {
  const nextDay = new Date(currentDate);
  nextDay.setDate(nextDay.getDate() + 1);
  format(nextDay, 'MM/dd/yyyy HH:mm', { locale: ja })
  return nextDay;
}

function getNextMonthFirstDate(currentDate: Date) {
  const nextMonthDate = new Date(currentDate);
  nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
  nextMonthDate.setDate(1);
  return nextMonthDate;
}


const getHoursMinutesFromClientInput = (input: string) => {
  const delimiters = /[:：]/;
  let hour, minutes
  if (!input) {
    hour = "00"
    minutes = "00"
  }

  if (input.includes("：") || input.includes(":")) {
    hour = input.split(delimiters)[0]
    minutes = input.split(delimiters)[1]
  } else {
    hour = input
    minutes = "00"
  }
  return { hour, minutes }
}

const convertToMinutes = (hour: string, minute: string) => {
  return Number(hour) * 60 + Number(minute)
}


const displayHoursMinusFromMinutes = (minute: number) => {
  if (minute < 60) {
    return `${minute}分`
  }

  if (minute % 60 === 0) {
    return `${minute / 60}時`
  }

  if (minute % 60 !== 0) {
    return `${Math.floor(minute / 60)}時${minute % 60}分`
  }
}

export {
  getNextDayFromDate,
  getNextMonthFirstDate,
  getHoursMinutesFromClientInput,
  displayHoursMinusFromMinutes,
  convertToMinutes,
};
