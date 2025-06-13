// backend/services/auth.service.ts
import { DBService } from './db.service';
import bcrypt from 'bcryptjs';

interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  token?: string; // Adicionado para gerenciamento de sessão
}

export class AuthService {
  private static readonly SALT_ROUNDS = 10;
  private static readonly TOKEN_SECRET = 'your-secret-key'; // Em produção, use variáveis de ambiente

  static async register(email: string, password: string, name: string): Promise<User> {
    const users = await DBService.read<User>('users'); // Adicionado await
    
    if (users.some(u => u.email === email)) {
      throw new Error('Email já cadastrado.');
    }

    const passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS);
    const newUser: User = {
      id: Date.now().toString(),
      email,
      passwordHash,
      name,
      token: this.generateToken(email) // Gera token ao registrar
    };

    users.push(newUser);
    await DBService.write('users', users); // Adicionado await
    return newUser;
  }

  static async login(email: string, password: string): Promise<User> {
    const users = await DBService.read<User>('users'); // Adicionado await
    const user = users.find(u => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new Error('Credenciais inválidas.');
    }

    // Atualiza token ao fazer login
    const updatedUser = {
      ...user,
      token: this.generateToken(email)
    };

    // Atualiza no "banco de dados"
    const updatedUsers = users.map(u => 
      u.id === user.id ? updatedUser : u
    );
    await DBService.write('users', updatedUsers); // Adicionado await

    return updatedUser;
  }

  static async checkAuth(token: string): Promise<boolean> {
    const users = await DBService.read<User>('users'); // Adicionado await
    return users.some(u => u.token === token);
  }

  static async logout(token: string): Promise<void> {
    const users = await DBService.read<User>('users'); // Adicionado await
    const updatedUsers = users.map(u => 
      u.token === token ? { ...u, token: undefined } : u
    );
    await DBService.write('users', updatedUsers); // Adicionado await
  }

  private static generateToken(email: string): string {
    // Simples implementação - em produção use JWT ou similar
    return Buffer.from(`${email}:${Date.now()}`).toString('base64');
  }
}