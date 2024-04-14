import { OffsetPaginationDto } from 'src/shared/dto/offset-pagination.dto';
import { SortOrder, GroupStatus } from 'src/shared/types/enums';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

// ?q=first_name&page[offset]=0&page[limit]=10&sort[by]=first_name&sort[order]=asc
export class SortGroupDto {
  @IsOptional()
  @IsEnum(['created_at', 'title'])
  by?: string;

  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder;
}

export class FilterGroupDto {
  @IsOptional()
  @IsBoolean()
  is_deleted?: boolean;

  @IsOptional()
  @IsEnum(GroupStatus)
  status?: GroupStatus;
}

export class FindGroupDto {
  @IsOptional()
  @IsString()
  search?: string;

  @ValidateNested()
  @Type(() => OffsetPaginationDto)
  page?: OffsetPaginationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SortGroupDto)
  sort?: SortGroupDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterGroupDto)
  filters?: FilterGroupDto;
}
