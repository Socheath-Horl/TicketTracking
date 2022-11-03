export interface IAuth {
  UserName?: string;
  Token?: string;
  Role?: string;
}

export class Auth implements IAuth {
  UserName?: string;
  Token?: string;
  Role?: string;

  constructor(auth: IAuth) {
    this.UserName = auth.UserName || '';
    this.Token = auth.Token || '';
    this.Role = auth.Role || '';
  }
}
