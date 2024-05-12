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
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FindStudentDto } from './dto/find-student.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    try {
      const data = await this.studentService.create(createStudentDto);

      return {
        success: true,
        statusCode: 201,
        data,
        message: 'Student Created Successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(@Query() findStudentDto: FindStudentDto) {
    try {
      const data = await this.studentService.findAll(findStudentDto);
      return {
        success: true,
        statusCode: 200,
        data,
        message: 'Student Fetched Successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.studentService.findOne(id);
      return {
        success: true,
        statusCode: 200,
        data,
        message: 'Student Fetched Successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    try {
      await this.studentService.update(id, updateStudentDto);
      return {
        success: true,
        statusCode: 204,
        message: 'Student Updated Successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.studentService.remove(id);
      return {
        success: true,
        statusCode: 204,
        message: 'Student Deleted Successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
