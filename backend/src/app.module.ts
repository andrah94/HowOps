import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +(process.env.DB_PORT || 5432),
      username: process.env.DB_USER || 'app',
      password: process.env.DB_PASS || 'app',
      database: process.env.DB_NAME || 'app',
      autoLoadEntities: true,
      synchronize: true
    }),
    HealthModule
  ]
})
export class AppModule {}
