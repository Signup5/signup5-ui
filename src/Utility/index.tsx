export const emailRegEx = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

export const dateToLocalDateString = (date: Date):string => {
  const y: string = date.getFullYear().toString();
  const m: string = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString();
  const d: string = (date.getDate() + 1) < 10 ? "0" + (date.getDate() + 1).toString() : (date.getDate() + 1).toString();

  return y + '-' + m + '-' + d
}