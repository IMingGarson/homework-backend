import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PerformanceReview } from '../reviews/review.entity';
import { Feedback } from '../feedback/feedback.entity';
import { User } from '../auth/user.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @OneToOne(() => User, (user) => user.employee, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToMany(() => PerformanceReview, (review) => review.employee)
  reviews: PerformanceReview[];

  @OneToMany(() => PerformanceReview, (review) => review.participants)
  participatedReviews: PerformanceReview[];

  @OneToMany(() => Feedback, (feedback) => feedback.employee)
  feedbacks: Feedback[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
