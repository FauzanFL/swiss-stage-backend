import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(private databaseService: DatabaseService) {}

  findByUsername(username: string) {
    return this.databaseService.user.findUnique({ where: { username } });
  }
}
