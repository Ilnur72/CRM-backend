import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { GroupStatus } from 'src/shared/types/enums';

export class CreateGroupDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsUUID()
  group_id?: string;

  @IsNotEmpty()
  @IsUUID()
  direction_id: string;

  @IsNotEmpty()
  @IsString()
  description: string;

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
