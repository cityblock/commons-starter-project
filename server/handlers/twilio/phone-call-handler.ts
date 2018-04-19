import { ErrorReporting } from '@google-cloud/error-reporting';
import * as express from 'express';
import { transaction } from 'objection';
import * as twilio from 'twilio';
import config from '../../config';
import Db from '../../db';
import { TWILIO_COMPLETE_ENDPOINT, TWILIO_VOICEMAIL_ENDPOINT } from '../../express';
import PhoneCall from '../../models/phone-call';
import User from '../../models/user';

const VOICEMAIL_TIMEOUT = '20';
const MAX_VOICEMAIL_LENGTH = '20';

// TODO: Fix type weirdness
const VoiceResponse = (twilio as any).twiml.VoiceResponse;

export async function twilioIncomingCallHandler(req: express.Request, res: express.Response) {
  const twiml = new VoiceResponse();
  await Db.get();
  const twilioPayload = req.body;
  const { From, To } = twilioPayload;

  await transaction(res.locals.existingTxn || PhoneCall.knex(), async txn => {
    const user = await User.getBy({ fieldName: 'phone', field: To }, txn);

    if (!user) {
      // TODO: handle (very unlikely) case when no user with that twilio number found
      twiml.say(
        "We're sorry, we don't have a user with that phone number. Please call us for help",
      );
      res.writeHead(200, { 'Content-Type': 'text/xml' });
      return res.end(twiml.toString());
    }

    try {
      if (!user.twilioSimId) {
        throw new Error(`User ${user.id} does not have Twilio SIM registered`);
      }
      // dial the user's phone
      const dial = twiml.dial({
        action: TWILIO_COMPLETE_ENDPOINT,
        method: 'POST',
        from: From,
        timeout: VOICEMAIL_TIMEOUT,
      });

      dial.sim(user.twilioSimId);
    } catch (err) {
      reportError(err, twilioPayload);
    }

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  });
}

export async function twilioCompleteCallHandler(req: express.Request, res: express.Response) {
  const twiml = new VoiceResponse();
  await Db.get();
  const twilioPayload = req.body;
  const { To, From, DialCallStatus, DialCallDuration, Direction, CallSid } = twilioPayload;

  await transaction(res.locals.existingTxn || PhoneCall.knex(), async txn => {
    const user = await User.getBy({ fieldName: 'phone', field: To }, txn);

    try {
      if (!user) {
        throw new Error(`There is not user with the Twilio Phone Number: ${To}`);
      }

      // if patient called us and no one answered, start recording voicemail
      if (Direction === 'inbound' && DialCallStatus === 'no-answer') {
        recordVoicemail(twiml);
      }

      await PhoneCall.create(
        {
          userId: user.id,
          contactNumber: Direction === 'inbound' ? From : To,
          direction: Direction === 'inbound' ? 'toUser' : 'fromUser',
          callStatus: DialCallStatus,
          duration: DialCallDuration ? Number(DialCallDuration) : 0,
          twilioPayload,
          callSid: CallSid,
        },
        txn,
      );
    } catch (err) {
      reportError(err, twilioPayload);
    }
  });

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  return res.end(twiml.toString());
}

export async function twilioVoicemailHandler(req: express.Request, res: express.Response) {
  const twiml = new VoiceResponse();
  const voicemailPayload = req.body;
  const { CallSid, RecordingUrl } = voicemailPayload;

  await transaction(res.locals.existingTxn || PhoneCall.knex(), async txn => {
    try {
      // find the phone call by the callSid provided by Twilio and update voicemail URL
      const phoneCall = await PhoneCall.getByCallSid(CallSid, txn);

      if (phoneCall) {
        await PhoneCall.update(phoneCall.id, { voicemailUrl: RecordingUrl, voicemailPayload }, txn);
      }
    } catch (err) {
      reportError(err, voicemailPayload);
    }
  });

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  return res.end(twiml.toString());
}

const recordVoicemail = (twiml: any) => {
  twiml.say("We're sorry we missed your call. Please leave a message at the beep.");

  twiml.record({
    action: TWILIO_VOICEMAIL_ENDPOINT,
    method: 'POST',
    maxLength: MAX_VOICEMAIL_LENGTH,
    playBeep: true,
  });
};

const reportError = (error: Error, payload: object) => {
  const errorReporting = new ErrorReporting({ credentials: JSON.parse(String(config.GCP_CREDS)) });

  // Ensure stackdriver is working
  errorReporting.report(
    `Phone call failed to record. Error: ${error}, payload: ${JSON.stringify(payload)}`,
  );
};
