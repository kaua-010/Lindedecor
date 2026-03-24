import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: User) {
    const u = await this.users.findById(user.id);
    const { senha, ...rest } = u;
    return rest;
  }

  @UseGuards(JwtAuthGuard)
  @Post('enderecos')
  async criarEndereco(@CurrentUser() user: User, @Body() body: any) {
    return this.users.criarEndereco(user.id, body);
  }
}
