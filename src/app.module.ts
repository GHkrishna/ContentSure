import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { ContentController } from './content/content.controller';
import { ContentService } from './content/content.service';
import { AuthService } from './auth/auth.service';
import { HttpModule } from '@nestjs/axios';
import { ContentModule } from './content/content.module';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    HttpModule,
    ContentModule,
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    ContentController,
    AppController,
  ],
  providers: [AppService, ContentService, AuthService],
})
export class AppModule {}
