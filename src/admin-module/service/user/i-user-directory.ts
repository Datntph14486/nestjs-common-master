export interface IUserDirectory {
    search(username: string): Promise<any>;
    check(username: string, password: string): Promise<boolean>;
}