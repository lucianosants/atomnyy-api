import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

export interface IUserRepository {
  create(data: CreateUserDto): Promise<User>;
  findOneById(id: string): Promise<User | undefined>;
  findOneByEmail(email: string): Promise<User | undefined>;
  findMany(): Promise<User[]>;
  delete(user: User): Promise<User>;
}
