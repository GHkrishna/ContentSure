import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { FileUploadDto } from './content.dto';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';

@Injectable()
export class ContentService {
  private readonly logger = new Logger(ContentService.name);

  constructor(private readonly httpService: HttpService) {}

  private token: string = '';

  async signContent(body: FileUploadDto): Promise<any> {
    console.log('entered service');
    // get token (from cache or if expired make a call and get token)
    // take content and pass it to sign
    // call the endpoint
    try {
      // const token = await this.getToken();
      // const fileName = body.fileName;

      const base64Data = body.file;

      const matches = base64Data.match(/^data:image\/([A-Za-z-+/]+);base64/);
      if (!matches || matches.length < 2) {
        throw new Error('Invalid Base64 data');
      }
      const imageType = matches[1];

      // Remove metadata from the base64 string
      const base64Image = base64Data.replace(
        /^data:image\/[A-Za-z-+/]+;base64,/,
        '',
      );
      const binaryData = Buffer.from(base64Image, 'base64');
      const filename = `image_${Date.now()}.${imageType}`;
      const inputFilePath = `uploadedFiles/${filename}`;
      const outputFilePath = `uploadedSignedFiles/${filename}`;

      console.log('This is the binaryData:::', binaryData);
      console.log('This is the filename:::', filename);
      console.log('This is the inputFilePath:::', inputFilePath);
      console.log('This is the outputFilePath:::', outputFilePath);

      // Write binary data to a file
      // fs.writeFileSync(inputFilePath, binaryData);

      const fsPromises = fs.promises;
      await fsPromises.appendFile(inputFilePath, binaryData, {
        flag: 'w',
      });
      const command = `./c2patool ${inputFilePath} -m updatedManifest.json -o ${outputFilePath} -f`;

      // To add custom JSON:
      // const updatedCommand = `c2patool sample/image.jpg \
      // -c '{"ta_url": "http://timestamp.digicert.com", "claim_generator": "CAI_Demo/0.1", "title": "", "assertions": [{"label": "c2pa.actions", "data": {"actions": [{"action": "c2pa.published"}]}}]}'`;

      const { stdout, stderr } = await exec(command);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const readFile = promisify(fs.readFile);
      const imageBuffer = await readFile(join(process.cwd(), outputFilePath));
      const base64 = imageBuffer.toString('base64');
      const imageUrl = `data:image/${imageType};base64,${base64}`;

      console.log('This is the stdout:::', stdout);
      console.log('This is the stderr:::', stderr);

      return imageUrl;
    } catch (err) {
      this.logger.error('[signContent]::', err);
      throw new Error(err.message);
    }
  }

  async getToken() {
    try {
      if (this.token !== '') {
        return this.token;
      }
      const url = `${process.env.CREDEBL_API_ENDPOINT}/auth/signin`;
      const data = {
        email: process.env.CONTENTSURE_EMAIL,
        password: process.env.CONTENTSURE_ENCRYPTED_PASSWORD,
        isPasskey: false,
      };
      const config: AxiosRequestConfig<any> = {
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
      };
      console.log('Before response, url::', url);
      console.log('Before response, data::', JSON.stringify(data));
      console.log('Before response, config::', JSON.stringify(config));
      console.log('Before response');
      const response: {
        data: any;
      } = await this.httpService.post(url, data, config).toPromise();

      console.log(JSON.stringify(response.data.data.access_token));
      const token = response.data.data.access_token;
      this.token = token;
      return token;
    } catch (err) {
      this.logger.error('[getToken]::', err);
    }
  }
}
