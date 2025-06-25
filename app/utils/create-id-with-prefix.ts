import { createId } from '@paralleldrive/cuid2';

export function createIdWithPrefix(prefix: string) {
  return `${prefix}_${createId()}`
}