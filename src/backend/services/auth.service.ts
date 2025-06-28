// backend/services/auth.service.ts
import { DBService } from './db.service';
import bcrypt from 'bcryptjs';

interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  token?: string; 
}

export class AuthService {
  private static readonly SALT_ROUNDS = 10;
  private static readonly TOKEN_SECRET = 'your-secret-key'; 

  static async register(email: string, password: string, name: string): Promise<User> {
    const users = await DBService.read<User>('users'); 
    
    if (users.some(u => u.email === email)) {
      throw new Error('Email já cadastrado.');
    }

    const passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS);
    const newUser: User = {
      id: Date.now().toString(),
      email,
      passwordHash,
      name,
      token: this.generateToken(email) 
    };

    users.push(newUser);
    await DBService.write('users', users); 
    return newUser;
  }

  static async login(email: string, password: string): Promise<User> {
    const users = await DBService.read<User>('users'); 
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
    await DBService.write('users', updatedUsers); 

    return updatedUser;
  }

  static async checkAuth(token: string): Promise<boolean> {
    const users = await DBService.read<User>('users'); 
    return users.some(u => u.token === token);
  }

  static async logout(token: string): Promise<void> {
    const users = await DBService.read<User>('users'); 
    const updatedUsers = users.map(u => 
      u.token === token ? { ...u, token: undefined } : u
    );
    await DBService.write('users', updatedUsers);
  }

  private static generateToken(email: string): string {
    
    return Buffer.from(`${email}:${Date.now()}`).toString('base64');
  }
}