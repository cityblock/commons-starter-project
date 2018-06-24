import moment from 'moment-timezone';
import { transaction, Transaction } from 'objection';
import { SmsMessageDirection } from 'schema';
import SmsMessage from '../models/sms-message';
import User from '../models/user';
import UserHours from '../models/user-hours';
import TwilioClient from '../twilio-client';

const SMS_CHAR_LIMIT = 160;

interface IProcessAfterHoursCommunicationsData {
  userId: string;
  contactNumber: string;
}

export async function processAfterHoursCommunications(
  data: IProcessAfterHoursCommunicationsData,
  existingTxn?: Transaction,
  existingDate?: Date,
): Promise<void> {
  await transaction(existingTxn || User.knex(), async txn => {
    const user = await User.get(data.userId, txn);

    // if user not available, don't bother checking hours
    if (!user.isAvailable) {
      await sendAfterHoursResponse(user, data.contactNumber, txn);
      return;
    }

    const userHours = await UserHours.getForUser(data.userId, txn);
    const date = existingDate || new Date();

    // Get the offset from UTC
    const zone = moment.tz.zone('America/New_York');
    const offset = zone.utcOffset(date.valueOf());

    // Convert date to local time zone
    date.setMinutes(date.getMinutes() - offset);

    const day = date.getDay();

    const todayUserHours = userHours.filter(hours => hours.weekday === day);

    const isWorkingNow = todayUserHours.some(hours => isInDateRange(hours, date));

    // if not working now, send message
    if (!isWorkingNow) {
      await sendAfterHoursResponse(user, data.contactNumber, txn);
    }
  });
}

export function isInDateRange(userHours: UserHours, date: Date): boolean {
  const fullUserHours = UserHours.withStartAndEndTime(userHours);

  const currentTime = date.getHours() * 100 + date.getMinutes();

  return currentTime >= fullUserHours.startTime && currentTime <= fullUserHours.endTime;
}

export async function sendAfterHoursResponse(
  user: User,
  contactNumber: string,
  txn: Transaction,
): Promise<void> {
  const twilioClient = TwilioClient.get();

  const messages = chunk(user.awayMessage);

  for (const message of messages) {
    const twilioPayload = await twilioClient.messages.create({
      from: user.phone,
      to: contactNumber,
      body: message,
    });

    await SmsMessage.create(
      {
        userId: user.id,
        contactNumber,
        direction: 'fromUser' as SmsMessageDirection,
        body: message,
        twilioPayload,
        messageSid: twilioPayload.sid,
      },
      txn,
    );
  }
}

export function chunk(message: string): string[] {
  const words = message.split(' ');
  const chunks: string[] = [];
  let currentChunk: string[] = [];

  words.forEach(word => {
    if (currentChunk.join(' ').length + word.length < SMS_CHAR_LIMIT) {
      currentChunk.push(word);
    } else {
      chunks.push(currentChunk.join(' '));
      currentChunk = [word];
    }
  });

  chunks.push(currentChunk.join(' '));

  return chunks;
}
