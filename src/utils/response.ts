import { HttpStatus } from '@nestjs/common';


/**
 * Represents the response format for API responses.
 */

const ErrorStatus = [400, 401, 403, 404, 405, 500, 501, 502, 503]

/**
 * Generates a global API response.
 * @param res - The response object.
 * @param data - The data to be included in the response.
 * @param message - The response message (default: 'Response Success').
 * @param statusCode - The HTTP status code (default: HttpStatus.OK).
 * @param pagination - The pagination information (default: empty object).
 * @returns The API response.
 */
export function globalResponseApi(
  res: any,
  data: any,
  message: string = 'Response Success',
  statusCode: HttpStatus = HttpStatus.OK,
  pagination: Object = {
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 0,
  },
): any {
  if ( ErrorStatus.includes(statusCode) ) {
    return res.status(statusCode).json({
      statusCode,
      error: message,
      results: data,
      pagination: pagination,
    });
  } else {
    return res.status(statusCode).json({
      statusCode,
      message: message,
      results: data,
      pagination: pagination,
    });
  }
}
