import { ErrorReporting } from '@google-cloud/error-reporting';
import * as express from 'express';
import { transaction } from 'objection';
import * as twilio from 'twilio';
import config from '../../config';
import Db from '../../db';
import SmsMessage from '../../models/sms-message';
import User from '../../models/user';

// TODO: fix type weirdness
const MessagingResponse = (twilio as any).twiml.MessagingResponse;

// TODO: Handle async in queue and twilio validation middleware
export async function twilioSmsHandler(req: express.Request, res: express.Response) {
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
          to: `sim:${user.twilioSimId}`,
          from: From,
        },
        Body,
      );
      // store record of message in DB
      await SmsMessage.create(
        {
          userId: user.id,
          contactNumber: From,
          direction: 'toUser',
          body: Body,
          twilioPayload,
        },
        txn,
      );
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
