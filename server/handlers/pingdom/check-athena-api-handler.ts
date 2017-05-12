import * as express from 'express';
import AthenaApi from '../../apis/athena';

export async function checkAthenaApiHandler(req: express.Request, res: express.Response) {
  try {
    const athenaApi = await AthenaApi.get();
    await athenaApi.getPatient(1);
    res.sendStatus(200);
  } catch (err) {
    console.error('Athena API check failed!');
    console.error(err.message);
    console.error('Full error object:');
    console.error(err);
    res.status(500).send(err.message);
  }
}
