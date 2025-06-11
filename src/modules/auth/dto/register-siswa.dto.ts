import { RegisterDto } from './register.dto';

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
