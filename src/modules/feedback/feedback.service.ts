import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/index';
import { Feedback } from './feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { PerformanceReview } from '../reviews/review.entity';
import { Employee } from '../employees/employee.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
    @InjectRepository(PerformanceReview)
    private reviewsRepository: Repository<PerformanceReview>,
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
  ) {}

  async getAssignedReviews(employeeId: number): Promise<PerformanceReview[]> {
    const employee = await this.employeesRepository.findOne({
      where: { id: employeeId },
      relations: ['performanceReviews'],
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }
    return employee.reviews;
  }

  async getFeedbacksByReviewId(reviewId: number): Promise<Feedback[]> {
    const review = await this.reviewsRepository.findOneBy({ id: reviewId });
    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewId} not found.`);
    }

    const feedbacks = await this.feedbackRepository.find({
      where: { review: { id: reviewId } },
      relations: ['employee'],
      withDeleted: true,
    });

    return feedbacks;
  }

  async submitFeedback(
    createFeedbackDto: CreateFeedbackDto,
    authorId: number,
  ): Promise<Feedback> {
    const review = await this.reviewsRepository.findOne({
      where: { id: createFeedbackDto.reviewId },
      relations: ['participants'],
    });

    if (!review) {
      throw new NotFoundException(
        `PerformanceReview with ID ${createFeedbackDto.reviewId} not found`,
      );
    }

    if (!review.participants.some((p) => p.id === authorId)) {
      throw new BadRequestException(
        'You are not assigned to provide feedback for this review',
      );
    }

    const author = await this.employeesRepository.findOne({
      where: { id: authorId },
    });
    if (!author) {
      throw new NotFoundException(`Employee with ID ${authorId} not found`);
    }

    const feedback = this.feedbackRepository.create({
      comments: createFeedbackDto.comments,
      review: review,
      employee: author,
    });

    return this.feedbackRepository.save(feedback);
  }

  async getAllFeedbacks(): Promise<Feedback[]> {
    return this.feedbackRepository.find({
      relations: ['review', 'author'],
      withDeleted: true,
    });
  }

  async getFeedbackById(id: number): Promise<Feedback> {
    const feedback = await this.feedbackRepository.findOne({
      where: { id },
      relations: ['review', 'author'],
    });
    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }
    return feedback;
  }
}
