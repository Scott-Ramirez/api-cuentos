import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from '../../presentation/controllers/upload.controller';
import { multerConfig } from '../../infrastructure/file-storage/multer.config';

@Module({
  imports: [MulterModule.register(multerConfig)],
  controllers: [UploadController],
})
export class UploadModule {}
