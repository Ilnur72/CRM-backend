import { Injectable, NotFoundException } from '@nestjs/common';
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
    const newStaff = this.staffRepository.create(createStaffDto);
    return this.staffRepository.save(newStaff);
  }

  async findAll({
    page = { limit: 2, offset: 1 },
    search,
    filters,
    sort = { by: 'created_at', order: SortOrder.DESC },
  }: FindStaffDto): Promise<any> {
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
      queryBuilder.where(filters).getMany();
    }
    const total = await queryBuilder.getCount();
    const data = await queryBuilder
      .skip((page.offset - 1) * page.limit)
      .take(page.limit)
      .getMany();

    return { total, data, limit: page.limit, offset: page.offset };
  }

  async findOne(id: string): Promise<Staff> {
    const staff = await this.staffRepository.findOne({ where: { id } });
    if (!staff) throw new NotFoundException(`Staff with ID ${id} not found`);
    return staff;
  }

  async update(id: string, updateStaffDto: UpdateStaffDto): Promise<Staff> {
    const existing = await this.staffRepository.findOne({ where: { id } });
    if (!existing) throw new NotFoundException(`Staff with ID ${id} not found`);
    const updatedStaff = this.staffRepository.merge(existing, updateStaffDto);
    return await this.staffRepository.save(updatedStaff);
  }

  async remove(id: string): Promise<any> {
    const existingStaff = await this.staffRepository.findOne({
      where: { id },
    });
    if (!existingStaff) {
      throw new NotFoundException(`Staff with ID ${id} not found`);
    }
    return await this.staffRepository.remove(existingStaff);
  }
}
