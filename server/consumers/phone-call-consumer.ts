import { transaction, Transaction } from 'objection';
import { SmsMessageDirection } from 'schema';
import { reportError } from '../helpers/error-helpers';
import PhoneCall, { CallStatus } from '../models/phone-call';
import User from '../models/user';
import TwilioClient from '../twilio-client';

interface IProcessPhoneCallData {
  title: string;
  jobId: string;
}

interface ITwilioPhoneCall {
  sid: string;
  parentCallSid: string | null;
  dateCreated: Date;
  dateUpdated: Date;
  to: string;
  from: string;
  status: CallStatus;
  duration: string | null;
}

export async function processPhoneCalls(data: IProcessPhoneCallData, existingTxn?: Transaction) {
  const twilioClient = TwilioClient.get();

  twilioClient.calls.each((call: ITwilioPhoneCall) => {
    processPhoneCall(call, existingTxn);
  });
}

export async function processPhoneCall(call: ITwilioPhoneCall, existingTxn?: Transaction) {
  const { sid, parentCallSid, status } = call;

  // do not delete calls that are in progress
  if (isInProgress(status)) {
    return;
  }

  await transaction(existingTxn || PhoneCall.knex(), async txn => {
    // only store record of actual care worker to patient calls, not intermediate routing calls
    if (parentCallSid) {
      const phoneCall = await PhoneCall.getByCallSid(parentCallSid, txn);

      // if phone call does not exist, create record of it in DB
      if (!phoneCall) {
        await createPhoneCall(call, txn);
      }
    }
    // delete record of phone call from Twilio
    await deletePhoneCall(sid);
  });
}

export async function createPhoneCall(call: ITwilioPhoneCall, existingTxn?: Transaction) {
  const { to, from, sid, parentCallSid, status, duration, dateCreated, dateUpdated } = call;
  const isInbound = to.includes('sim:');

  await transaction(existingTxn || PhoneCall.knex(), async txn => {
    try {
      const user = isInbound
        ? await User.getBy({ fieldName: 'twilioSimId', field: to.substring(4) }, txn)
        : await User.getBy({ fieldName: 'phone', field: from }, txn);

      if (!user) {
        throw new Error(
          `There is not user with the Twilio Phone Number: ${to} or Twilio SIM: ${from}`,
        );
      }

      await PhoneCall.create(
        {
          userId: user.id,
          contactNumber: isInbound ? from : to,
          direction: isInbound
            ? ('toUser' as SmsMessageDirection)
            : ('fromUser' as SmsMessageDirection),
          callStatus: status,
          duration: duration ? Number(duration) : 0,
          twilioPayload: call,
          callSid: parentCallSid || sid,
          twilioCreatedAt: dateCreated.toISOString(),
          twilioUpdatedAt: dateUpdated.toISOString(),
        },
        txn,
      );
    } catch (err) {
      reportError(err, 'Error creating phone call record in DB', call);
      throw err;
    }
  });
}

export async function deletePhoneCall(sid: string) {
  const twilioClient = TwilioClient.get();

  await twilioClient.calls(sid).remove();
}

const isInProgress = (status: CallStatus): boolean => {
  return status === 'ringing' || status === 'in-progress' || status === 'queued';
};
