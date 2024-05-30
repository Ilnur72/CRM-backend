import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsDurationValid } from 'src/shared/decorators/is-duration-valid.decorator';
import { GroupStatus, LessonDays } from 'src/shared/types/enums';

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

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsDurationValid()
  duration: string;

  @IsNotEmpty()
  @IsString()
  lesson_duration: string;

  @IsNotEmpty()
  @IsEnum(LessonDays)
  lesson_days: LessonDays;

  @IsString()
  @IsNotEmpty()
  lesson_time: '10:00';

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

  @IsOptional()
  @IsString()
  ends_at?: string;
}
