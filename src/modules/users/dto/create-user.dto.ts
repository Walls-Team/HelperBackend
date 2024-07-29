import { IsEmail, IsNotEmpty, IsNumber, IsString, Max } from 'class-validator';
export class CreateUserDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;


  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}


export class sendEmailVerifiedDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class verifiedEmaillDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  code: string;
}
