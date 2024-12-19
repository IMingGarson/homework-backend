// feedback.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Employee } from '../employees/employee.entity';
import { PerformanceReview } from '../reviews/review.entity';

@Entity('feedback')
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comments: string;

  @CreateDateColumn()
  submittedAt: Date;

  // Employee who provided the feedback
  @ManyToOne(() => Employee, (employee) => employee.feedbacks, {
    nullable: false,
  })
  employee: Employee;

  // The performance review for which the feedback is provided
  @ManyToOne(() => PerformanceReview, (review) => review.feedbacks, {
    nullable: false,
  })
  review: PerformanceReview;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
