import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsDate,
  IsOptional,
  IsEnum,
  IsNumber,
  IsPhoneNumber,
} from 'class-validator';
import { StudentStatus } from 'src/shared/types/enums';

export class CreateStudentDto {
  @IsString()
  @IsOptional()
  group_id?: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsNumber()
  @IsOptional()
  balance?: number;

  @IsPhoneNumber()
  @IsNotEmpty()
  phone_number: string;

  @IsEnum(StudentStatus)
  @IsNotEmpty()
  status: StudentStatus;

  @IsDate()
  @IsOptional()
  created_at?: Date;

  @IsOptional()
  @IsBoolean()
  deleted_at?: boolean;
}
