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
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { FindGroupDto } from './dto/find-group.dto';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  async create(@Body() createGroupDto: CreateGroupDto) {
    try {
      const data = await this.groupService.create(createGroupDto);

      return {
        success: true,
        statusCode: 201,
        data,
        message: 'Group Created Successfully',
      };
    } catch (error) {
      return error.response;
    }
  }

  @Get()
  async findAll(@Query() findGroupDto: FindGroupDto) {
    try {
      const data = await this.groupService.findAll(findGroupDto);
      return {
        success: true,
        statusCode: 200,
        data,
        message: 'Group Fetched Successfully',
      };
    } catch (error) {
      return error.response;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.groupService.findOne(id);
      return {
        success: true,
        statusCode: 200,
        data,
        message: 'Group Fetched Successfully',
      };
    } catch (error) {
      return error.response;
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    try {
      await this.groupService.update(id, updateGroupDto);
      return {
        success: true,
        statusCode: 204,
        message: 'Group Updated Successfully',
      };
    } catch (error) {
      return error.response;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.groupService.remove(id);
      return {
        success: true,
        statusCode: 204,
        message: 'Group Deleted Successfully',
      };
    } catch (error) {
      return error.response;
    }
  }
}
