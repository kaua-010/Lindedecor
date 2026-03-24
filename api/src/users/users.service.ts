import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Endereco } from './entities/endereco.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Endereco) private enderecoRepo: Repository<Endereco>,
  ) {}

  async findById(id: string) {
    return this.userRepo.findOne({ where: { id }, relations: ['enderecos'] });
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  async criarEndereco(userId: string, dados: Partial<Endereco>) {
    const end = this.enderecoRepo.create({ ...dados, userId });
    return this.enderecoRepo.save(end);
  }
}
