import {
    CognitoUserPool,
    CognitoUser,
    AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  jti?: string;  // nonceクレームはオプショナル
}
  
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || '';
const COGNITO_USER_POOL_CLIENT_ID = process.env.COGNITO_USER_POOL_CLIENT_ID || '';
const COGNITO_CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET || ''; // クライアントシークレットの環境変数

//if (!COGNITO_USER_POOL_ID || !COGNITO_USER_POOL_CLIENT_ID || !COGNITO_CLIENT_SECRET) {
if (!COGNITO_USER_POOL_ID || !COGNITO_USER_POOL_CLIENT_ID) {
    throw new Error('Cognito User Pool ID, Client ID, and Client Secret must be set in environment variables');
}

async function authenticateUser(username: string, password: string): Promise<string> {
  const userPool = new CognitoUserPool({
    UserPoolId: COGNITO_USER_POOL_ID,
    ClientId: COGNITO_USER_POOL_CLIENT_ID
  });

  const cognitoUser = new CognitoUser({
    Username: username,
    Pool: userPool
  });

  const authenticationDetails = new AuthenticationDetails({
    Username: username,
    Password: password
  });

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        const idToken = result.getIdToken().getJwtToken();
        resolve(idToken);
      },
      onFailure: (err) => {
        reject(err);
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        reject(new Error('New password required'));
      }
    });
  });
}

function decodeToken(idToken: string): DecodedToken {
  return jwtDecode(idToken);
}

export const handler = async (event: any, context: any): Promise<any> => {
  try {
    const username = 'test1';
    const password = '123456789tT!';

    const idToken = await authenticateUser(username, password);
    const decodedToken = decodeToken(idToken);
    const jti = decodedToken.jti;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jti }),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
  