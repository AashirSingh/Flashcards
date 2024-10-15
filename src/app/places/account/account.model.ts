export class Account {
  constructor(
    public id: string, // Firebase Realtime Database key
    public userId: string, // Same as Firebase Authentication UID
    public firstName: string,
    public lastName: string,
    public email: string,
    public items: any[] = [], // An array of items associated with the user (optional)
    public role: string // 'user' or 'admin' (default 'user')
  ) {}
}