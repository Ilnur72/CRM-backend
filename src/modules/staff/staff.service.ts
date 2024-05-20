import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { Repository } from 'typeorm';
import { SortOrder } from 'src/shared/types/enums';
import { FindStaffDto } from './dto/find-staff.dto';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
  ) {}

  async create(createStaffDto: CreateStaffDto) {
    try {
      const newStaff = this.staffRepository.create(createStaffDto);
      return await this.staffRepository.save(newStaff);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create staff');
    }
  }

  async findAll({
    page = { limit: 2, offset: 1 },
    search,
    filters,
    sort = { by: 'created_at', order: SortOrder.DESC },
  }: FindStaffDto): Promise<any> {
    try {
      const queryBuilder = this.staffRepository.createQueryBuilder('staff');

      if (search) {
        queryBuilder.where(
          'staff.first_name ILIKE :search OR staff.last_name ILIKE :search',
          { search: `%${search}%` },
        );
      }
      if (sort.by && sort.order) {
        queryBuilder.orderBy(`staff.${sort.by}`, sort.order);
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
      throw new InternalServerErrorException('Failed to fetch staff list');
    }
  }

  async findOne(id: string): Promise<Staff> {
    try {
      const staff = await this.staffRepository
        .createQueryBuilder('staff')
        .leftJoinAndSelect('staff.groups', 'groups')
        .where('staff.id = :id', { id })
        .getOne();

      if (!staff) throw new NotFoundException(`Staff with ID ${id} not found`);
      return staff;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch staff details');
    }
  }

  async update(id: string, updateStaffDto: UpdateStaffDto): Promise<Staff> {
    try {
      const existing = await this.staffRepository.findOne({ where: { id } });
      if (!existing)
        throw new NotFoundException(`Staff with ID ${id} not found`);
      const updatedStaff = this.staffRepository.merge(existing, updateStaffDto);
      return await this.staffRepository.save(updatedStaff);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update staff');
    }
  }

  async remove(id: string): Promise<any> {
    try {
      const existingStaff = await this.staffRepository.findOne({
        where: { id },
      });
      if (!existingStaff) {
        throw new NotFoundException(`Staff with ID ${id} not found`);
      }
      return await this.staffRepository.remove(existingStaff);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error.code === '23503') {
        throw new BadRequestException(
          'Cannot delete staff due to related records in other tables',
        );
      }
      throw new InternalServerErrorException('Failed to delete staff');
    }
  }
}
