import { JoinColumn, BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserInterface, UserRole } from '../../types';
import { Student } from '../../student/entities/student.entity';
import { Hr } from '../../hr/entities/hr.entity';

@Entity()
export class User extends BaseEntity implements UserInterface {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    length: 60,
    nullable: true,
    default: null,
  })
  public lastName: string;

  @Column({
    length: 60,
    nullable: true,
    default: null,
  })
  public firstName: string;

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

  @Column()
  public jwtId: string;

  @OneToOne((type) => Student, (student) => student.user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public student: Student;

  @OneToOne((type) => Hr, (hr) => hr.user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public hr: Hr;
}
