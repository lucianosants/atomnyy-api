import { BadRequestException } from '@nestjs/common';

import { RegisterUserUseCase } from './register-user.use-case';

import { InMemoryUserRepository } from 'src/users/repositories/in-memory-user-repository';

describe('Register User(Use Case)', () => {
  let userRepository: InMemoryUserRepository;
  let sut: RegisterUserUseCase;

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();
    sut = new RegisterUserUseCase(userRepository);
  });

  it('should create a new user successfully', async () => {
    const result = await sut.execute({
      name: 'John',
      email: 'johndoe@example.com',
      last_name: 'Doe',
      password_hash: 'password123',
      cellphone: '5589912345678',
    });

    expect(result).toHaveProperty('message', 'User created successfully');
    expect(result.user).toHaveProperty('email', 'johndoe@example.com');
    expect(result.user.password_hash).toBeUndefined();
  });

  it('should throw error if user already exists', async () => {
    const createUserDto = {
      name: 'John',
      email: 'johndoe@example.com',
      last_name: 'Doe',
      password_hash: 'password123',
      cellphone: '5589912345678',
    };

    await userRepository.create(createUserDto);

    await expect(sut.execute(createUserDto)).rejects.toThrow(
      BadRequestException,
    );
  });
});
