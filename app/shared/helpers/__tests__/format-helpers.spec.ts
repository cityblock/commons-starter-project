import {
  formatDueDate,
  formatInputDueDate,
  formatPatientName,
  isDueSoon,
  isPastDue,
} from '../format-helpers';

const oldDate = Date.now;

describe('Shared Component Helpers', () => {
  const dueDate = '2017-12-01 12:00:00+00:00';

  beforeAll(() => {
    const dateInMs = new Date('2017-11-11T12:00:00.992Z').valueOf();
    Date.now = jest.fn(() => dateInMs);
  });
  afterAll(() => {
    Date.now = oldDate;
  });

  describe('formatPatientName', () => {
    const firstName = 'Arya';
    const lastName = 'Stark';

    it('renders a patients full name properly', () => {
      expect(formatPatientName(firstName, lastName)).toBe('Arya Stark');
    });

    it('renders unknown if full name not present', () => {
      expect(formatPatientName('', lastName)).toBe('Unknown Stark');
    });
  });

  describe('formatDueDate', () => {
    it('formats due date if not complete', () => {
      expect(formatDueDate(dueDate)).toBe('Due Dec 1, 2017');
    });

    it('formats completion date if complete', () => {
      expect(formatDueDate(dueDate, true)).toBe('Completed Dec 1, 2017');
    });

    it('returns unknown if due date not defined', () => {
      expect(formatDueDate('')).toBe('Unknown Due Date');
    });

    it('returns due today if due today', () => {
      expect(formatDueDate('2017-11-11 12:00:00+00:00')).toBe('Due today');
    });

    it('returns due tomorrow if due tomorrow', () => {
      expect(formatDueDate('2017-11-12 12:00:00+00:00')).toBe('Due tomorrow');
    });

    it('returns past due if due 1 day ago', () => {
      expect(formatDueDate('2017-11-10 12:00:00+00:00')).toBe('Past due 1 day');
    });

    it('returns past due if due 2 days ago', () => {
      expect(formatDueDate('2017-11-09 12:00:00+00:00')).toBe('Past due 2 days');
    });
  });

  describe('formatInputDueDate', () => {
    it('formats due date if present', () => {
      expect(formatInputDueDate(dueDate)).toBe('2017-12-01');
    });

    it('returns today if due date not defined', () => {
      expect(formatInputDueDate('')).toBe('2017-11-11');
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
});
