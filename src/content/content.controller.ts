import {
  Body,
  Controller,
  Header,
  Logger,
  Post,
  StreamableFile,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { FileUploadDto } from './content.dto';
import * as fs from 'fs';
import { join } from 'path';

@ApiTags('content')
@Controller('content')
export class ContentController {
  private readonly logger = new Logger(ContentController.name);

  constructor(private readonly contentService: ContentService) {}

  @Post('sign')
  @ApiOperation({
    summary: 'Update Organization',
    description: 'Update an organization',
  })
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="package.json"')
  //   @Header('content-type', 'image/png')
  async signContent(
    @Body() body: FileUploadDto,
    // @Query('fileName') fileName: string,
    // @Res() res: Response,
  ): Promise<StreamableFile> {
    // return 'Content Signed successfully';
    try {
      // body.fileName = fileName;
      // return await this.contentService.signContent(body);
      console.log('entered controller');
      const filename = await this.contentService.signContent(body);
      const imagePath = `uploadedSignedFiles/${filename}`;
      console.log('This is the path', join(process.cwd(), imagePath));
      // const file = fs.createReadStream(join(process.cwd(), imagePath));
      const file = fs.createReadStream(join(process.cwd(), 'package.json'));
      console.log('streaming file');
      return new StreamableFile(file);
    } catch (err) {
      this.logger.error('[signContent]', err);
    }
  }
}
