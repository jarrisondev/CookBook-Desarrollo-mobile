import type {
  DocumentData,
  FirestoreDataConverter,
  PartialWithFieldValue,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from '@firebase/firestore';
import type { z } from 'zod';

export function buildConverter<T extends Record<string, unknown>>(
  schema: z.ZodSchema<T>,
  idField: keyof T = 'id' as keyof T,
): FirestoreDataConverter<T> {
  return {
    toFirestore(model: PartialWithFieldValue<T>): DocumentData {
      const clone = { ...(model as Record<string, unknown>) };
      delete clone[idField as string];
      return clone;
    },
    fromFirestore(snap: QueryDocumentSnapshot, options?: SnapshotOptions): T {
      const data = snap.data(options);
      return schema.parse({ ...data, [idField]: snap.id });
    },
  };
}
