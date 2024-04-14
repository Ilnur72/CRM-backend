import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDate,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateDirectionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  teacher_name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  duration: string;

  @IsOptional()
  @IsDate()
  created_at?: Date;

  @IsOptional()
  @IsBoolean()
  is_deleted?: boolean;
}
