import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    async signUp(): Promise<string> {
        return 'Signup successful'
    }
}
