import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { GroupStatus } from 'src/shared/types/enums';

export class CreateGroupDto {
  @IsOptional()
  @IsString()
  teacher_id?: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  group_id?: number;

  @IsNotEmpty()
  @IsUUID()
  direction_id: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  duration: string;

  @IsNotEmpty()
  @IsString()
  lesson_duration: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsEnum(GroupStatus)
  status: GroupStatus;

  @IsOptional()
  @IsBoolean()
  is_deleted?: boolean;

  @IsOptional()
  @IsDate()
  created_at?: Date;
}
