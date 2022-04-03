export const hasProp = <T extends {}, U extends PropertyKey>(
  obj: T,
  prop: U
): obj is T & Record<U, unknown> => {
  return prop in obj;
};

export const isMongoDuplicateKeyError = (err: any): boolean => {
  if (
    err &&
    typeof err === "object" &&
    hasProp(err, "code") &&
    err.code === 11000
  ) {
    return true;
  }
  return false;
};
