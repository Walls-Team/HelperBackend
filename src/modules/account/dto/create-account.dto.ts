import { IsNotEmpty, IsString , Min , IsEmpty , IsOptional} from 'class-validator';
export class CreateAccountDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  user: string;

  @IsString()
  @IsOptional()
  customer?: string;

  @IsString()
  @IsOptional()
  helper?: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  city: string;
}
