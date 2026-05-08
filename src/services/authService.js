import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

export async function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}
