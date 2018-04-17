import { ErrorReporting } from '@google-cloud/error-reporting';
import * as express from 'express';
import { transaction } from 'objection';
import * as twilio from 'twilio';
import config from '../../config';
import Db from '../../db';
import { TWILIO_COMPLETE_ENDPOINT } from '../../express';
import PhoneCall from '../../models/phone-call';
import User from '../../models/user';

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
  const { To, From, DialCallStatus, DialCallDuration } = twilioPayload;

  await transaction(res.locals.existingTxn || PhoneCall.knex(), async txn => {
    const user = await User.getBy({ fieldName: 'phone', field: To }, txn);

    try {
      if (!user) {
        throw new Error(`There is not user with the Twilio Phone Number: ${To}`);
      }

      await PhoneCall.create(
        {
          userId: user.id,
          contactNumber: From,
          direction: 'toUser',
          callStatus: DialCallStatus,
          duration: DialCallDuration ? Number(DialCallDuration) : 0,
          twilioPayload,
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

const reportError = (error: Error, payload: object) => {
  const errorReporting = new ErrorReporting({ credentials: JSON.parse(String(config.GCP_CREDS)) });

  // Ensure stackdriver is working
  errorReporting.report(
    `Phone call failed to record. Error: ${error}, payload: ${JSON.stringify(payload)}`,
  );
};
