export type BaseEntityResourceModel<T> = Omit<T, 'id' | 'externalId'> & { id: string };
