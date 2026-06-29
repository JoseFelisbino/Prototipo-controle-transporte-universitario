import { body } from 'express-validator';

export const registerRules = [
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório.'),
  body('email').trim().isEmail().withMessage('E-mail inválido.'),
  body('senha').isLength({ min: 4 }).withMessage('A senha deve ter no mínimo 4 caracteres.'),
  body('perfil')
    .optional()
    .isIn(['ADMIN', 'ESTUDANTE'])
    .withMessage('Perfil inválido. Deve ser ADMIN ou ESTUDANTE.')
];

export const loginRules = [
  body('email').trim().isEmail().withMessage('E-mail inválido.'),
  body('senha').notEmpty().withMessage('Senha é obrigatória.')
];

export const motoristaRules = [
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório.'),
  body('telefone').trim().notEmpty().withMessage('Telefone é obrigatório.'),
  body('CNH')
    .trim()
    .notEmpty()
    .withMessage('CNH é obrigatória.')
    .isLength({ min: 5, max: 20 })
    .withMessage('CNH deve ter entre 5 e 20 caracteres.')
];

export const transporteRules = [
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório.'),
  body('tipo')
    .isIn(['ONIBUS', 'VAN', 'CARRO'])
    .withMessage('Tipo de transporte inválido. Deve ser ONIBUS, VAN ou CARRO.'),
  body('capacidade')
    .isInt({ min: 1 })
    .withMessage('Capacidade deve ser um número inteiro maior que zero.'),
  body('gratuito').isBoolean().withMessage('O campo gratuito deve ser um valor booleano.'),
  body('valor')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('Valor deve ser um número positivo.'),
  body('motoristaId').trim().isUUID().withMessage('ID de motorista inválido (deve ser UUID).')
];

export const alunoRules = [
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório.'),
  body('matricula').trim().notEmpty().withMessage('Matrícula é obrigatória.'),
  body('curso').trim().notEmpty().withMessage('Curso é obrigatório.'),
  body('telefone').trim().notEmpty().withMessage('Telefone é obrigatório.'),
  body('transporteId')
    .optional({ nullable: true })
    .trim()
    .isUUID()
    .withMessage('ID de transporte inválido (deve ser UUID).'),
  body('userId')
    .optional({ nullable: true })
    .trim()
    .isUUID()
    .withMessage('ID de usuário inválido (deve ser UUID).')
];

export const rotaRules = [
  body('nome').trim().notEmpty().withMessage('Nome da rota é obrigatório.'),
  body('horarioSaida')
    .trim()
    .matches(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Horário de saída deve ser no formato HH:MM.'),
  body('horarioChegada')
    .trim()
    .matches(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Horário de chegada deve ser no formato HH:MM.'),
  body('transporteId').trim().isUUID().withMessage('ID de transporte inválido (deve ser UUID).')
];

export const pontoRules = [
  body('nome').trim().notEmpty().withMessage('Nome do ponto é obrigatório.'),
  body('endereco').trim().notEmpty().withMessage('Endereço é obrigatório.'),
  body('latitude')
    .optional({ nullable: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude inválida.'),
  body('longitude')
    .optional({ nullable: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude inválida.'),
  body('transporteId').trim().isUUID().withMessage('ID de transporte inválido (deve ser UUID).')
];

export const avisoRules = [
  body('titulo').trim().notEmpty().withMessage('Título do aviso é obrigatório.'),
  body('descricao').trim().notEmpty().withMessage('Descrição do aviso é obrigatória.'),
  body('transporteId').trim().isUUID().withMessage('ID de transporte inválido (deve ser UUID).')
];
