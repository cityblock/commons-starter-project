export const checkIfDueSoon = (dateString: string | null) => {
  let dueSoon = false;

  if (dateString) {
    const taskDueDate = new Date(dateString);
    dueSoon = taskDueDate.valueOf() < Date.now() + 60 * 60 * 24 * 1000;
  }

  return dueSoon;
};
