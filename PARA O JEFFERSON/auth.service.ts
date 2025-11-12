import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { mysqlPool } from '../config/db';

async function login(email: string, senhaInserida: string) {
  // 1. Buscar usuário e sua senha (hash) no MySQL
  const [users]: any[] = await mysqlPool.query(
    'SELECT ID_usuario, nome, senha FROM Usuario WHERE email = ?',
    [email]
  );

  if (users.length === 0) {
    throw new Error('Usuário não encontrado');
  }
  const user = users[0];

  // 2. Comparar a senha inserida com a senha hasheada do banco
  const isPasswordCorrect = await bcrypt.compare(senhaInserida, user.senha);
  if (!isPasswordCorrect) {
    throw new Error('Senha incorreta');
  }

  // 3. Buscar permissões do usuário no banco de dados MySQL
  const [permissoesRows]: any[] = await mysqlPool.query(
    `
      SELECT p.nome 
      FROM Permissao p
      JOIN Role_has_Permissao rp ON p.ID_permissao = rp.ID_permissao_fk
      JOIN Role r ON rp.ID_role_fk = r.ID_role
      JOIN Usuario_has_Role ur ON r.ID_role = ur.ID_role_fk
      WHERE ur.ID_usuario_fk = ?
    `,
    [user.ID_usuario]
  );

  // Extrai apenas os nomes das permissões para um array de strings
  const permissoes = permissoesRows.map((p: { nome: string }) => p.nome);

  // 4. Criar o payload do token
  const payload = {
    userId: user.ID_usuario,
    nome: user.nome,
    permissoes: permissoes,
  };

  // 5. Gerar e assinar o token JWT
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: '8h', // Token expira em 8 horas
  });

  return { token, userName: user.nome };
}

export const authService = {
  login,
};