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
export class BonusProjectUrl extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    length: 256,
  })
  public url: string;

  @ManyToOne((type) => Student, (student) => student.bonusProjectUrls, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public student: Student;
}
