import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDirectionDto } from './dto/create-Direction.dto';
import { UpdateDirectionDto } from './dto/update-Direction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Direction } from './entities/course.entity';
import { Repository } from 'typeorm';
import { FindDirectionDto } from './dto/find-direction.dto';

@Injectable()
export class DirectionService {
  constructor(
    @InjectRepository(Direction)
    private directionRepository: Repository<Direction>,
  ) {}

  async create(createDirectionDto: CreateDirectionDto) {
    const existing = await this.directionRepository.find({
      where: { title: createDirectionDto.title },
    });
    if (existing)
      throw new ConflictException(
        `The direction ___//--${existing[0].title}--\\___ you entered already exists!`,
      );
    const newDirection = this.directionRepository.create(createDirectionDto);
    return this.directionRepository.save(newDirection);
  }

  async findAll({ page = { limit: 2, offset: 1 }, search }: FindDirectionDto) {
    const queryBuilder =
      this.directionRepository.createQueryBuilder('direction');

    if (search) {
      queryBuilder.where(
        'direction.title ILIKE :search OR direction.description ILIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }

    const total = await queryBuilder.getCount();
    const data = await queryBuilder
      .skip((page.offset - 1) * page.limit)
      .take(page.limit)
      .getMany();

    return { total, data, limit: page.limit, offset: page.offset };
  }

  async findOne(id: string) {
    const direction = await this.directionRepository.findOne({ where: { id } });
    if (!direction)
      throw new NotFoundException(`Direction with ID ${id} not found`);
    return direction;
  }

  async update(id: string, updateDirectionDto: UpdateDirectionDto) {
    const existing = await this.directionRepository.findOne({ where: { id } });
    if (!existing)
      throw new NotFoundException(`Direction with ID ${id} not found`);
    const updateDirection = this.directionRepository.merge(
      existing,
      updateDirectionDto,
    );
    return await this.directionRepository.save(updateDirection);
  }

  async remove(id: string) {
    const existingDirection = await this.directionRepository.findOne({
      where: { id },
    });
    if (!existingDirection) {
      throw new NotFoundException(`Direction with ID ${id} not found`);
    }
    return await this.directionRepository.remove(existingDirection);
  }
}
