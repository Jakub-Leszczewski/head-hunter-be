import { HrInterface } from '../../types';
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Hr extends BaseEntity implements HrInterface {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 255,
  })
  company: string;

  @Column({
    precision: 3,
  })
  maxReservedStudents: number;

  @OneToOne((type) => User, (user) => user.hr, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public user: User;
}
