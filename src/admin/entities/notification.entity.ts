import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { NotificationInterface } from '../../types';

@Entity()
export class Notification extends BaseEntity implements NotificationInterface {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    length: 256,
  })
  public message: string;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public createdAt: Date;

  @ManyToOne((type) => User, (user) => user.notifications)
  @JoinColumn()
  public user: User;
}
