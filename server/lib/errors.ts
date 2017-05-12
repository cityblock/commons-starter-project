export class AthenaResponseError extends Error {
  endpoint: string;
  status: number;

  constructor(message: string, endpoint: string, status: number) {
    super(message);
    this.endpoint = endpoint;
    this.status = status;
  }
}
