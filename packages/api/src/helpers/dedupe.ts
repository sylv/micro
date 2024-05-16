export const dedupe = () => {
  return (
    target: any,
    key: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>,
  ) => {
    const originalMethod = descriptor.value!;
    let existing: Promise<any> | undefined;

    descriptor.value = async function (...args: any[]) {
      if (args[0]) throw new Error("Deduped methods cannot take arguments");
      if (existing) return existing;
      existing = Promise.resolve(originalMethod.apply(this, args));
      existing.finally(() => {
        existing = undefined;
      });

      return existing;
    };
  };
};
