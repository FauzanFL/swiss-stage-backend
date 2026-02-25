import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('GlobalExceptionFilter');

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const request = ctx.getRequest<Request>();
    const url = httpAdapter.getRequestUrl(request);

    const message =
      exception instanceof Error ? exception.message : 'Internal Server Error';
    const stack = exception instanceof Error ? exception.stack : null;

    this.logger.error(`${httpStatus} ${url} - ${message}`, stack);

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      message: httpStatus >= 500 ? 'Internal server error' : message,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
