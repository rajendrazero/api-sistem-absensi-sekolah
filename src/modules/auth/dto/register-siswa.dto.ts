import { RegisterDto } from './register.dto';
import { IsString, IsNotEmpty } from 'class-validator';

export class RegisterSiswaDto extends RegisterDto {
  @IsString()
  @IsNotEmpty()
  classId: string;

  @IsString()
  @IsNotEmpty()
  nis: string;

  @IsString()
  @IsNotEmpty()
  nisn: string;
}
