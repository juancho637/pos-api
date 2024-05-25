import { hash, compare } from 'bcrypt';
import { HashServiceInterface } from '../domain';

export class HashBcryptService implements HashServiceInterface {
  rounds: number = 10;

  async hash(hashString: string): Promise<string> {
    return await hash(hashString, this.rounds);
  }

  async compare(password: string, hashPassword: string): Promise<boolean> {
    return await compare(password, hashPassword);
  }
}
