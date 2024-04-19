import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsDate,
  IsOptional,
  IsEnum,
  IsPhoneNumber,
} from 'class-validator';
import { StaffRole } from 'src/shared/types/enums';

export class CreateStaffDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phone_number: string;

  @IsEnum(StaffRole)
  @IsNotEmpty()
  role: StaffRole;

  @IsDate()
  @IsOptional()
  created_at?: Date;

  @IsOptional()
  @IsBoolean()
  is_deleted?: boolean;
}
