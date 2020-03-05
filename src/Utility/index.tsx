export const updateObject = (oldObject: any, updatedProperties: any) => {
  return {
    ...oldObject,
    ...updatedProperties
  };
};

export const emailRegEx = new RegExp(
  `^[a-zA-Z0-9_#$%&'*+/=?^.-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-_]+\\.)+[a-zA-Z]{2,13}$`
);
