export const OTHER_VALUE = 'Other';

interface IReasonOptions {
  [messageId: string]: string;
}

export const reasonOptions: IReasonOptions = {
  'glassBreak.optEmergency': 'Needed for emergency care',
  'glassBreak.optRoutine': 'Needed for routine care',
  'glassBreak.optAdmin': 'Needed for administrative reasons',
  'glassBreak.optError': 'Believe I was restricted in error',
  'glassBreak.optOther': OTHER_VALUE,
};
