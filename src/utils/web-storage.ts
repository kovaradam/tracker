type Config<T = string> = {
  storage?: Storage;
  defaultValue?: T;
  transforms?: [read: (value: string) => T, write: (value: T) => string];
};

type ReturnType<T = string> = [get: () => T | null, set: (value: T) => void];

export function createWebStorageAccess<T = string>(
  selector: string,
  config?: Config<T>,
): ReturnType<T> {
  const [transforms, storage] = [config?.transforms, config?.storage || localStorage];

  function get(): T | null {
    const result = storage.getItem(selector);
    if (transforms && result) {
      return transforms[0](result);
    }
    return result as unknown as T;
  }

  function set(value: T): void {
    const transform = transforms?.[1] ?? String;
    storage.setItem(selector, transform(value));
  }

  const defaultValue = config?.defaultValue;

  if (defaultValue !== undefined && get() === null) {
    set(defaultValue);
  }

  return [get, set];
}
