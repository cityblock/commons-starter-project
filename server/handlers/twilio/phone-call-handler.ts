import { ErrorReporting } from '@google-cloud/error-reporting';
import * as express from 'express';
import { transaction } from 'objection';
import * as twilio from 'twilio';
import config from '../../config';
import Db from '../../db';
import { TWILIO_COMPLETE_ENDPOINT } from '../../express';
import PhoneCall from '../../models/phone-call';
import User from '../../models/user';

const VOICEMAIL_TIMEOUT = '20';
const MAX_VOICEMAIL_LENGTH = '120';
export const CITYBLOCK_VOICEMAIL = '+16469417791';
export const VOICEMAIL_DATE_FORMAT = 'ddd, MMM D, YYYY h:mma';

// TODO: Fix type weirdness
const VoiceResponse = (twilio as any).twiml.VoiceResponse;

export async function twilioIncomingCallHandler(req: express.Request, res: express.Response) {
  const twiml = new VoiceResponse();
  await Db.get();
  const twilioPayload = req.body;
  const { To } = twilioPayload;

  await transaction(res.locals.existingTxn || PhoneCall.knex(), async txn => {
    const user = await User.getBy({ fieldName: 'phone', field: To }, txn);

    if (!user) {
      twiml.say(
        "We're sorry, we don't have a user with that phone number. Please call us for help",
      );
      reportError(`no associated user with phone number: ${To}`, twilioPayload);

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

export async function twilioOutgoingCallHandler(req: express.Request, res: express.Response) {
  const twiml = new VoiceResponse();
  await Db.get();
  const twilioPayload = req.body;
  const { From, To } = twilioPayload;
  // grab Twilio SIM id without "sim:" prefix
  const twilioSimId = From.substring(4);

  await transaction(res.locals.existingTxn || PhoneCall.knex(), async txn => {
    const user = await User.getBy({ fieldName: 'twilioSimId', field: twilioSimId }, txn);

    if (!user) {
      reportError(`no associated user with twilioSimId: ${twilioSimId}`, twilioPayload);

      res.writeHead(200, { 'Content-Type': 'text/xml' });
      return res.end(twiml.toString());
    }

    try {
      // add outbound parameter to complete endpoint as twilio classifies both calls as inbound
      const dial = twiml.dial({
        action: `${TWILIO_COMPLETE_ENDPOINT}?outbound=true`,
        method: 'POST',
        callerId: user.phone,
      });

      dial.number(To);
    } catch (err) {
      reportError(err, twilioPayload);
    }
  });

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
}

export async function twilioCompleteCallHandler(req: express.Request, res: express.Response) {
  const twiml = new VoiceResponse();
  await Db.get();
  const twilioPayload = req.body;
  const isInbound = !req.query.outbound;
  const { To, From, DialCallStatus, DialCallDuration, CallSid } = twilioPayload;

  await transaction(res.locals.existingTxn || PhoneCall.knex(), async txn => {
    const user = isInbound
      ? await User.getBy({ fieldName: 'phone', field: To }, txn)
      : await User.getBy({ fieldName: 'twilioSimId', field: From.substring(4) }, txn);

    try {
      if (!user) {
        throw new Error(`There is not user with the Twilio Phone Number: ${To}`);
      }

      // if patient called us and no one answered, start recording voicemail
      if (isInbound && DialCallStatus === 'no-answer') {
        recordVoicemail(twiml);
      }

      await PhoneCall.create(
        {
          userId: user.id,
          contactNumber: isInbound ? From : To,
          direction: isInbound ? 'toUser' : 'fromUser',
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

const recordVoicemail = (twiml: any) => {
  twiml.say(
    { voice: 'alice' },
    "We're sorry we missed your call. Please leave a message at the beep.",
  );

  twiml.record({
    maxLength: MAX_VOICEMAIL_LENGTH,
    playBeep: true,
  });
};

const reportError = (error: Error | string, payload: object | null) => {
  const errorReporting = new ErrorReporting({ credentials: JSON.parse(String(config.GCP_CREDS)) });

  // Ensure stackdriver is working
  errorReporting.report(
    `Phone call failed to record. Error: ${error}, payload: ${JSON.stringify(payload)}`,
  );
};
