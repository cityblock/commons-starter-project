import * as express from 'express';
import config from '../../config';

export async function checkRabbitHandler(req: express.Request, res: express.Response) {
  const { protocol, endpoint, port, user, pass, url } = config.rabbot[config.NODE_ENV].api;

  try {
    /**
     * This is a little ugly, but it pings the RabbitMQ management api for queue stats and returns
     * an error if:
     *   A) It cannot be reached
     *   or
     *   B) Any queue has more than 300 messages ready
     */
    const response = await fetch(`${protocol}://${user}:${pass}@${url}:${port}${endpoint}`);
    const body = await response.json();
    const queueLengths = body.filter((queue: any) =>
      queue.name === 'low-priority' || queue.name === 'high-priority',
    ).map((queue: any) => queue.messages_ready);

    if (queueLengths.some((length: any) => length > 300)) {
      console.error('RabbitMQ check failed!');
      console.error('Queue length is too long.');
      res.status(500).send('Queue length is too long.');
    } else {
      res.sendStatus(200);
    }
  } catch (err) {
    console.error('RabbitMQ check failed!');
    console.error(err.message);
    console.error('Full error object:');
    console.error(err);
    res.status(500).send(err.message);
  }
}
