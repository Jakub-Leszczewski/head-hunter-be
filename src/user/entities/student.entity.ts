import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { User } from './user.entity';
import { ContractType, WorkType } from '../../types';

@Entity()
export class Student extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    type: 'float',
    precision: 3,
    scale: 2,
  })
  public courseCompletion: number;

  @Column({
    type: 'float',
    precision: 3,
    scale: 2,
  })
  public courseEngagement: number;

  @Column({
    type: 'float',
    precision: 3,
    scale: 2,
  })
  public projectDegree: number;

  @Column({
    type: 'float',
    precision: 3,
    scale: 2,
  })
  public teamProjectDegree: number;

  @Column({
    type: 'float',
    precision: 3,
    scale: 2,
  })
  public bonusProjectUrls: number;

  @Column({
    length: 60,
  })
  public lastName: string;

  @Column({
    length: 60,
  })
  public firstName: string;

  @Column({
    length: 39,
  })
  public githubUsername: string;

  @Column({
    length: 256,
    nullable: true,
    default: null,
  })
  public bio: string;

  @Column({
    length: 15,
    nullable: true,
    default: null,
  })
  public phoneNumber: string;

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  public education: string;

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  public courses: string;

  @Column({
    precision: 4,
    default: 0,
  })
  public monthsOfCommercialExp: number;

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  public workExperience: string;

  @Column({
    length: 50,
    nullable: true,
    default: null,
  })
  public targetWorkCity: string;

  @Column({
    unsigned: true,
    type: 'float',
    precision: 9,
    scale: 2,
    nullable: true,
    default: null,
  })
  public expectedSalary: number;

  @Column({
    type: 'enum',
    enum: ContractType,
    default: ContractType.Irrelevant,
  })
  public expectedContractType: ContractType;

  @Column({
    type: 'enum',
    enum: WorkType,
    default: WorkType.Irrelevant,
  })
  public expectedTypeWork: WorkType;

  @Column({
    type: 'boolean',
    precision: 1,
    default: 0,
  })
  public canTakeApprenticeship: boolean;

  //@TODO stworzyć tabele one to many
  public projectUrls: string[];

  //@TODO stworzyć tabele one to many
  public portfolioUrls: string[];

  @OneToOne((type) => User, (user) => user.student)
  public user: User;
}
