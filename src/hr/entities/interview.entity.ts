import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { InterviewInterface } from '../../types/hr/interview';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Interview extends BaseEntity implements InterviewInterface {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    type: 'datetime',
  })
  public expiredAt: Date;

  @ManyToOne((type) => User, (user) => user.hrInterview)
  @JoinColumn()
  public hr: User;

  @ManyToOne((type) => User, (user) => user.studentAtInterview)
  @JoinColumn()
  public student: User;
}
