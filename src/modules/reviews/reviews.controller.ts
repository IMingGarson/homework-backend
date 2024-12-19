import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AssignParticipantsDto } from './dto/assign-participants.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../auth/user.entity';
import { Feedback } from '../feedback/feedback.entity';
import { FeedbackService } from '../feedback/feedback.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly feedbackService: FeedbackService,
  ) {}

  @Get(':id/feedbacks')
  async getFeedbacks(
    @Param('id', ParseIntPipe) reviewId: number,
  ): Promise<Feedback[]> {
    return await this.feedbackService.getFeedbacksByReviewId(reviewId);
  }

  @Get('assigned')
  @Roles(Role.EMPLOYEE)
  getAssignedReviews(@Request() req) {
    const employeeId = req.user.employeeId;
    return this.reviewsService.findReviewsAssignedToEmployee(employeeId);
  }

  @Get('participating')
  @Roles(Role.EMPLOYEE)
  getParticipatingReviews(@Request() req) {
    const employeeId = req.user.employeeId;
    return this.reviewsService.findReviewsWhereEmployeeIsParticipant(
      employeeId,
    );
  }

  @Get()
  async getAll() {
    const reviews = await this.reviewsService.findAll();
    return reviews;
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    const review = await this.reviewsService.findOne(id);
    return review;
  }

  @Post('assign')
  async assignParticipants(@Body() assignDto: AssignParticipantsDto) {
    const { reviewID, employeeIds } = { ...assignDto };
    const review = await this.reviewsService.assignParticipants(
      reviewID,
      employeeIds,
    );
    return review;
  }

  @Post()
  async create(@Body() createReviewDto: CreateReviewDto) {
    const review = await this.reviewsService.create(createReviewDto);
    return review;
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    const review = await this.reviewsService.update(id, updateReviewDto);
    return review;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.reviewsService.remove(id);
    return { message: `PerformanceReview with ID ${id} has been removed` };
  }
}
