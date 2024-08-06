import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class HelperNotificationDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  message: string;


  @IsString()
  @IsNotEmpty()
  owner: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  areas?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  jobs?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specials?: string[];

  @IsOptional()
  @IsNumber()
  radio: number;

  @IsOptional()
  @IsNumber()
  clientsNotified: number;

  @IsOptional()
  @IsNumber()
  clientsRead: number;
}
