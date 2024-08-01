import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class CreateHelperDto {
  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsOptional()
  profileComplete?: number;

  @IsArray()
  @IsOptional()
  areas?: string[];

  @IsArray()
  @IsOptional()
  jobs?: string[];

  @IsArray()
  @IsOptional()
  specials?: string[];

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  // @IsArray()
  // @IsOptional()
  // localtion: [number, number];

  // @IsNumber()
  // @IsOptional()
  // altitude?: number;

  // @IsNumber()
  // @IsOptional()
  // precision?: number;

  // @IsNumber()
  // @IsOptional()
  // altitudePrecision?: number;

  // @IsNumber()
  // @IsOptional()
  // header?: number;

  // @IsNumber()
  // @IsOptional()
  // speed?: number;
}
