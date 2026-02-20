import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  password: string;
}
