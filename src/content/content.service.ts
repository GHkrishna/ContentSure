import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { error } from 'console';

@Injectable()
export class ContentService {
    private readonly logger = new Logger(ContentService.name)

    constructor(private readonly httpService: HttpService) {}

    private token:string = '';
    
    async signContent(): Promise<String> {
        // get token (from cache or if expired make a call and get token)
        // take content and pass it to sign
        // call the endpoint
        try {
            const token = await this.getToken();
            return token;
        } catch(err) {
            this.logger.error('[signContent]::', err)
        }
    } 

    async getToken() {
        try {
        if (this.token !== '') {
            return this.token;
        }
        const url = `${process.env.CREDEBL_API_ENDPOINT}/auth/signin`
        const data = {
              "email": process.env.CONTENTSURE_EMAIL,
              "password": process.env.CONTENTSURE_ENCRYPTED_PASSWORD,
              "isPasskey": false
             }
        const config: AxiosRequestConfig<any> = {
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
        }
        console.log('Before response, url::', url)
        console.log('Before response, data::', JSON.stringify(data))
        console.log('Before response, config::', JSON.stringify(config))
        console.log('Before response')
        const response: {
            data: any
          } = await this.httpService.post(url, data, config).toPromise();

        console.log(JSON.stringify(response.data.data.access_token))
        const token = response.data.data.access_token;
        this.token = token;
        return token
        } catch(err) {
            this.logger.error('[getToken]::', err)
        }
    }
}
