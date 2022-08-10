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
  public expiredAt: string;

  @ManyToOne((type) => User)
  @JoinColumn()
  public hr: User;

  @ManyToOne((type) => User)
  @JoinColumn()
  public student: User;
}
