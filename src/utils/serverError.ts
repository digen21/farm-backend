import { HttpStatus } from '@nestjs/common';

interface ServerErrorArgs {
  message: string;
  status?: number;
  success?: boolean;
}

export default class ServerError extends Error {
  status: number;
  success: boolean;
  constructor({
    message,
    status = HttpStatus.INTERNAL_SERVER_ERROR,
    success = true,
  }: ServerErrorArgs) {
    super(message);
    this.status = status;
    this.success = success;
    Error.captureStackTrace(this, this.constructor);
  }
}
