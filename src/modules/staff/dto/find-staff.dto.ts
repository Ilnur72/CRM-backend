import { OffsetPaginationDto } from 'src/shared/dto/offset-pagination.dto';
import { SortOrder, StaffRole } from 'src/shared/types/enums';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';

// ?q=first_name&page[offset]=0&page[limit]=10&sort[by]=first_name&sort[order]=asc
export class SortStaffDto {
  @IsOptional()
  @IsEnum(['created_at', 'first_name'])
  by?: string;

  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder;
}

export class FilterStaffDto {
  @IsOptional()
  is_deleted?: boolean;

  @IsOptional()
  @IsEnum(StaffRole)
  role?: StaffRole;
}

export class FindStaffDto {
  @IsOptional()
  @IsString()
  search?: string;

  @ValidateNested()
  @Type(() => OffsetPaginationDto)
  page?: OffsetPaginationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SortStaffDto)
  sort?: SortStaffDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterStaffDto)
  filters?: FilterStaffDto;
}
