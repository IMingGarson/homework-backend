import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm/index';
import { PerformanceReview, ReviewStatus } from './review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Employee } from '../employees/employee.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(PerformanceReview)
    private reviewsRepository: Repository<PerformanceReview>,
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
  ) {}

  async findAll(): Promise<PerformanceReview[]> {
    return this.reviewsRepository.find({
      relations: ['participants', 'employee'],
      withDeleted: true,
    });
  }

  async findOne(id: number): Promise<PerformanceReview> {
    const review = await this.reviewsRepository.findOne({
      where: { id },
      relations: ['participants'],
      withDeleted: true,
    });
    if (!review) {
      throw new NotFoundException(`PerformanceReview with ID ${id} not found`);
    }
    return review;
  }

  async create(createReviewDto: CreateReviewDto): Promise<PerformanceReview> {
    const { employeeId, title, description, status } = createReviewDto;

    const employee = await this.employeesRepository.findOne({
      where: { id: employeeId },
      withDeleted: true,
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }

    const review = this.reviewsRepository.create({
      title,
      description,
      status,
      employee,
    });

    return await this.reviewsRepository.save(review);
  }

  async update(
    id: number,
    updateReviewDto: UpdateReviewDto,
  ): Promise<PerformanceReview> {
    const review = await this.reviewsRepository.findOne({
      where: { id },
    });
    if (updateReviewDto.title) {
      review.title = updateReviewDto.title;
    }
    if (updateReviewDto.description !== undefined) {
      review.description = updateReviewDto.description;
    }
    if (updateReviewDto.status) {
      review.status = updateReviewDto.status;
    }
    await this.reviewsRepository.update(id, review);
    return await this.reviewsRepository.findOne({
      where: { id },
    });
  }

  async remove(id: number): Promise<void> {
    const review = await this.findOne(id);
    review.deletedAt = new Date();
    await this.reviewsRepository.save(review);
  }

  async assignParticipants(
    id: number,
    employeeIds: number[],
  ): Promise<PerformanceReview> {
    const review = await this.reviewsRepository.findOne({
      where: { id },
      relations: ['participants'],
    });

    if (!review) {
      throw new BadRequestException('Review not found');
    }

    const employees = await this.employeesRepository.findBy({
      id: In(employeeIds),
    });

    if (employees.length !== employeeIds.length) {
      throw new BadRequestException('Some employee IDs are invalid');
    }

    const uniqueParticipants = [
      ...new Set([...review.participants, ...employees]),
    ];

    review.participants = uniqueParticipants;

    await this.reviewsRepository.save(review);

    return await this.reviewsRepository.findOne({
      where: { id },
      relations: ['participants'],
    });
  }

  async findReviewsAssignedToEmployee(employeeId: number) {
    return await this.reviewsRepository.find({
      where: { employee: { id: employeeId } },
      relations: ['employee'],
      withDeleted: true,
    });
  }

  async findReviewsWhereEmployeeIsParticipant(employeeId: number) {
    return await this.reviewsRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.participants', 'participant')
      .where('participant.id = :employeeId', { employeeId })
      .getMany();
  }
}
