import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateShoppingListDto {
  @ApiProperty({
    description: 'The user Id',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'The expires date of shopping list',
  })
  @IsOptional()
  @IsDateString()
  expires_at?: Date;

  @ApiProperty({
    description: 'The total price of shopping list',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  total_price: number;
}
