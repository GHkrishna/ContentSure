import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { FileUploadDto } from './content.dto';

@ApiTags('content')
@Controller('content')
export class ContentController {
  private readonly logger = new Logger(ContentController.name);

  constructor(private readonly contentService: ContentService) {}

  @Post('sign')
  @ApiOperation({
    summary: 'Sign content',
    description:
      'Get an unsigned image, sign it and return a signed image using C2PA tool',
  })
  async signContent(@Body() body: FileUploadDto): Promise<object> {
    try {
      console.log('entered controller');
      const filename = await this.contentService.signContent(body);

      return { base64: filename };
    } catch (err) {
      this.logger.error('[signContent]', err);
      throw new Error(err.message);
    }
  }
}
