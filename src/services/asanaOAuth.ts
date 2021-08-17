//@ts-ignore
import Asana from 'asana';
import { IToken } from '../types/auth';
import { IUser } from '../types/user';
import { UserService } from './userService';
// import _ from 'lodash';

export class AsanaOAuth {
  static clientId = process.env.CLIENT_ID;
  static clientSecret = process.env.CLIENT_SECRET;
  static redirectURI = process.env.REDIRECT_URI;

  email: string;
  authClient;
  tokens: IToken = {};

  constructor(email: string) {
    this.email = email;
    this.authClient = Asana.Client.create({
      clientId: AsanaOAuth.clientId,
      clientSecret: AsanaOAuth.clientSecret,
      redirectUri: AsanaOAuth.redirectURI,
    });
  }

  onChangedTokens = (tokens: IToken): void => {
    if (tokens.refresh_token) {
      // store the refresh_token in my database!
      const userService = new UserService();
      userService.update(this.email, { refresh_token: tokens.refresh_token });
    }
    this.tokens = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  };

  getOAuthUri = (): string => {
    return `${this.authClient.app.asanaAuthorizeUrl()}&state=${this.email}`;
  };

  getOAuthTokenFromCode = async (authorizationCode: string): Promise<IToken> => {
    return new Promise((resolve, reject) => {
      this.authClient.app
        .accessTokenFromCode(authorizationCode)
        .then((credentials: IToken) => {
          resolve(credentials);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };

  setToken = (token: IToken): void => {
    this.authClient.useOauth({ credentials: token, refreshCredentialsCallback: this.onChangedTokens });
  };

  getUser = async (): Promise<Pick<IUser, 'name' | 'email'>> => {
    const user = await this.authClient.users.me();
    return user;
  };
}
