import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../../types';

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
}
