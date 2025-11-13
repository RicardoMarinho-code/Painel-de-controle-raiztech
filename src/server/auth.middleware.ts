/**
 * MIDDLEWARE DE AUTENTICAÇÃO - auth.middleware.ts
 * ------------------------------------------------
 * Um "middleware" no Express é uma função que tem acesso aos objetos de requisição (req),
 * resposta (res) e à próxima função de middleware no ciclo de requisição-resposta da aplicação.
 *
 * Este middleware específico, `verifyToken`, é projetado para proteger rotas. Ele verifica
 * a presença e a validade de um JSON Web Token (JWT) em cada requisição que o utiliza.
 * Se o token for válido, a requisição prossegue para o controller da rota. Caso contrário,
 * o acesso é negado com uma resposta de erro apropriada.
 */

// Importa os tipos necessários do Express para garantir a tipagem correta.
// - Request: Representa a requisição HTTP.
// - Response: Representa a resposta HTTP.
// - NextFunction: Uma função de callback para passar o controle para o próximo middleware.
import { Request, Response, NextFunction } from 'express';

// Importa a biblioteca 'jsonwebtoken' para trabalhar com JWTs.
import jwt from 'jsonwebtoken';

// Estende a interface `Request` do Express para adicionar uma propriedade `user`.
// Isso permite que, após a verificação do token, possamos anexar os dados
// do usuário decodificados ao objeto `req`, tornando-os acessíveis nos controllers.
declare global {
  namespace Express {
    interface Request {
      user?: any; // ou um tipo mais específico, como o payload do seu JWT
    }
  }
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  // 1. Extração do Token: O token JWT é esperado no cabeçalho 'Authorization'.
  // O formato padrão é "Bearer <token>", onde "<token>" é o JWT.
  const authHeader = req.headers['authorization'];
  // `authHeader.split(' ')[1]` divide a string "Bearer <token>" e pega a segunda parte (o token).
  /**
   * ESTRUTURA DE UM JWT (JSON Web Token):
   * Um JWT é composto por três partes separadas por pontos (`.`):
   * 1. Header: Contém o tipo de token (JWT) e o algoritmo de assinatura (ex: HS256).
   * 2. Payload: Contém os "claims" (informações), como dados do usuário (ID, nome, roles) e metadados (data de expiração `exp`).
   * 3. Signature: Uma assinatura digital gerada a partir do Header, Payload e de uma chave secreta (`JWT_SECRET`).
   *    A assinatura garante a autenticidade e integridade do token.
   */
  const token = authHeader && authHeader.split(' ')[1];

  // 2. Verificação da Existência do Token: Se não houver token, o acesso é negado imediatamente.
  // O status 401 (Unauthorized) indica que a autenticação é necessária.
  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
  }

  try {
    // 3. Verificação da Validade do Token: `jwt.verify` faz o trabalho pesado.
    //    - Ele decodifica o token.
    //    - Verifica a assinatura usando a chave secreta (`JWT_SECRET`) do arquivo .env. A chave secreta NUNCA
    //      deve ser exposta no código-fonte ou no frontend. Ela é o que garante que apenas seu servidor
    //      possa criar e validar tokens.
    //    - Verifica se o token não expirou (se uma data de expiração foi definida na criação).
    // Se qualquer uma dessas verificações falhar, ele lança um erro.
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // 4. Sucesso: Se a verificação for bem-sucedida, o payload decodificado do token (que geralmente
    //    contém informações do usuário como ID, nome, etc.) é anexado ao objeto `req`.
    req.user = decoded;

    // `next()` é chamado para passar o controle para o próximo middleware na pilha, ou para o controller da rota.
    next();
  } catch (error) {
    // 5. Tratamento de Erros: Se `jwt.verify` falhar, o erro é capturado aqui.
    //    - TokenExpiredError: O token é válido, mas sua data de expiração passou.
    //    - JsonWebTokenError: O token é malformado ou a assinatura é inválida.
    //    - Outros erros: Um erro genérico de servidor para casos inesperados.
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expirado.' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: 'Token inválido.' });
    }
    return res.status(500).json({ message: 'Erro interno ao validar o token.' });
  }
}
