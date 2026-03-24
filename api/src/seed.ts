import { DataSource } from 'typeorm';
import { Produto } from './produtos/entities/produto.entity';
import { Cupom } from './cupons/entities/cupom.entity';
import * as bcrypt from 'bcrypt';
import { User } from './users/entities/user.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'linedecor',
  entities: [Produto, Cupom, User],
  synchronize: false,
});

async function seed() {
  await dataSource.initialize();
  const produtoRepo = dataSource.getRepository(Produto);
  const cupomRepo = dataSource.getRepository(Cupom);
  const userRepo = dataSource.getRepository(User);

  const count = await produtoRepo.count();
  if (count === 0) {
    const produtos = [
      { nome: 'Vaso Cerâmica Atena', descricao: 'Vaso artesanal em cerâmica esmaltada.', preco: 289, categoria: 'Vasos', emoji: '🏺', estoque: 15, badge: 'Novo' },
      { nome: 'Kit Velas Âmbar', descricao: 'Kit com 3 velas de cera de soja.', preco: 149, precoOriginal: 210, categoria: 'Velas', emoji: '🕯️', estoque: 30, badge: 'Oferta' },
      { nome: 'Quadro Abstrato Ouro', descricao: 'Impressão com moldura dourada.', preco: 420, categoria: 'Quadros', emoji: '🖼️', estoque: 8, colecao: 'Premium' },
    ];
    for (const p of produtos) {
      await produtoRepo.save(produtoRepo.create(p));
    }
    console.log('Produtos seed OK');
  }

  const cupomCount = await cupomRepo.count();
  if (cupomCount === 0) {
    await cupomRepo.save(cupomRepo.create({ codigo: 'BEMVINDO10', tipo: 'percentual', valor: 10, minimoCompra: 100 }));
    await cupomRepo.save(cupomRepo.create({ codigo: 'FRETE299', tipo: 'valor', valor: 25, minimoCompra: 299 }));
    console.log('Cupons seed OK');
  }

  const userCount = await userRepo.count();
  if (userCount === 0) {
    const hash = await bcrypt.hash('admin123', 10);
    await userRepo.save(userRepo.create({ nome: 'Admin', email: 'kauavaes55@gmail.com', senha: hash }));
    console.log('Admin user criado: kauavaes55@gmail.com / admin123');
  }

  await dataSource.destroy();
}

seed().catch(console.error);
