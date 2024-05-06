import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';

@Module({
    imports: [HttpModule],
    controllers: [ContentController],
    providers: [ContentService],
    exports: [ContentModule]
})
export class ContentModule {}
