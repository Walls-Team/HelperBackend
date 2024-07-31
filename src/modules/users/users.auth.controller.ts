import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { globalResponseApi } from 'src/utils/response';
import { Response , Request} from 'express';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRefreshDto } from './dto/auth-refresh.dto';
import { AuthService } from './users.auth.service';
import { AuthGuard } from 'src/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Res() res, @Body() authLoginDto: AuthLoginDto) {
    try {
      let response = await this.authService.login(authLoginDto);
      res.cookie('hct', response.tokens.access_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });

      res.cookie('rct', response.tokens.refresh_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });

      res.cookie('scu', response.id, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });

      return globalResponseApi(res, null, '¡Inicio de sesión exitoso!', 200);
    } catch (err) {
      return globalResponseApi(res, null, err.message, 500);
    }
  }

  @Get('/refresh')
  async refresh(
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      let refreshToken = req.cookies.rct ?? null;
      let response = await this.authService.refresh(refreshToken );
      res.cookie('hct', response.tokens.access_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });

      res.cookie('rct', response.tokens.refresh_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });

      res.cookie('scu', response.sub, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });

      return globalResponseApi(res, null, '¡Session Restaurada!', 200);
    } catch (err) {
      return globalResponseApi(res, null, err.message, 500);
    }
  }

  @Get('logout')
  @UseGuards(AuthGuard)
  async logout(@Res({ passthrough: true }) res) {
    res.clearCookie('hct');
    res.clearCookie('rct');
    res.clearCookie('scu');
    return { message: 'Sesión cerrada' };
  }
}
