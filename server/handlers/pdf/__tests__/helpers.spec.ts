import { taskWithComment as task, CBOReferralOther } from '../../../../app/shared/util/test-data';
import { formatCBOReferralTaskPDFFileName, formatFilename } from '../helpers';

describe('PDF Handler Helpers', () => {
  describe('formatFileName', () => {
    it('returns formatted filename', () => {
      const filename = 'jonSnow';

      expect(formatFilename(filename)).toBe(`inline; filename="${filename}.pdf"`);
    });
  });

  describe('formatCBOReferralTaskPDFFileName', () => {
    it('returns empty string if no CBO referral', () => {
      expect(formatCBOReferralTaskPDFFileName({ id: 'jonSnow' } as any)).toBe('');
    });

    it('returns formatted file name for task with defined CBO', () => {
      expect(formatCBOReferralTaskPDFFileName(task as any)).toBe(
        `${task.patient.firstName}_${task.patient.lastName}_${task.CBOReferral.CBO.name}`,
      );
    });

    it('returns formatted file name for task with other CBO', () => {
      const otherTask = {
        ...task,
        CBOReferral: CBOReferralOther,
      };

      expect(formatCBOReferralTaskPDFFileName(otherTask as any)).toBe(
        `${otherTask.patient.firstName}_${otherTask.patient.lastName}_${
          otherTask.CBOReferral.name
        }`,
      );
    });
  });
});
