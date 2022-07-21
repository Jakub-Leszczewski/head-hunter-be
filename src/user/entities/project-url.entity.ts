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
export class ProjectUrl extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    length: 256,
  })
  public url: string;

  @ManyToOne((type) => Student, (student) => student.projectUrls, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public student: Student;
}
