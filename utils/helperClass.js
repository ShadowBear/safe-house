export const formateDateToString = (date) => {
  if (!date) return "01.01.2000";
  let dateObject = new Date(date);
  const day = String(dateObject.getDate()).padStart(2, "0");
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const year = dateObject.getFullYear();

  return `${day}.${month}.${year}`;
};
