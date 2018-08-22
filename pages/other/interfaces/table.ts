export interface ITable {
    containsData: (data: {}) => Promise<boolean>;
}