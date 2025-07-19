export const getNextMonth = (referenceMonth: string): string => {
  const tempDate = new Date(`${referenceMonth}-01`);
  tempDate.setMonth(tempDate.getMonth() + 1);
  return tempDate.toISOString().slice(0, 10);
};
