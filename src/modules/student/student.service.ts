import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { FindStudentDto } from './dto/find-student.dto';
import { SortOrder } from 'src/shared/types/enums';
import { GroupService } from '../group/group.service';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    private readonly groupService: GroupService,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    try {
      await this.groupService.findOne(createStudentDto.group_id);

      const newStudent = this.studentRepository.create(createStudentDto);
      return await this.studentRepository.save(newStudent);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create student');
    }
  }

  async findAll({
    page = { limit: 2, offset: 1 },
    search,
    filters,
    sort = { by: 'created_at', order: SortOrder.DESC },
  }: FindStudentDto): Promise<any> {
    try {
      const queryBuilder = this.studentRepository
        .createQueryBuilder('student')
        .leftJoinAndSelect('student.group', 'group');

      if (search) {
        queryBuilder.where(
          'student.first_name ILIKE :search OR student.last_name ILIKE :search',
          { search: `%${search}%` },
        );
      }
      if (sort.by && sort.order) {
        queryBuilder.orderBy(`student.${sort.by}`, sort.order);
      }
      if (filters) {
        queryBuilder.andWhere(filters);
      }
      const total = await queryBuilder.getCount();
      const data = await queryBuilder
        .skip((page.offset - 1) * page.limit)
        .take(page.limit)
        .getMany();

      return { total, data, limit: page.limit, offset: page.offset };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch student list');
    }
  }

  async findOne(id: string): Promise<Student> {
    try {
      const student = await this.studentRepository
        .createQueryBuilder('student')
        .leftJoinAndSelect('student.group', 'group')
        .where('student.id = :id', { id })
        .getOne();
      if (!student)
        throw new NotFoundException(`Student with ID ${id} not found`);
      return student;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch student details');
    }
  }

  async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    try {
      const existing = await this.studentRepository.findOne({ where: { id } });
      if (!existing)
        throw new NotFoundException(`Student with ID ${id} not found`);
      const updatedStudent = this.studentRepository.merge(
        existing,
        updateStudentDto,
      );
      return await this.studentRepository.save(updatedStudent);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update student');
    }
  }

  async remove(id: string): Promise<any> {
    try {
      const existingStudent = await this.studentRepository.findOne({
        where: { id },
      });
      if (!existingStudent) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }
      return await this.studentRepository.remove(existingStudent);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error.code === '23503') {
        throw new BadRequestException(
          'Cannot delete student due to related records in other tables',
        );
      }
      throw new InternalServerErrorException('Failed to delete student');
    }
  }
}
