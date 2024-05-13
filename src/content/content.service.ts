import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { manifest } from '../commons/manifest';

import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';
import { IFileUpload } from './content.interface';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';

@Injectable()
export class ContentService {
  private readonly logger = new Logger(ContentService.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
  ) {}

  private token: string = '';

  async signContent(body: IFileUpload): Promise<any> {
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
      const manifestFile = manifest;

      // Create a custom assertiona and manifest for each request
      manifestFile.title = body.title;
      manifestFile.assertions[1].data.author[0].name = body.authorName;
      manifestFile.assertions[1].data.author[1]['@id'] = body.authorSocial;
      manifestFile.assertions[1].data.author[1].name = body.authorName;

      // Make the manifest file compatible in cli
      const strManifest = JSON.stringify(manifestFile).replace(/'/g, "\\'");

      console.log('This is stringified JSON::::', strManifest);

      console.log('This is the binaryData:::', binaryData);
      console.log('This is the filename:::', filename);
      console.log('This is the inputFilePath:::', inputFilePath);
      console.log('This is the outputFilePath:::', outputFilePath);

      const fsPromises = fs.promises;
      await fsPromises.appendFile(inputFilePath, binaryData, {
        flag: 'w',
      });
      // const command = `./c2patool ${inputFilePath} -m updatedManifest.json -o ${outputFilePath} -f`;

      // Command to sign the image from 'inputFilePath' with manifest 'strManifest' and store it in 'outputFilePath'
      const command = `./c2patool ${inputFilePath}  \ -c '${strManifest}' -o ${outputFilePath} -f`;

      const { stdout, stderr } = await exec(command);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Read from the signed file
      const readFile = promisify(fs.readFile);
      const imageBuffer = await readFile(join(process.cwd(), outputFilePath));
      const base64 = imageBuffer.toString('base64');
      // Convert the file metadata into valid base64 url
      const imageUrl = `data:image/${imageType};base64,${base64}`;

      console.log('This is the stdout:::', stdout);
      console.log('This is the stderr:::', stderr);

      if (body.authorEmail) {
        // If authemail present, send a credential to author about publication
        await this.sendCredentialToAuthor(
          body.authorEmail,
          body.authorName,
          body.publishedBy,
          body.title,
        );
      }

      return imageUrl;
    } catch (err) {
      this.logger.error('[signContent]::', err);
      throw new Error(err.message);
    }
  }

  // Send credential to author
  async sendCredentialToAuthor(
    authorEmail: string,
    author: string,
    publishedBy: string,
    title: string,
  ) {
    console.log('This is authorEmail::::::', authorEmail);
    console.log('This is author::::::', author);
    console.log('This is publishedBy::::::', publishedBy);
    console.log('This is title::::::', title);

    let token = await this.cacheManager.get('token');

    if (!token) {
      token = await this.getToken();
      await this.cacheManager.set('token', token, 1000);
      console.log('this is token inside if condition:::', token);
    }

    console.log('this is token:::', token);
  }

  // Get token required to make API calls to credebl
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
