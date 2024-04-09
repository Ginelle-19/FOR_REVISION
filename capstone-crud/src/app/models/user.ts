export class User{
    LastName: string;
    FirstName: string;
    UserName: string;
    Password: string;

    constructor(LastName: string, FirstName: string, UserName: string, Password: string){
        this.LastName = LastName;
        this.FirstName = FirstName;
        this.UserName = UserName;
        this.Password = Password;
    }
}