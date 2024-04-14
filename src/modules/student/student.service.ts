import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { FindStudentDto } from './dto/find-student.dto';
import { SortOrder } from 'src/shared/types/enums';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const newStudent = this.studentRepository.create(createStudentDto);
    return this.studentRepository.save(newStudent);
  }

  async findAll({
    page = { limit: 2, offset: 1 },
    search,
    filters,
    sort = { by: 'created_at', order: SortOrder.DESC },
  }: FindStudentDto): Promise<any> {
    const queryBuilder = this.studentRepository.createQueryBuilder('student');

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
      queryBuilder.where(filters).getMany();
    }
    const total = await queryBuilder.getCount();
    const data = await queryBuilder
      .skip((page.offset - 1) * page.limit)
      .take(page.limit)
      .getMany();

    return { total, data, limit: page.limit, offset: page.offset };
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student)
      throw new NotFoundException(`Student with ID ${id} not found`);
    return student;
  }

  async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    const existing = await this.studentRepository.findOne({ where: { id } });
    if (!existing)
      throw new NotFoundException(`Student with ID ${id} not found`);
    const updatedStudent = this.studentRepository.merge(
      existing,
      updateStudentDto,
    );
    return await this.studentRepository.save(updatedStudent);
  }

  async remove(id: string): Promise<any> {
    const existingStudent = await this.studentRepository.findOne({
      where: { id },
    });
    if (!existingStudent) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return await this.studentRepository.remove(existingStudent);
  }
}
