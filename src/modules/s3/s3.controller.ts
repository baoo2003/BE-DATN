import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileServiceS3 } from './s3.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('s3')
export class S3Controller {
  constructor(private readonly uploadFileService: UploadFileServiceS3) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('path') path: string = 'uploads',
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const file_name = file.originalname;

    const url = await this.uploadFileService.uploadFileToPublicBucket(path, {
      file,
      file_name,
    });

    return { url };
  }
}
