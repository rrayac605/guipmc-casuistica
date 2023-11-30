export interface ResponseDTO<T> {
    data?: T;
    totalElements?: number;
    totalRows?: number;
    page?: number;
    size?: number;
    totalElementsMovement?: number;
    changesMinorThanMovements?: number;
}
