import { Injectable } from '@nestjs/common';

@Injectable()
export class SheetsService {
  async syncAll() {
    // Estrutura para Google Sheets API
    return { mensagem: 'Configure GOOGLE_SHEETS_ID e credenciais no .env' };
  }
}
