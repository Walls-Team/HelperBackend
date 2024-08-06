import {
  IsString,
  IsBoolean,
  IsArray,
  IsOptional,
  IsNotEmpty,
  IsMongoId,
} from 'class-validator';

export class ClientNotificationDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsMongoId()
  customer: string;

  @IsNotEmpty()
  @IsMongoId()
  helper: string;

  @IsNotEmpty()
  @IsMongoId()
  helperNotification: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  areas?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  jobs?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  specials?: string[];

  @IsBoolean()
  @IsOptional()
  isRead: boolean;
}
