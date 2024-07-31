import { IsString, IsArray, IsNumber, IsOptional } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsOptional()
  businessName: string;

  @IsArray()
  areas: string[];

  @IsArray()
  @IsOptional()
  jobs: string[];

  @IsArray()
  @IsOptional()
  specials: string[];

  @IsNumber()
  @IsOptional()
  latitude: number;

  @IsNumber()
  @IsOptional()
  longitude: number;

  @IsNumber()
  @IsOptional()
  altitude: number;

  @IsNumber()
  @IsOptional()
  precision: number;

  @IsNumber()
  @IsOptional()
  altitudePrecision: number;

  @IsNumber()
  @IsOptional()
  header: number;

  @IsNumber()
  @IsOptional()
  speed: number;
}
