import { shortPatientScreeningToolSubmission } from '../../util/test-data';
import {
  formatAge,
  formatAgeDetails,
  formatDateOfBirth,
  formatFullName,
  formatInputDate,
  formatScreeningToolScore,
  isDueSoon,
  isPastDue,
} from '../format-helpers';

const oldDate = Date.now;

describe('Shared Component Helpers', () => {
  const dueDate = '2017-12-01 12:00:00+00:00';
  const dateOfBirth = '2000-12-01 12:00:00+00:00';

  beforeAll(() => {
    const dateInMs = new Date('2017-11-11T12:00:00.992Z').valueOf();
    Date.now = jest.fn(() => dateInMs);
  });
  afterAll(() => {
    Date.now = oldDate;
  });

  describe('formatFullName', () => {
    const firstName = 'Arya';
    const lastName = 'Stark';

    it('renders a patients full name properly', () => {
      expect(formatFullName(firstName, lastName)).toBe('Arya Stark');
    });

    it('renders unknown if full name not present', () => {
      expect(formatFullName('', lastName)).toBe('Unknown Stark');
    });
  });

  describe('formatInputDate', () => {
    it('formats due date if present', () => {
      expect(formatInputDate(dueDate)).toBe('2017-12-01');
    });

    it('returns today if due date not defined', () => {
      expect(formatInputDate('')).toBe('2017-11-11');
    });
  });

  describe('isDueSoon', () => {
    it('returns true if due soon', () => {
      expect(isDueSoon('2017-11-12 12:00:00+00:00')).toBeTruthy();
    });

    it('returns false if not due soon', () => {
      expect(isDueSoon('2017-11-20 12:00:00+00:00')).toBeFalsy();
    });
  });

  describe('isPastDue', () => {
    it('returns true if past due', () => {
      expect(isPastDue('2017-11-10 12:00:00+00:00')).toBeTruthy();
    });

    it('returns false if not past due', () => {
      expect(isPastDue('2017-11-20 12:00:00+00:00')).toBeFalsy();
    });
  });

  describe('formatAge', () => {
    it('returns empty string if date of birth unknown', () => {
      expect(formatAge(null)).toBeFalsy();
    });

    it('returns formatted age if date of birth known', () => {
      expect(formatAge(dateOfBirth)).toBe('16');
    });
  });

  describe('formatDateOfBirth', () => {
    it('returns unknown if no date of birth given', () => {
      expect(formatDateOfBirth(null)).toBe('Unknown');
    });

    it('returns formatted date of birth if known', () => {
      expect(formatDateOfBirth(dateOfBirth)).toBe('12/01/2000');
    });
  });

  describe('formatAgeDetails', () => {
    it('returns empty string if no birthday or gender', () => {
      expect(formatAgeDetails(null, null)).toBeFalsy();
    });

    it('returns just formatted age if no gender', () => {
      expect(formatAgeDetails(dateOfBirth, null)).toBe('(16)');
    });

    it('returns just gender if no birthday', () => {
      expect(formatAgeDetails(null, 'f')).toBe('(F)');
    });

    it('returns both age and gender if known', () => {
      expect(formatAgeDetails(dateOfBirth, 'f')).toBe('(16 F)');
    });
  });

  describe('formatScreeningToolScore', () => {
    it('returns empty string if submisison has no score', () => {
      expect(formatScreeningToolScore({ score: null } as any)).toBeFalsy();
    });

    it('formats score properly', () => {
      expect(formatScreeningToolScore(shortPatientScreeningToolSubmission)).toBe(
        `${shortPatientScreeningToolSubmission.score} - ${
          shortPatientScreeningToolSubmission.screeningToolScoreRange.description
        }`,
      );
    });

    it('returns just score if no score range', () => {
      const score = 11;
      expect(formatScreeningToolScore({ score } as any)).toBe(`${score}`);
    });
  });
});
