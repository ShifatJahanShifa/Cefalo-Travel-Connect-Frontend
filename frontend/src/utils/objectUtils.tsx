import { isTruthy } from "./truthiness";

export const isNonEmptyObject = (object: Record<string, any>): boolean => {
    if (!object || typeof object !== "object") return false;
    return Object.values(object).some(isTruthy);
};
