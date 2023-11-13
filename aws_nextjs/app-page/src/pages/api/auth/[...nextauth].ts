import NextAuth from "next-auth";
import { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { CognitoIdentityProviderClient, AdminInitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";

// CustomSession 型の定義
interface CustomSession extends Session {
  idToken?: string;
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Cognito',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password:  { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        // credentials が undefined の場合は、早期に処理を終了する
        if (!credentials) {
          return null;
        }

        const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
        const command = new AdminInitiateAuthCommand({
          AuthFlow: 'USER_PASSWORD_AUTH',
          ClientId: process.env.COGNITO_CLIENT_ID  as string,
          UserPoolId: process.env.COGNITO_USER_POOL_ID as string,
          AuthParameters: {
            USERNAME: credentials.username,
            PASSWORD: credentials.password,
          },
        });
      
        const params = {
          AuthFlow: 'USER_PASSWORD_AUTH',
          ClientId: process.env.COGNITO_CLIENT_ID as string, // 型アサーションを使用
          UserPoolId: process.env.COGNITO_USER_POOL_ID as string, // 型アサーションを使用
          AuthParameters: {
            USERNAME: credentials.username,
            PASSWORD: credentials.password,
          },
        };
      
        try {
          const data = await client.send(command);
          if (data.AuthenticationResult && data.AuthenticationResult.IdToken) {
            // AWS Cognito からの応答を処理してユーザー情報を取得
            return {
              id: data.AuthenticationResult.IdToken, // IdToken が存在することを確認
              email: credentials.username
            };
          } else {
            return null; // 認証に失敗した場合は null を返す
          }
        } catch (error) {
          return null; // エラーが発生した場合も null を返す
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.idToken = user.id;
        token.email = user.email;
      }
      return token;
    },
    session: async ({ session, token }) => {
      const customSession: CustomSession = session  as CustomSession;
      customSession.idToken = token.idToken as string | undefined;
      return customSession;
    },
  },
  events: {
    signIn: async ({ user, account, profile, isNewUser }) => {
      // ここで認証成功後の処理を記述
      console.log("認証成功:", user);
      // 必要に応じてデータベースにユーザー情報を保存したり、他の処理を行う
    }
  }
});
