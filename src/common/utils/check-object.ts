export function isNotEmpty(object: any, fields?: string[]) {
  if (typeof object !== 'object') throw new Error("It isn't object");

  if (fields !== undefined) {
    for (const field of fields) {
      if (object[field] !== undefined) return true;
    }

    return false;
  }

  const objectEntries = Object.entries(object);
  for (const objectEntry of objectEntries) {
    if (objectEntry[1] !== undefined) return true;
  }

  return false;
}
