import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { dataSourceOptions } from './data-source';
import { AuthModule } from './application/modules/auth.module';
import { StoriesModule } from './application/modules/stories.module';
import { UploadModule } from './application/modules/upload.module';
import { NotificationsModule } from './application/modules/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false,
      },
    }),
    AuthModule,
    StoriesModule,
    UploadModule,
    NotificationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
