import { Transaction } from 'objection';
import TwilioClient from '../twilio-client';

interface IProcessSmsMessageData {
  title: string;
  jobId: string;
}

interface ITwilioMediaInstance {
  sid: string;
}

interface ITwilioSmsMessage {
  sid: string;
  dateCreated: Date;
  dateUpdated: Date;
  status: string;
  from: string;
  to: string;
  body: string;
  media: () => {
    each: (callback: (mediaItem: ITwilioMediaInstance) => void) => void;
  };
}

export async function processSmsMessages(data: IProcessSmsMessageData, existingTxn?: Transaction) {
  const twilioClient = TwilioClient.get();

  twilioClient.messages.each((message: ITwilioSmsMessage) => {
    processSmsMessage(message, existingTxn);
  });
}

export async function processSmsMessage(message: ITwilioSmsMessage, existingTxn?: Transaction) {
  const { status, sid } = message;
  // do not delete messages that are in progress
  if (isInProgress(status)) {
    return;
  }
  // delete media associated message
  await deleteMedia(message);

  // delete record of message from Twilio
  await deleteSmsMessage(sid);
}

export async function deleteMedia(message: ITwilioSmsMessage) {
  const twilioClient = TwilioClient.get();

  message.media().each(async (mediaItem: ITwilioMediaInstance) => {
    await twilioClient
      .messages(message.sid)
      .media(mediaItem.sid)
      .remove();
  });
}

export async function deleteSmsMessage(sid: string) {
  const twilioClient = TwilioClient.get();

  await twilioClient.messages(sid).remove();
}

const isInProgress = (status: string): boolean => {
  return status !== 'delivered' && status !== 'received';
};
