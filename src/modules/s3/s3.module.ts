import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3Controller } from './s3.controller';
import { UploadFileServiceS3 } from './s3.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [S3Controller],
  providers: [UploadFileServiceS3],
  exports: [UploadFileServiceS3],
})
export class S3Module {}
