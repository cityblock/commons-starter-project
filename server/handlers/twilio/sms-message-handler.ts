import * as express from 'express';
import { transaction } from 'objection';
import { SmsMessageDirection } from 'schema';
import * as twilio from 'twilio';
import { reportError } from '../../helpers/error-helpers';
import { addJobToQueue } from '../../helpers/queue-helpers';
import SmsMessage from '../../models/sms-message';
import User from '../../models/user';
import pubsub from '../../subscriptions';

export const SIM_PREFIX = 'sim:';

// TODO: fix type weirdness
const MessagingResponse = (twilio as any).twiml.MessagingResponse;

// TODO: Handle async in queue and twilio validation middleware
export async function twilioIncomingSmsHandler(req: express.Request, res: express.Response) {
  const twiml = new MessagingResponse();

  const twilioPayload = req.body;
  const { Body, From, To, MessageSid } = twilioPayload;

  await transaction(res.locals.existingTxn || SmsMessage.knex(), async txn => {
    // figure out which Commons user is recipient of message
    const user = await User.getBy({ fieldName: 'phone', field: To }, txn);

    if (!user) {
      // TODO: handle (very unlikely) case when no user with that twilio number found'
      twiml.message(
        "We're sorry, we don't have a user with that phone number. Please call us for help",
      );
      res.writeHead(200, { 'Content-Type': 'text/xml' });
      return res.end(twiml.toString());
    }

    try {
      if (!user.twilioSimId) {
        throw new Error(`User ${user.id} does not have Twilio SIM registered`);
      }
      // relay the SMS message to the user
      twiml.message(
        {
          to: `${SIM_PREFIX}${user.twilioSimId}`,
          from: From,
        },
        Body,
      );
      // store record of message in DB
      const smsMessage = await SmsMessage.create(
        {
          userId: user.id,
          contactNumber: From,
          direction: 'toUser' as SmsMessageDirection,
          body: Body,
          twilioPayload,
          messageSid: MessageSid,
        },
        txn,
      );
      // publish notification that message created
      publishMessage(smsMessage);
    } catch (err) {
      reportError(err, 'SMS failed to record', twilioPayload);
    }

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  });
}

export async function twilioOutgoingSmsHandler(req: express.Request, res: express.Response) {
  const twiml = new MessagingResponse();

  const twilioPayload = req.body;
  const { Body, From, To, MessageSid } = twilioPayload;

  await transaction(res.locals.existingTxn || SmsMessage.knex(), async txn => {
    // figure out which Commons user is sending message
    const twilioSimId = From.split(SIM_PREFIX)[1]; // remove sim: from beginnign of ID
    const user = await User.getBy({ fieldName: 'twilioSimId', field: twilioSimId }, txn);
    if (!user) {
      // TODO: handle (very unlikely) case when no user with that SIM ID found
      res.writeHead(200, { 'Content-Type': 'text/xml' });
      return res.end(twiml.toString());
    }

    try {
      if (!user.phone) {
        throw new Error('User does not have phone number registered');
      }
      // relay the SMS message to the other party
      twiml.message(
        {
          to: To,
          from: user.phone,
        },
        Body,
      );
      // store record of message in DB
      const smsMessage = await SmsMessage.create(
        {
          userId: user.id,
          contactNumber: To,
          direction: 'fromUser' as SmsMessageDirection,
          body: Body,
          twilioPayload,
          messageSid: MessageSid,
        },
        txn,
        true,
      );
      // publish notification that message created
      publishMessage(smsMessage);

      // if message not associated with patient, background job to ensure not old number
      if (!smsMessage.patientId) {
        addJobToQueue('checkPreviousContact', {
          userId: user.id,
          contactNumber: smsMessage.contactNumber,
        });
        // else if patient did not consent to be texted, background job to SMS user
      } else if (smsMessage.patient && !smsMessage.patient.patientInfo.canReceiveTexts) {
        addJobToQueue('notifyNoConsent', {
          userId: user.id,
          patientId: smsMessage.patientId,
          type: 'smsMessage',
        });
      }
    } catch (err) {
      reportError(err, 'SMS failed to record', twilioPayload);
    }

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  });
}

const publishMessage = (smsMessage: SmsMessage) => {
  pubsub.publish('smsMessageCreated', {
    smsMessageCreated: { node: smsMessage },
    userId: smsMessage.userId,
    patientId: smsMessage.patientId,
  });
};
