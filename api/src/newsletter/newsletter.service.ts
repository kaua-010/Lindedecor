import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Newsletter } from './entities/newsletter.entity';

@Injectable()
export class NewsletterService {
  constructor(@InjectRepository(Newsletter) private repo: Repository<Newsletter>) {}

  async cadastrar(email: string, nome?: string) {
    const existe = await this.repo.findOne({ where: { email } });
    if (existe) throw new ConflictException('E-mail já cadastrado');
    const n = this.repo.create({ email, nome });
    return this.repo.save(n);
  }
}
