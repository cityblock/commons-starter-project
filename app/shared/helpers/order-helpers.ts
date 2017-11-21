export const reorder = <T>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const remove = <T>(list: T[], index: number): T[] => {
  const result = Array.from(list);

  if (index > -1) {
    result.splice(index, 1);
  }

  return result;
};

export const insert = <T>(list: T[], item: T, index: number): T[] => {
  const result = Array.from(list);
  result.splice(index, 0, item);
  return result;
};
