import { HttpStatus} from '@nestjs/common';
/* 
    Response Format 
    {
        success: boolean,
        message: string,
        results: any,
        pagination: {
            currentPage: number,
            totalPages: number,
            totalItems: number,
            itemsPerPage: number
        }
    }
*/

export function globalResponseApi(
  res,
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
   return  res.status(statusCode).json({
        statusCode,
        body: {
          success: true,
          message: message,
          results: data,
          pagination: pagination,
        },
    }
    );
}
