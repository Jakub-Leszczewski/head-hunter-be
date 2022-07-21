import {
  JoinColumn,
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from '../../types';
import { Student } from './student.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    length: 256,
  })
  public email: string;

  @Column({ length: 64 })
  public hashPwd: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  public role: UserRole;

  @Column({
    type: 'boolean',
    default: false,
    precision: 1,
    unsigned: true,
  })
  public isActive: boolean;

  @Column({
    length: 36,
  })
  public userToken: string;

  @Column({
    type: 'datetime',
  })
  public userTokenExpires: string;

  @OneToOne((type) => Student, (student) => student.user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public student: Student;
}
