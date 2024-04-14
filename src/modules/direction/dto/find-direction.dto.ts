import { OffsetPaginationDto } from 'src/shared/dto/offset-pagination.dto';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

export class FindDirectionDto {
  @IsOptional()
  @IsString()
  search?: string;

  @ValidateNested()
  @Type(() => OffsetPaginationDto)
  page?: OffsetPaginationDto;
}
