import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from './student.entity';

@Entity()
export class PortfolioUrl extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    length: 256,
  })
  public url: string;

  @ManyToOne((type) => Student, (student) => student.portfolioUrls, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public student: Student;
}
