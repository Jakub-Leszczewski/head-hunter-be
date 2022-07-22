import {
  JoinColumn,
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserInterface, UserRole } from '../../types';
import { Student } from './student.entity';

@Entity()
export class User extends BaseEntity implements UserInterface {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    length: 256,
  })
  public email: string;

  @Column({
    length: 64,
    nullable: true,
    default: null,
  })
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
    nullable: true,
    default: null,
  })
  public userToken: string;

  @OneToOne((type) => Student, (student) => student.user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public student: Student;
}
