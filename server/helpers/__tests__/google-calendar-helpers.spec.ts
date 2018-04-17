import { createGoogleCalendarEventUrl } from '../google-calendar-helpers';

describe('Google Calendar Helpers', () => {
  it('returns base route to patient profile', () => {
    const metadata = {
      calendarId: 'cityblock.com_s1se7cgek1lr08r2qq01r4gg28@group.calendar.google.com',
      title: 'Test Event',
      location: '55 Washington St, Brooklyn, NY 11201',
      reason: 'General appointment',
      inviteeEmails: ['user@cityblock.com', 'user2@cityblock.com'],
      startDatetime: '2018-04-10T19:00:00.000Z',
      endDatetime: '2018-04-10T21:00:00.000Z',
    };

    expect(createGoogleCalendarEventUrl(metadata)).toBe(
      'https://www.google.com/calendar/event?' +
        'action=TEMPLATE&' +
        'src=cityblock.com_s1se7cgek1lr08r2qq01r4gg28%40group.calendar.google.com&' +
        'text=Test%20Event&details=General%20appointment&' +
        'location=55%20Washington%20St%2C%20Brooklyn%2C%20NY%2011201&' +
        'add=user%40cityblock.com&add=user2%40cityblock.com&' +
        'dates=20180410T190000Z%2F20180410T210000Z',
    );
  });
});
