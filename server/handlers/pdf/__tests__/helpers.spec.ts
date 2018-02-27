import {
  patient,
  taskWithComment as task,
  CBOReferralOther,
} from '../../../../app/shared/util/test-data';
import {
  formatCBOReferralTaskPdfFileName,
  formatFilename,
  formatPrintableMAPPdfFileName,
} from '../helpers';

describe('PDF Handler Helpers', () => {
  describe('formatFileName', () => {
    it('returns formatted filename', () => {
      const filename = 'jonSnow';

      expect(formatFilename(filename)).toBe(`inline; filename="${filename}.pdf"`);
    });
  });

  describe('formatCBOReferralTaskPdfFileName', () => {
    it('returns empty string if no CBO referral', () => {
      expect(formatCBOReferralTaskPdfFileName({ id: 'jonSnow' } as any)).toBe('');
    });

    it('returns formatted file name for task with defined CBO', () => {
      expect(formatCBOReferralTaskPdfFileName(task as any)).toBe(
        `${task.patient.firstName}_${task.patient.lastName}_${task.CBOReferral.CBO.name}`,
      );
    });

    it('returns formatted file name for task with other CBO', () => {
      const otherTask = {
        ...task,
        CBOReferral: CBOReferralOther,
      };

      expect(formatCBOReferralTaskPdfFileName(otherTask as any)).toBe(
        `${otherTask.patient.firstName}_${otherTask.patient.lastName}_${
          otherTask.CBOReferral.name
        }`,
      );
    });
  });

  describe('formatPrintableMAPPdfFileName', () => {
    it('formats file name for patient with no middle name', () => {
      expect(formatPrintableMAPPdfFileName(patient as any)).toBe('Bob_Smith_MAP');
    });

    it('formats file name for patient with middle name', () => {
      const patient2 = {
        firstName: 'Brienne',
        middleName: 'of',
        lastName: 'Tarth',
      };

      expect(formatPrintableMAPPdfFileName(patient2 as any)).toBe('Brienne_of_Tarth_MAP');
    });
  });
});
