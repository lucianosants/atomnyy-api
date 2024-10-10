import { NotFoundException } from '@nestjs/common';

import { FindAllShoppingListsUseCase } from './find-all-shopping-lists.use-case';

import { InMemoryUserRepository } from '../../users/repositories/in-memory-user-repository';
import { InMemoryShoppingListRepository } from '../repositories/in-memory-shopping-lists.repository';

import { setExpirationDateShoppingList } from '../../utils/set-expiration-date-shopping-list';

describe('Find All Shopping Lists(Use Case)', () => {
  let shoppingListsRepository: InMemoryShoppingListRepository;
  let userRepository: InMemoryUserRepository;
  let sut: FindAllShoppingListsUseCase;

  beforeEach(() => {
    shoppingListsRepository = new InMemoryShoppingListRepository();
    userRepository = new InMemoryUserRepository();

    sut = new FindAllShoppingListsUseCase(
      shoppingListsRepository,
      userRepository,
    );
  });

  it('should be return an array with shopping lists successfully', async () => {
    const { expires_at } = setExpirationDateShoppingList();

    const user = await userRepository.create({
      name: 'John',
      email: 'johndoe@example.com',
      last_name: 'Doe',
      cellphone: '5589912345678',
      password_hash: 'password123',
    });

    await shoppingListsRepository.create(
      {
        name: 'Lista de compras 1',
        total_price: 0,
        userId: user.id,
        expires_at,
      },
      user,
    );

    await shoppingListsRepository.create(
      {
        name: 'Lista de compras 2',
        total_price: 0,
        userId: user.id,
        expires_at,
      },
      user,
    );

    const shoppingLists = await sut.execute({ userId: user.id, page: 1 });

    expect(shoppingLists.shoppingLists).toHaveLength(2);
    expect(shoppingLists.total).toEqual(2);
    expect(shoppingLists.totalPages).toEqual(1);
    expect(shoppingLists.totalPerPage).toEqual(5);
  });

  it('should throw an error if the user does not have', async () => {
    await expect(
      sut.execute({
        userId: 'invalid_user_id',
        page: 1,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
