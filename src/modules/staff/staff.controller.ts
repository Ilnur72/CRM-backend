import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { FindStaffDto } from './dto/find-staff.dto';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  async create(@Body() createStaffDto: CreateStaffDto) {
    try {
      const data = await this.staffService.create(createStaffDto);

      return {
        success: true,
        statusCode: 201,
        data,
        message: 'Staff Created Successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(@Query() findStaffDto: FindStaffDto) {
    try {
      const data = await this.staffService.findAll(findStaffDto);
      return {
        success: true,
        statusCode: 200,
        data,
        message: 'Staff Fetched Successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.staffService.findOne(id);
      return {
        success: true,
        statusCode: 200,
        data,
        message: 'Staff Fetched Successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStaffDto: UpdateStaffDto,
  ) {
    try {
      await this.staffService.update(id, updateStaffDto);
      return {
        success: true,
        statusCode: 204,
        message: 'Staff Updated Successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.staffService.remove(id);
      return {
        success: true,
        statusCode: 204,
        message: 'Staff Deleted Successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
