import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class QueryHelperDto {
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  minDistance: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  maxDistance: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  distanceRange: number;

  @IsOptional()
  @IsArray()
  areas: string[];

  @IsOptional()
  @IsArray()
  jobs: string[];

  @IsOptional()
  @IsArray()
  specials: string[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title : string;
}
