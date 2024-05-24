import { Controller, Get, Ip, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Ip() ip: string, @Req() req: Request): any {
    const xForwardedFor = req.headers['x-forwarded-for'];
    const xRealIp = req.headers['x-real-ip'];

    return { ip: ip, xForwardedFor: xForwardedFor, xRealIp: xRealIp };
  }
}
