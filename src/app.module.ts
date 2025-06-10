import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { DatabaseModule } from './shared/database/database.module';
import { AuthModule } from './modules/auth/auth.module'; 

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    AuthModule, 
  ],
})
export class AppModule {}
