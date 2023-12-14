import { RequestHandler } from 'express';
import zod from 'zod';
import * as auth from '../services/auth';

export const login: RequestHandler = (req, res) => { 
  const loginSchema = zod.object({
    password: zod.string()
  });

  const body = loginSchema.safeParse(req.body);

  if (!body.success) return res.json({ error: 'Dados inválidos' });
  
  if (!auth.validatePassword(body.data.password)) { 
    return res.status(403).json({ error: 'Acesso negado' });
  }
  const { token, success } = auth.createToken();

  if (!success) { 
    return res.status(403).json({ error: 'Acesso negado' });
  }

  res.json({ token });
}

export const validate: RequestHandler = (req, res, next) => { 
  if (!req.headers.authorization) { 
    return res.status(403).json({ error: 'Acesso negado' });
  }

  const [authType, token] = req.headers.authorization.split(" ");

  if (!auth.validateToken(authType, token)) { 
    return res.status(403).json({ error: 'Acesso negado' });
  }


  next();
}