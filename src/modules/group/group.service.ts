import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';
import { FindGroupDto } from './dto/find-group.dto';
import { GroupStatus, SortOrder } from 'src/shared/types/enums';
import { StaffService } from '../staff/staff.service';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private groupRepository: Repository<Group>,
    private readonly staffService: StaffService,
  ) {}

  async create(createGroupDto: CreateGroupDto) {
    try {
      await this.staffService.findOne(createGroupDto.teacher_id);

      const newGroup = this.groupRepository.create(createGroupDto);
      return await this.groupRepository.save(newGroup);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(
          `Teacher with ID ${createGroupDto.teacher_id} not found`,
        );
      }
      throw new InternalServerErrorException('Failed to create group');
    }
  }

  async findAll({
    page = { limit: 2, offset: 1 },
    search,
    filters = { is_deleted: false },
    sort = { by: 'created_at', order: SortOrder.DESC },
  }: FindGroupDto) {
    try {
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
        queryBuilder.andWhere(filters);
      }
      const total = await queryBuilder.getCount();
      const data = await queryBuilder
        .skip((page.offset - 1) * page.limit)
        .take(page.limit)
        .getMany();

      return { total, data, limit: page.limit, offset: page.offset };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch group list');
    }
  }

  async findOne(id: string) {
    try {
      const group = await this.groupRepository.findOne({
        where: { id, is_deleted: false },
        relations: ['students'],
      });
      group.students = group.students.filter(
        (student) => student.is_deleted === false,
      );
      if (!group) throw new NotFoundException(`Group with ID ${id} not found`);
      const studentIds = group.students.map((student) => student.id);

      return { ...group, students: studentIds };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch group details');
    }
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    try {
      const existing = await this.groupRepository.findOne({
        where: { id, is_deleted: false },
      });
      if (!existing)
        throw new NotFoundException(`Group with ID ${id} not found`);
      const updateGroup = this.groupRepository.merge(existing, updateGroupDto);
      return await this.groupRepository.save(updateGroup);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update group');
    }
  }

  async remove(id: string) {
    try {
      const existingGroup = await this.groupRepository.findOne({
        where: { id, is_deleted: false },
      });
      if (!existingGroup) {
        throw new NotFoundException(`Group with ID ${id} not found`);
      }
      const deleteGroup = this.groupRepository.merge(existingGroup, {
        is_deleted: true,
        status: GroupStatus.SUSPENDED,
      });
      await this.groupRepository.save(deleteGroup);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error.code === '23503') {
        throw new BadRequestException(
          'Cannot delete group due to related records in other tables',
        );
      }
      throw new InternalServerErrorException('Failed to delete group');
    }
  }
}
