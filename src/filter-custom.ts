import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

import { Request, Response } from 'express';

import { globalResponseApi } from './utils/response';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let message = 'Error en el servidor';
    let statusCode = 500;

    if (exception instanceof HttpException) {
      if (exception.getResponse() instanceof Object) {
        let exceptionResponse = exception.getResponse() as Record<string, any>;
        if (Array.isArray(exceptionResponse['message'])) {
          message = exceptionResponse['message'][0];
        } else if (typeof exceptionResponse['message'] === 'string') {
          message = exceptionResponse['message'];
        }
        statusCode = exception.getStatus();
      } else {
        let exceptionResponse = exception.getResponse() as string;
        message = exceptionResponse;
      }
    } else {
      let responseMessage = exception as any;
      message = responseMessage.message;
    }

    /* 
      Response globaly to the client
    */
    globalResponseApi(res, null, message, statusCode , null);
  }
}
