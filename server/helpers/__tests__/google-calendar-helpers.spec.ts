import { createMockSiuMessage } from '../../spec-helpers';
import {
  createGoogleCalendarEventUrl,
  getGoogleCalendarFieldsFromSIU,
} from '../google-calendar-helpers';

describe('Google Calendar Helpers', () => {
  it('creates a url to create new calendar event', () => {
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

  it('turns siu message in to google calendar event fields', () => {
    const patientId = '12345';
    const dateTime = '2018-04-17T12:30:00.000Z';
    const message = createMockSiuMessage({ patientId, dateTime });

    expect(getGoogleCalendarFieldsFromSIU(message as any)).toMatchObject({
      start: { dateTime },
      end: { dateTime: '2018-04-17T12:45:00.000Z' },
      location: 'WHMO',
      description:
        'Please arrive 15 minutes prior to scheduled appointment time to complete required paperwork. Check in with the reception staff as soon as you arrive. This will allow time to complete required paperwork if needed.\n' +
        'Please bring your current legal photo ID, current insurance card and any referrals (if applicable)  to ALL of your appointments. Just as a reminder all applicable copays are due at time of service.\n' +
        'If you will be late to your appointment, please call the appropriate medical office.',
      summary: `[EPIC] WHMO INTERNAL MED`,
      status: 'confirmed',
      extendedProperties: {
        shared: {
          generatedBy: 'siu',
          providerName: 'Navarra Rodriguez',
          providerCredentials: 'MD, DDS',
        },
      },
    });
  });
});
