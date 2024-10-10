import { BadRequestException } from '@nestjs/common';

import { InMemoryUserRepository } from '../../users/repositories/in-memory-user-repository';
import { InMemoryShoppingListRepository } from '../repositories/in-memory-shopping-lists.repository';

import { setExpirationDateShoppingList } from '../../utils/set-expiration-date-shopping-list';
import { RemoveShoppingListUseCase } from './remove-shopping-list.use-case';

describe('Remove Shopping List(Use Case)', () => {
  let shoppingListsRepository: InMemoryShoppingListRepository;
  let userRepository: InMemoryUserRepository;
  let sut: RemoveShoppingListUseCase;

  beforeEach(() => {
    shoppingListsRepository = new InMemoryShoppingListRepository();
    userRepository = new InMemoryUserRepository();

    sut = new RemoveShoppingListUseCase(shoppingListsRepository);
  });

  it('should be to remove shopping list successfully', async () => {
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

    const { id } = await shoppingListsRepository.create(
      {
        name: 'Lista de compras 2',
        total_price: 0,
        userId: user.id,
        expires_at,
      },
      user,
    );

    const { message } = await sut.execute({ id: id });
    const { shoppingLists } = await shoppingListsRepository.findAll(user.id, 1);

    expect(message).toEqual('Shopping list deleted successfully');
    expect(shoppingLists).toHaveLength(1);
  });

  it('should throw an error if non-exists shopping list', async () => {
    await expect(
      sut.execute({
        id: 'invalid_shopping_list_id',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
