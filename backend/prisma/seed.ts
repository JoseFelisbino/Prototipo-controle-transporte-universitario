import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with initial data...');

  // Clean existing data
  await prisma.aviso.deleteMany({});
  await prisma.ponto.deleteMany({});
  await prisma.rota.deleteMany({});
  await prisma.aluno.deleteMany({});
  await prisma.transporte.deleteMany({});
  await prisma.motorista.deleteMany({});
  await prisma.user.deleteMany({});

  // Passwords
  const hashAdmin = await bcrypt.hash('admin123', 10);
  const hashStudent = await bcrypt.hash('aluno123', 10);

  // Users
  const adminUser = await prisma.user.create({
    data: {
      nome: 'Admin Orleans',
      email: 'admin@orleans.gov.br',
      senha: hashAdmin,
      perfil: 'ADMIN'
    }
  });

  const studentUser = await prisma.user.create({
    data: {
      nome: 'José Felisbino',
      email: 'jose@estudante.com',
      senha: hashStudent,
      perfil: 'ESTUDANTE'
    }
  });

  // Drivers
  const driver1 = await prisma.motorista.create({
    data: {
      nome: 'João da Silva',
      telefone: '(48) 99999-1111',
      CNH: '12345678901'
    }
  });

  const driver2 = await prisma.motorista.create({
    data: {
      nome: 'Maria Oliveira',
      telefone: '(48) 99999-2222',
      CNH: '98765432109'
    }
  });

  // Transports
  const t1 = await prisma.transporte.create({
    data: {
      nome: 'Ônibus Orleans Linha 1 (UNIBAVE)',
      tipo: 'ONIBUS',
      capacidade: 40,
      gratuito: true,
      motoristaId: driver1.id
    }
  });

  const t2 = await prisma.transporte.create({
    data: {
      nome: 'Van Orleans Linha 2 (Tubarão)',
      tipo: 'VAN',
      capacidade: 15,
      gratuito: false,
      valor: 150.00,
      motoristaId: driver2.id
    }
  });

  // Routes
  await prisma.rota.create({
    data: {
      nome: 'Orleans Centro -> UNIBAVE (Orleans)',
      horarioSaida: '18:30',
      horarioChegada: '19:00',
      transporteId: t1.id
    }
  });

  await prisma.rota.create({
    data: {
      nome: 'Orleans Centro -> Unisul (Tubarão)',
      horarioSaida: '17:45',
      horarioChegada: '19:15',
      transporteId: t2.id
    }
  });

  // Points (stops)
  await prisma.ponto.createMany({
    data: [
      {
        nome: 'Terminal Rodoviário (Orleans)',
        endereco: 'Praça Celso Ramos, Centro, Orleans - SC',
        latitude: -28.3592,
        longitude: -49.2905,
        transporteId: t1.id
      },
      {
        nome: 'Posto Coxhia',
        endereco: 'Rua Altamiro Guimarães, Orleans - SC',
        latitude: -28.3610,
        longitude: -49.2850,
        transporteId: t1.id
      },
      {
        nome: 'Trevo de Orleans',
        endereco: 'Rodovia SC-390, Orleans - SC',
        latitude: -28.3485,
        longitude: -49.2780,
        transporteId: t1.id
      },
      {
        nome: 'Terminal Rodoviário (Orleans)',
        endereco: 'Praça Celso Ramos, Centro, Orleans - SC',
        latitude: -28.3592,
        longitude: -49.2905,
        transporteId: t2.id
      },
      {
        nome: 'Posto Hoffmann',
        endereco: 'Rua XV de Novembro, Orleans - SC',
        latitude: -28.3575,
        longitude: -49.2940,
        transporteId: t2.id
      }
    ]
  });

  // Student details
  await prisma.aluno.create({
    data: {
      nome: 'José Felisbino',
      matricula: '20261001',
      curso: 'Engenharia de Software',
      telefone: '(48) 98888-7777',
      userId: studentUser.id,
      transporteId: t1.id // Linked to Linha 1
    }
  });

  // Notices
  await prisma.aviso.createMany({
    data: [
      {
        titulo: 'Chuva e Atraso de 10min',
        descricao: 'Atenção alunos da Linha 1, devido às fortes chuvas e trânsito lento, o ônibus sairá com 10 minutos de atraso.',
        transporteId: t1.id
      },
      {
        titulo: 'Feriado Municipal',
        descricao: 'Não haverá transporte universitário no dia do feriado municipal de Orleans.',
        transporteId: t1.id
      },
      {
        titulo: 'Desvio de Rota SC-390',
        descricao: 'A Linha 2 fará desvio pela rota secundária SC-390 devido a obras de pavimentação.',
        transporteId: t2.id
      }
    ]
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
