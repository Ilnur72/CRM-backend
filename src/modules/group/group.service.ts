import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';
import { FindGroupDto } from './dto/find-group.dto';
import { SortOrder } from 'src/shared/types/enums';
import { StaffService } from '../staff/staff.service';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private groupRepository: Repository<Group>,
    private readonly staffService: StaffService,
  ) {}
  async create(createGroupDto: CreateGroupDto) {
    await this.staffService.findOne(createGroupDto.teacher_id);

    const newGroup = await this.groupRepository.create(createGroupDto);
    return this.groupRepository.save(newGroup);
  }

  async findAll({
    page = { limit: 2, offset: 1 },
    search,
    filters,
    sort = { by: 'created_at', order: SortOrder.DESC },
  }: FindGroupDto) {
    const queryBuilder = this.groupRepository.createQueryBuilder('group');

    if (search) {
      queryBuilder.where('group.title ILIKE :search', {
        search: `%${search}%`,
      });
    }
    if (sort.by && sort.order) {
      queryBuilder.orderBy(`group.${sort.by}`, sort.order);
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

  async findOne(id: string) {
    const group = await this.groupRepository.findOne({ where: { id } });
    if (!group) throw new NotFoundException(`Group with ID ${id} not found`);
    return group;
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    const existing = await this.groupRepository.findOne({ where: { id } });
    if (!existing) throw new NotFoundException(`Group with ID ${id} not found`);
    const updateGroup = this.groupRepository.merge(existing, updateGroupDto);
    return await this.groupRepository.save(updateGroup);
  }

  async remove(id: string) {
    const existingGroup = await this.groupRepository.findOne({
      where: { id },
    });
    if (!existingGroup) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    return await this.groupRepository.remove(existingGroup);
  }
}
