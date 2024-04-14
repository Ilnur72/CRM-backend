import { OffsetPaginationDto } from 'src/shared/dto/offset-pagination.dto';
import { SortOrder, StudentStatus } from 'src/shared/types/enums';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

// ?q=first_name&page[offset]=0&page[limit]=10&sort[by]=first_name&sort[order]=asc
export class SortStudentDto {
  @IsOptional()
  @IsEnum(['created_at', 'first_name'])
  by?: string;

  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder;
}

export class FilterStudentDto {
  @IsOptional()
  @IsBoolean()
  is_deleted?: boolean;

  @IsOptional()
  @IsEnum(StudentStatus)
  status?: StudentStatus;
}

export class FindStudentDto {
  @IsOptional()
  @IsString()
  search?: string;

  @ValidateNested()
  @Type(() => OffsetPaginationDto)
  page?: OffsetPaginationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SortStudentDto)
  sort?: SortStudentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterStudentDto)
  filters?: FilterStudentDto;
}
