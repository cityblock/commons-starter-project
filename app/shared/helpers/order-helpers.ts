import { PatientConcernBulkEditFields } from '../../graphql/types';

interface IOrderable {
  id: string;
  order: number;
  startedAt: string | null;
}

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

export const getOrderDiffs = <T extends IOrderable>(
  oldList: T[],
  newList: T[],
  offset: number = 0,
  toggleActiveId?: string,
): PatientConcernBulkEditFields[] => {
  const orderDiffs = [] as PatientConcernBulkEditFields[];

  newList.forEach((newItem, newIndex) => {
    const oldItem = oldList.find(item => item.id === newItem.id);
    if (!oldItem) return;

    const diffData: PatientConcernBulkEditFields = {
      id: newItem.id,
    };

    // add 1 since orders start at 1, and offset in case of inactive concern
    const newOrder = newIndex + offset + 1;
    if (oldItem.order !== newOrder) diffData.order = newOrder;

    if (toggleActiveId && newItem.id === toggleActiveId) {
      diffData.startedAt = newItem.startedAt ? null : new Date().toISOString();
    }

    if (diffData.order || ('startedAt' in diffData)) orderDiffs.push(diffData);
  });

  return orderDiffs;
};
