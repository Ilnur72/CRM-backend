import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { DirectionService } from './direction.service';
import { CreateDirectionDto } from './dto/create-direction.dto';
import { UpdateDirectionDto } from './dto/update-direction.dto';
import { FindDirectionDto } from './dto/find-direction.dto';

@Controller('Direction')
export class DirectionController {
  constructor(private readonly directionService: DirectionService) {}

  @Post()
  async create(@Body() createDirectionDto: CreateDirectionDto) {
    try {
      const data = await this.directionService.create(createDirectionDto);

      return {
        success: true,
        statusCode: 201,
        data,
        message: 'Direction Created Successfully',
      };
    } catch (error) {
      return error.response;
    }
  }

  @Get()
  async findAll(@Query() findDirectionDto: FindDirectionDto) {
    try {
      const data = await this.directionService.findAll(findDirectionDto);
      return {
        success: true,
        statusCode: 200,
        data,
        message: 'Direction Fetched Successfully',
      };
    } catch (error) {
      return error.response;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.directionService.findOne(id);
      return {
        success: true,
        statusCode: 200,
        data,
        message: 'Direction Fetched Successfully',
      };
    } catch (error) {
      return error.response;
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDirectionDto: UpdateDirectionDto,
  ) {
    try {
      await this.directionService.update(id, updateDirectionDto);
      return {
        success: true,
        statusCode: 204,
        message: 'Direction Updated Successfully',
      };
    } catch (error) {
      return error.response;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.directionService.remove(id);
      return {
        success: true,
        statusCode: 204,
        message: 'Direction Deleted Successfully',
      };
    } catch (error) {
      return error.response;
    }
  }
}
