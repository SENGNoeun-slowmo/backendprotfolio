import { AuthContext } from './types/index';

declare global {
  namespace Express {
    interface Request {
      user?: AuthContext;
    }
  }
}
