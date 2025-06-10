import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  
  @Catch()
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
  
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = 'Internal server error';
      let errorCode = 500;
  
      if (exception instanceof HttpException) {
        status = exception.getStatus();
        const res = exception.getResponse();
  
        // kalau sudah custom error JSON
        if (typeof res === 'object' && res !== null && 'status' in res) {
          return response.status(status).json(res);
        }
  
        // kalau belum custom
        message = typeof res === 'string' ? res : (res as any).message;
        errorCode = status;
      }
  
      response.status(status).json({
        status: 'error',
        message: Array.isArray(message) ? message[0] : message,
        error: errorCode,
      });
    }
  }