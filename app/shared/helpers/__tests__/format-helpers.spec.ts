import {
  formatAge,
  formatAgeDetails,
  formatDateOfBirth,
  formatDueDate,
  formatDueDateDefault,
  formatFullName,
  formatInputDate,
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

  describe('formatDueDateDefault', () => {
    it('formats due date if one given', () => {
      expect(formatDueDateDefault('')).toBe('11/11/2017');
    });

    it('formats invalid dates', () => {
      expect(formatDueDateDefault('invalid')).toBe('Invalid Date');
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
});
