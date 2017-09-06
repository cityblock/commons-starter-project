import * as dotenv from 'dotenv';
dotenv.config();

/* tslint:disable no-var-requires */
const Logger = require('le_node');
/* tslint:enable no-var-requires */

export default class CaptureOutput {
  private releaseStdout: () => any;
  private releaseStderr: () => any;
  private logger: any;
  private tag: string | undefined;

  constructor(tag?: string) {
    this.logger = new Logger({
      token: process.env.LOGENTRIES_TOKEN,
    });
    this.tag = tag ? `[${tag}] - ` : '';
  }

  capture() {
    this.releaseStdout = this.captureStdout();
    this.releaseStderr = this.captureStderr();
  }

  release() {
    this.releaseStdout();
    this.releaseStderr();
  }

  private captureStream(stream: NodeJS.Socket, callback: (str: string) => any) {
    return this.hookStream(stream, (string: string) => {
      callback(`${this.tag}${string}`);
    });
  }

  private captureStdout() {
    return this.captureStream(process.stdout, this.logger.info.bind(this.logger));
  }

  private captureStderr() {
    return this.captureStream(process.stderr, this.logger.err.bind(this.logger));
  }

  // From https://gist.github.com/pguillory/729616#gistcomment-1946644
  private hookStream(stream: NodeJS.Socket, callback: any) {
    const old_write = stream.write;

    stream.write = (write =>
      (s: string): boolean => {
        write.apply(stream, [s]);
        callback(s);
        return true;
      })(stream.write);

    return () => (stream.write = old_write);
  }
}
