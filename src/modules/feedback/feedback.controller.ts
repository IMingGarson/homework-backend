import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '../auth/user.entity';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Roles(Role.EMPLOYEE)
  @Post()
  async submitFeedback(
    @Body() createFeedbackDto: CreateFeedbackDto,
    @Request() req,
  ) {
    const authorId = req.user.employeeId;
    const feedback = await this.feedbackService.submitFeedback(
      createFeedbackDto,
      authorId,
    );
    return feedback;
  }
}
