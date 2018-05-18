import * as kue from 'kue';
import { enqueueProcessVoicemail } from '../process-voicemail';

const queue = kue.createQueue();

describe('Process Voicemail Job', () => {
  beforeAll(() => {
    queue.testMode.enter();
  });

  beforeEach(async () => {
    queue.testMode.clear();
  });

  it('enqueues a job to process a voicemail', async () => {
    await enqueueProcessVoicemail();

    expect(queue.testMode.jobs.length).toBe(1);
    expect(queue.testMode.jobs[0].data.title).toMatch('Handling processVoicemail at');
    expect(queue.testMode.jobs[0].data.jobId).toBeTruthy();
  });
});
