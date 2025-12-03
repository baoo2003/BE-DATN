import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './modules/news/news.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Module } from './modules/s3/s3.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const caDecoded = Buffer.from(
          config.get<string>('DB_CA') ?? '',
          'base64',
        ).toString('utf-8');

        return {
          type: 'mysql',
          host: config.get<string>('DB_HOST'),
          port: Number(config.get<string>('DB_PORT')),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_NAME'),
          autoLoadEntities: true,
          synchronize: true,
          charset: 'utf8mb4',
          extra: { charset: 'utf8mb4_unicode_ci' },
          ssl: {
            ca: caDecoded,
            rejectUnauthorized: true,
          },
        };
      },
    }),
    NewsModule,
    AuthModule,
    UserModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
