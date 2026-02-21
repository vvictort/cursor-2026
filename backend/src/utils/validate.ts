const MAX_PERSON_ID_LEN = 64;

export function isValidPersonId(personId: string): boolean {
  return typeof personId === 'string' && personId.length > 0 && personId.length <= MAX_PERSON_ID_LEN;
}
