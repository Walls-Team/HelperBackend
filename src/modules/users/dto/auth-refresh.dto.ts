import { IsString, IsNotEmpty } from 'class-validator';

export class AuthRefreshDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
