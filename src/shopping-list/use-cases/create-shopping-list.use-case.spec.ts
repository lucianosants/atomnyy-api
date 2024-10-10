import { BadRequestException } from '@nestjs/common';

import { CreateShoppingListUseCase } from './create-shopping-list.use-case';

import { InMemoryUserRepository } from '../../users/repositories/in-memory-user-repository';
import { InMemoryShoppingListRepository } from '../repositories/in-memory-shopping-lists.repository';

import { setExpirationDateShoppingList } from '../../utils/set-expiration-date-shopping-list';

describe('Create Shopping List(Use Case)', () => {
  let shoppingListsRepository: InMemoryShoppingListRepository;
  let userRepository: InMemoryUserRepository;
  let sut: CreateShoppingListUseCase;

  beforeEach(() => {
    shoppingListsRepository = new InMemoryShoppingListRepository();
    userRepository = new InMemoryUserRepository();

    sut = new CreateShoppingListUseCase(
      shoppingListsRepository,
      userRepository,
    );
  });

  it('should create a shopping list successfully', async () => {
    const { expires_at } = setExpirationDateShoppingList();

    const user = await userRepository.create({
      name: 'John',
      email: 'johndoe@example.com',
      last_name: 'Doe',
      cellphone: '5589912345678',
      password_hash: 'password123',
    });

    const { shoppingList } = await sut.execute({
      name: 'Lista de compras 1',
      total_price: 0,
      userId: user.id,
      expires_at,
    });

    expect(shoppingList).toHaveProperty('name', 'Lista de compras 1');
    expect(shoppingList.expires_at).toBeDefined();
    expect(shoppingList).toHaveProperty('total_price', 0);
    expect(shoppingList.user).toBeUndefined();
  });

  it('should throw an error if the user does not have', async () => {
    const { expires_at } = setExpirationDateShoppingList();

    await expect(
      sut.execute({
        name: 'Lista de compras 1',
        total_price: 0,
        userId: 'invalid_user_id',
        expires_at,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
