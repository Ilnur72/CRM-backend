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
    filters = { is_deleted: false },
    sort = { by: 'created_at', order: SortOrder.DESC },
  }: FindStaffDto): Promise<any> {
    try {
      const existing = this.staffRepository.createQueryBuilder('staff');

      if (search) {
        existing.where(
          'staff.first_name ILIKE :search OR staff.last_name ILIKE :search',
          { search: `%${search}%` },
        );
      }
      if (sort.by && sort.order) {
        existing.orderBy(`staff.${sort.by}`, sort.order);
      }
      if (filters) {
        existing.andWhere(filters);
      }
      const total = await existing.getCount();
      const data = await existing
        .skip((page.offset - 1) * page.limit)
        .take(page.limit)
        .getMany();

      return { total, data, limit: page.limit, offset: page.offset };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch staff list');
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      const existing = await this.staffRepository.findOne({
        where: { id },
        relations: ['groups'],
      });
      if (!existing)
        throw new NotFoundException(`Staff with ID ${id} not found`);
      existing.groups = existing.groups.filter(
        (group) => group.is_deleted == false,
      );

      if (existing.groups.length == 1 && existing.groups[0].is_deleted)
        existing.groups = null;

      return existing;
    } catch (error) {
      console.log(error);

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch staff details');
    }
  }

  async update(id: string, updateStaffDto: UpdateStaffDto): Promise<Staff> {
    try {
      const existing = await this.staffRepository.findOne({
        where: { id, is_deleted: false },
      });
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
      const existing = await this.staffRepository.findOne({
        where: { id, is_deleted: false },
      });
      if (!existing) {
        throw new NotFoundException(`Staff with ID ${id} not found`);
      }
      const staff = this.staffRepository.merge(existing, {
        is_deleted: true,
      });
      await this.staffRepository.save(staff);
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
