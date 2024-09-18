/**
 * Function for creating a expiration date from the current date and time stamp.
 */
export function setExpirationDateShoppingList() {
  let expires_at: Date;

  const currentDate = new Date();
  const expirationDate = new Date();

  expirationDate.setMonth(currentDate.getMonth() + 3);
  // eslint-disable-next-line
  expires_at = expirationDate;

  return { expires_at };
}
