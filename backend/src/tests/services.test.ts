import { TransporteService } from '../services/transporte.service';
import { AlunoService } from '../services/aluno.service';
import { ITransporteRepository } from '../repositories/transporte.repository';
import { IAlunoRepository } from '../repositories/aluno.repository';

describe('Transporte e Aluno Services - Regras de Negócio', () => {
  let mockTransporteRepo: jest.Mocked<ITransporteRepository>;
  let mockAlunoRepo: jest.Mocked<IAlunoRepository>;
  let transporteService: TransporteService;
  let alunoService: AlunoService;

  beforeEach(() => {
    mockTransporteRepo = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as any;

    mockAlunoRepo = {
      findById: jest.fn(),
      findByMatricula: jest.fn(),
      findByUserId: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as any;

    transporteService = new TransporteService(mockTransporteRepo);
    alunoService = new AlunoService(mockAlunoRepo, mockTransporteRepo);
  });

  describe('RN03 - Capacidade do veículo', () => {
    it('deve rejeitar cadastro de aluno se capacidade estiver cheia', async () => {
      const mockTransport = {
        id: 'trans-1',
        nome: 'Van 1',
        tipo: 'VAN',
        capacidade: 2,
        gratuito: true,
        valor: null,
        motoristaId: 'mot-1',
        alunos: [{ id: 'a1' }, { id: 'a2' }] // Capacidade 2, já possui 2
      } as any;

      mockTransporteRepo.findById.mockResolvedValue(mockTransport);

      await expect(
        alunoService.create({
          nome: 'Novo Aluno',
          matricula: '123',
          curso: 'Software',
          telefone: '123',
          transporteId: 'trans-1'
        })
      ).rejects.toThrow('Capacidade do transporte esgotada (RN03)');
    });

    it('deve aceitar cadastro se houver vaga', async () => {
      const mockTransport = {
        id: 'trans-1',
        nome: 'Van 1',
        tipo: 'VAN',
        capacidade: 5,
        gratuito: true,
        valor: null,
        motoristaId: 'mot-1',
        alunos: [{ id: 'a1' }]
      } as any;

      mockTransporteRepo.findById.mockResolvedValue(mockTransport);
      mockAlunoRepo.findByMatricula.mockResolvedValue(null);
      mockAlunoRepo.create.mockResolvedValue({ id: 'a2' } as any);

      const result = await alunoService.create({
        nome: 'Novo Aluno',
        matricula: '123',
        curso: 'Software',
        telefone: '123',
        transporteId: 'trans-1'
      });

      expect(result).toBeDefined();
      expect(mockAlunoRepo.create).toHaveBeenCalled();
    });
  });

  describe('RN10 - Gratuidade e valor', () => {
    it('deve exigir valor para transporte pago', async () => {
      await expect(
        transporteService.create({
          nome: 'Ônibus Pago',
          tipo: 'ONIBUS',
          capacidade: 40,
          gratuito: false,
          valor: null, // Inválido
          motoristaId: 'mot-1'
        })
      ).rejects.toThrow('Transporte pago deve possuir um valor válido maior que zero (RN10)');
    });

    it('deve zerar valor se transporte for gratuito', async () => {
      const mockCreated = { id: 't1', nome: 'Gratuito', gratuito: true, valor: null } as any;
      mockTransporteRepo.create.mockResolvedValue(mockCreated);

      await transporteService.create({
        nome: 'Gratuito',
        tipo: 'ONIBUS',
        capacidade: 40,
        gratuito: true,
        valor: 15.00, // Deve ser anulado
        motoristaId: 'mot-1'
      });

      expect(mockTransporteRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          valor: null
        })
      );
    });
  });
});
