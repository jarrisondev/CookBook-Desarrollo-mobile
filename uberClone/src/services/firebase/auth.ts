import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
} from '@firebase/auth';
import type { User as FirebaseUser } from '@firebase/auth';
import { auth } from './config';
import { createUserProfile, getUserProfile } from './users';
import type { Gender, User, UserRole } from '../../models';

export type SignUpInput = {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  gender: Gender;
  role: UserRole;
};

function friendlyAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code;
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Ya existe una cuenta con este correo';
    case 'auth/invalid-email':
      return 'Correo inválido';
    case 'auth/weak-password':
      return 'La contraseña es muy débil';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Correo o contraseña incorrectos';
    case 'auth/network-request-failed':
      return 'Sin conexión a internet';
    default:
      if (err instanceof Error && err.message) return err.message;
      return 'No pudimos completar la solicitud';
  }
}

export async function signUpWithEmail(input: SignUpInput): Promise<User> {
  let firebaseUid: string | undefined;
  try {
    const cred = await createUserWithEmailAndPassword(auth, input.email, input.password);
    firebaseUid = cred.user.uid;
  } catch (err) {
    console.warn('[auth] signUp createUser failed:', err);
    throw new Error(friendlyAuthError(err));
  }
  try {
    return await createUserProfile(firebaseUid, {
      email: input.email,
      fullName: input.fullName,
      phone: input.phone,
      gender: input.gender,
      role: input.role,
      language: 'es',
    });
  } catch (err) {
    console.warn('[auth] signUp createUserProfile failed:', err);
    throw new Error(
      err instanceof Error ? `Perfil: ${err.message}` : 'No pudimos crear el perfil',
    );
  }
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  let uid: string;
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    uid = cred.user.uid;
  } catch (err) {
    console.warn('[auth] signIn failed:', err);
    throw new Error(friendlyAuthError(err));
  }
  try {
    const profile = await getUserProfile(uid);
    if (!profile) throw new Error('Perfil no encontrado');
    return profile;
  } catch (err) {
    console.warn('[auth] getUserProfile failed:', err);
    throw new Error(
      err instanceof Error ? `Perfil: ${err.message}` : 'No pudimos leer el perfil',
    );
  }
}

export async function signOut() {
  await fbSignOut(auth);
}

export function observeAuthState(
  onUser: (firebaseUser: FirebaseUser | null) => void,
) {
  return onAuthStateChanged(auth, onUser);
}
