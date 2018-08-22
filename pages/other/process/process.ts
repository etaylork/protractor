export interface Process {
    run(): Promise<void>;
}