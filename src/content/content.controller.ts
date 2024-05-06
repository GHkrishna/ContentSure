import { Controller, Logger, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContentService } from './content.service';

@ApiTags('content')
@Controller('content')
export class ContentController {
    private readonly logger = new Logger(ContentController.name)

    constructor(private readonly contentService: ContentService){}

    @Post('sign')
    async signContent(): Promise<String> {
        // return 'Content Signed successfully';
        try {
            return await this.contentService.signContent();
        } catch(err) {
            this.logger.error('[signContent]', err)
        }
    }
}
