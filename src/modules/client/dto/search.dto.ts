import {
  IsNumber,
  IsArray,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class QueryClientDto {
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
}
