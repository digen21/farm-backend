import { Controller, Get, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/health')
  health() {
    return {
      status: 'UP',
      code: HttpStatus.OK,
    };
  }
}
