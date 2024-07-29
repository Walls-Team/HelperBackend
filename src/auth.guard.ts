// guards
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      let cookies = request.cookies;

      if(cookies && cookies.hct){
          const payload = this.jwtService.verify(cookies.hct);
          if(!payload){
            return false;
          } 
          return true
      }

      // check header
      const token = request.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('No token provided');
      const payload = this.jwtService.verify(token);
      if (!payload) throw new Error('Invalid token');
      request.user = payload;
      return true;
    } catch (error) {
      return false;
    }
  }
}
