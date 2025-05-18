export function getChangedFields<T extends Record<string, unknown>>(original: T, updated: T): Partial<T> {
    const changed: Partial<T> = {};
    (Object.keys(updated) as Array<keyof T>).map((key) => {
        if (updated[key] !== original[key]) {
            changed[key] = updated[key];
        }
    });
    return changed;
}
