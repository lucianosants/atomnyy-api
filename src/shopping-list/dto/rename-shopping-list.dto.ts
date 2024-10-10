import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RenameShoppingListDto {
  @ApiProperty({
    description: 'The new name for current shopping list',
  })
  @IsString()
  name: string;
}
