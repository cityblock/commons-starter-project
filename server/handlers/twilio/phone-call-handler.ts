import { subSeconds } from 'date-fns';
import express from 'express';
import { transaction } from 'objection';
import { SmsMessageDirection } from 'schema';
import twilio from 'twilio';
import config from '../../config';
import { TWILIO_COMPLETE_ENDPOINT } from '../../express';
import { reportError } from '../../helpers/error-helpers';
import { addJobToQueue } from '../../helpers/queue-helpers';
import PhoneCall from '../../models/phone-call';
import User from '../../models/user';

const VOICEMAIL_TIMEOUT = '20';
const MAX_VOICEMAIL_LENGTH = '120';

// TODO: Fix type weirdness
const VoiceResponse = (twilio as any).twiml.VoiceResponse;

export async function twilioIncomingCallHandler(req: express.Request, res: express.Response) {
  const twiml = new VoiceResponse();

  const twilioPayload = req.body;
  const { To } = twilioPayload;

  await transaction(res.locals.existingTxn || PhoneCall.knex(), async txn => {
    try {
      const user = await User.getBy({ fieldName: 'phone', field: To }, txn);

      if (!user) {
        throw new Error('No user with that phone number exists');
      }
      if (!user.twilioSimId) {
        throw new Error(`User ${user.id} does not have Twilio SIM registered`);
      }
      // dial the user's phone
      const dial = twiml.dial({
        action: TWILIO_COMPLETE_ENDPOINT,
        method: 'POST',
        timeout: VOICEMAIL_TIMEOUT,
        ringTone: 'us',
      });

      dial.sim(user.twilioSimId);
    } catch (err) {
      reportError(err, 'Error handling incoming call', twilioPayload);
      res.sendStatus(500);
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  });
}

export async function twilioOutgoingCallHandler(req: express.Request, res: express.Response) {
  const twiml = new VoiceResponse();

  const twilioPayload = req.body;
  const { From, To } = twilioPayload;
  // grab Twilio SIM id without "sim:" prefix
  const twilioSimId = From.substring(4);

  await transaction(res.locals.existingTxn || PhoneCall.knex(), async txn => {
    try {
      const user = await User.getBy({ fieldName: 'twilioSimId', field: twilioSimId }, txn);

      if (!user) {
        throw new Error(`No user associated with SIM ID ${twilioSimId}`);
      }

      // add outbound parameter to complete endpoint as twilio classifies both calls as inbound
      const dial = twiml.dial({
        action: `${TWILIO_COMPLETE_ENDPOINT}?outbound=true`,
        method: 'POST',
        callerId: user.phone,
        ringTone: 'us',
      });

      dial.number(To);
    } catch (err) {
      reportError(err, 'Error handling outgoing call', twilioPayload);
      res.sendStatus(500);
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  });
}

export async function twilioCompleteCallHandler(req: express.Request, res: express.Response) {
  const twiml = new VoiceResponse();

  const twilioPayload = req.body;
  const isInbound = !req.query.outbound;
  const { To, From, DialCallStatus, DialCallDuration, CallSid, RecordingUrl } = twilioPayload;

  // if has to do with completed voicemail, do nothing as job processes it
  if (RecordingUrl) {
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    return res.end(twiml.toString());
  }

  await transaction(res.locals.existingTxn || PhoneCall.knex(), async txn => {
    try {
      const user = isInbound
        ? await User.getBy({ fieldName: 'phone', field: To }, txn)
        : await User.getBy({ fieldName: 'twilioSimId', field: From.substring(4) }, txn);

      if (!user) {
        throw new Error(
          `There is not user with the Twilio Phone Number: ${To} or Twilio SIM: ${From}`,
        );
      }

      // if patient called us and no one answered, start recording voicemail
      if (isInbound && DialCallStatus === 'no-answer') {
        recordVoicemail(twiml);
      }

      const now = new Date();
      const duration = DialCallDuration ? Number(DialCallDuration) : 0;

      const phoneCall = await PhoneCall.create(
        {
          userId: user.id,
          contactNumber: isInbound ? From : To,
          direction: isInbound
            ? ('toUser' as SmsMessageDirection)
            : ('fromUser' as SmsMessageDirection),
          callStatus: DialCallStatus,
          duration,
          twilioPayload,
          callSid: CallSid,
          twilioCreatedAt: subSeconds(now, duration).toISOString(), // created duration seconds ago
          twilioUpdatedAt: now.toISOString(), // ended now
        },
        txn,
        true,
      );

      // if outbound call not associated with patient, ensure not old number
      if (!isInbound && !phoneCall.patientId) {
        addJobToQueue('checkPreviousContact', {
          userId: user.id,
          contactNumber: phoneCall.contactNumber,
        });
      }
    } catch (err) {
      reportError(err, 'Error processing completed phone call', twilioPayload);
      res.sendStatus(500);
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    return res.end(twiml.toString());
  });
}

const recordVoicemail = (twiml: any) => {
  twiml.play(
    {
      loop: 1,
    },
    config.VOICEMAIL_MESSAGE_LINK,
  );

  twiml.record({
    maxLength: MAX_VOICEMAIL_LENGTH,
    playBeep: true,
  });
};
