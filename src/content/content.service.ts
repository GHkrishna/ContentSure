import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { FileUploadDto } from './content.dto';
import * as fs from 'fs';
import { exec } from 'child_process';

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

      // Write binary data to a file
      fs.writeFileSync(inputFilePath, binaryData);

      // const inputFilePath = `uploadedFiles/${fileName}`;
      //   const outputFilePath = `uploadedFiles/${fileName}`;
      // const fsPromises = fs.promises;
      // logic to store token in cache and only get if expired from cache else get from endpoint
      // await fs.appendFileSync(inputFilePath, body.file);
      // await fsPromises.appendFile(inputFilePath, Buffer.from(body.file), {
      //   flag: 'w',
      // });
      // const testCommand = 'cd uploadedFiles/ && pwd';

      // await exec(testCommand, async (err, stdout, stderr) => {
      //   this.logger.log(`shell script output: ${stdout}`);
      //   if (stderr) {
      //     this.logger.log(`shell script error: ${stderr}`);
      //   }
      //   result = stdout;
      // });

      // ./c2patool 'uploadedFiles/image_1715133432879.jpeg' -m manifest.json -o 'uploadedSignedFiles/image_1715133432879.jpeg' -f

      const command = `./c2patool ${inputFilePath} -m updatedManifest.json -o ${outputFilePath} -f`;

      // To add custom JSON:
      // const updatedCommand = `c2patool sample/image.jpg \
      // -c '{"ta_url": "http://timestamp.digicert.com", "claim_generator": "CAI_Demo/0.1", "title": "", "assertions": [{"label": "c2pa.actions", "data": {"actions": [{"action": "c2pa.published"}]}}]}'`;

      //   const { stdout, stderr } = exec(command);
      // let result;
      const result = await exec(command, (err, stdout, stderr) => {
        this.logger.log(`shell script output: ${stdout}`);
        if (stderr) {
          this.logger.log(`shell script error: ${stderr}`);
          throw new Error('shell script error while siging credential');
        }
      });

      //   if (stderr) {
      //     console.error(`Error executing command: ${JSON.stringify(stderr)}`);
      //     // return ''; // or throw an error
      //   }

      //   const report: any = stdout;
      //   fs.writeFileSync(path, buffer);
      console.log('This is the result:::', result);
      console.log('returning file name from service');
      return filename;
    } catch (err) {
      this.logger.error('[signContent]::', err);
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
