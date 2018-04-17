import { ErrorReporting } from '@google-cloud/error-reporting';
import * as express from 'express';
import { transaction } from 'objection';
import * as twilio from 'twilio';
import config from '../../config';
import Db from '../../db';
import SmsMessage from '../../models/sms-message';
import User from '../../models/user';
import pubsub from '../../subscriptions';

const SIM_PREFIX = 'sim:';

// TODO: fix type weirdness
const MessagingResponse = (twilio as any).twiml.MessagingResponse;

// TODO: Handle async in queue and twilio validation middleware
export async function twilioIncomingSmsHandler(req: express.Request, res: express.Response) {
  const twiml = new MessagingResponse();
  await Db.get();
  const twilioPayload = req.body;
  const { Body, From, To } = twilioPayload;

  await transaction(res.locals.existingTxn || SmsMessage.knex(), async txn => {
    // figure out which Commons user is recipient of message
    const user = await User.getBy({ fieldName: 'phone', field: To }, txn);

    if (!user) {
      // TODO: handle (very unlikely) case when no user with that twilio number found
      res.writeHead(200, { 'Content-Type': 'text/xml' });
      return res.end(twiml.toString());
    }

    try {
      if (!user.twilioSimId) {
        throw new Error('User does not have Twilio SIM registered');
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
          direction: 'toUser',
          body: Body,
          twilioPayload,
        },
        txn,
      );
      // publish notification that message created
      publishMessage(smsMessage);
    } catch (err) {
      reportError(err, twilioPayload);
    }

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  });
}

export async function twilioOutgoingSmsHandler(req: express.Request, res: express.Response) {
  const twiml = new MessagingResponse();
  await Db.get();
  const twilioPayload = req.body;
  const { Body, From, To } = twilioPayload;

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
          direction: 'fromUser',
          body: Body,
          twilioPayload,
        },
        txn,
      );
      // publish notification that message created
      publishMessage(smsMessage);
    } catch (err) {
      reportError(err, twilioPayload);
    }

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  });
}

const reportError = (error: Error, payload: object) => {
  const errorReporting = new ErrorReporting({ credentials: JSON.parse(String(config.GCP_CREDS)) });

  // Ensure stackdriver is working
  errorReporting.report(
    `SMS failed to record. Error: ${error}, payload: ${JSON.stringify(payload)}`,
  );
};

const publishMessage = (smsMessage: SmsMessage) => {
  pubsub.publish('smsMessageCreated', {
    smsMessageCreated: { node: smsMessage },
    userId: smsMessage.userId,
    patientId: smsMessage.patientId,
  });
};
