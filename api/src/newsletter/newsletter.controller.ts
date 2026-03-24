import { Controller, Post, Body } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';

@Controller('newsletter')
export class NewsletterController {
  constructor(private service: NewsletterService) {}

  @Post()
  async cadastrar(@Body() body: { email: string; nome?: string }) {
    return this.service.cadastrar(body.email, body.nome);
  }
}
