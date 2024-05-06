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

@Module({
  imports: [HttpModule, ContentModule, ConfigModule.forRoot()],
  controllers: [AppController, AuthController, ContentController],
  providers: [AppService, ContentService, AuthService],
})
export class AppModule {}
