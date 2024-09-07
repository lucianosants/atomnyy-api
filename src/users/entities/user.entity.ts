import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  cellphone: string;

  @Column()
  password_hash: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
