import { getToday } from '../utils/getToday';
import jwt from 'jsonwebtoken';

export const validatePassword = (password: string): boolean => { 
  // Regras de senha
  // (?=(.*[A-Z]){1,}): Garante que haja no mínimo 1 letra maiúscula.
  // (?=(.*[0-9]){3,}): Garante que haja no mínimo 3 números.
  // .{6,}$: Garante que a senha tenha pelo menos 6 caracteres no total.

  const regex = /^(?=(.*[A-Z]){1,})(?=(.*[0-9]){3,}).{6,}$/;

  return regex.test(password)
}

export const createToken = () => { 
  const today = getToday().split('/').join('');

  try {
    const token = jwt.sign({
      today,
      nothingSecretString: "Santa Claus exists"
    }, process.env.KEY_JWT as string, { expiresIn: "1h" });
  
    return {success: true, token: token}
  } catch (error) {
    return {success: false};
  }

}

export const validateToken = (authType: string, token: string) => {

  if (!(authType === "Bearer")) { 
    return false;
  }

  try {
    jwt.verify(token, process.env.KEY_JWT as string)

    return true;

  } catch (error) {
    return false;
  }
  
}