export function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (a === null || b === null) return a === b;

  if (typeof a !== "object" || typeof b !== "object") {
    return a === b;
  }

  const aObj = a as Record<string, unknown>;
  const bObj = b as Record<string, unknown>;
  const props = Object.getOwnPropertyNames(aObj);

  for (const p of props) {
    const objAWithIsEqual = aObj[p] as {
      isEqual?: (other: unknown) => boolean;
    };
    const objBWithIsEqual = aObj[p] as {
      isEqual?: (other: unknown) => boolean;
    };

    if (
      typeof objAWithIsEqual.isEqual === "function" &&
      typeof objBWithIsEqual.isEqual === "function"
    ) {
      return objAWithIsEqual.isEqual(objBWithIsEqual);
    }
    if (!isEqual(aObj[p], bObj[p])) return false;
  }

  return true;
}

export function merge<A extends object>(a: A, b: A): A {
  const data = {} as A;
  const propSet = new Set<keyof A>([
    ...(Object.getOwnPropertyNames(a) as (keyof A)[]),
    ...(Object.getOwnPropertyNames(b) as (keyof A)[]),
  ]);

  for (const prop of propSet) {
    data[prop] = b[prop] ?? a[prop];
  }

  return data;
}
