import {
    CognitoUserPool,
    CognitoUser,
    AuthenticationDetails,
  } from 'amazon-cognito-identity-js';
import { Context, Callback } from 'aws-lambda';
import * as crypto from 'crypto';

  
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || '';
const COGNITO_USER_POOL_CLIENT_ID = process.env.COGNITO_USER_POOL_CLIENT_ID || '';
const COGNITO_CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET || ''; // クライアントシークレットの環境変数

//if (!COGNITO_USER_POOL_ID || !COGNITO_USER_POOL_CLIENT_ID || !COGNITO_CLIENT_SECRET) {
if (!COGNITO_USER_POOL_ID || !COGNITO_USER_POOL_CLIENT_ID) {
    throw new Error('Cognito User Pool ID, Client ID, and Client Secret must be set in environment variables');
}

function generateSecretHash(username: string): string {
    return crypto.createHmac('SHA256', COGNITO_CLIENT_SECRET)
                 .update(username + COGNITO_USER_POOL_CLIENT_ID)
                 .digest('base64');
}

async function authenticateUser(username: string, password: string) {
    const secretHash = generateSecretHash(username);
    const poolData = {
      UserPoolId: COGNITO_USER_POOL_ID,
      ClientId: COGNITO_USER_POOL_CLIENT_ID
    };
  
    const userPool = new CognitoUserPool(poolData);
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
          onSuccess: resolve,
          onFailure: reject,
          newPasswordRequired: () => {
            reject(new Error('New password required'));
          }
        });
      });
    }
  
  export const handler = async (event: any, context: any): Promise<any> => {
    try {
      // ここでusernameとpasswordはeventから取得するか、固定値を使用する
      const username = 'test1';
      const password = '123456789tT!';
  
      const authResult = await authenticateUser(username, password);
  
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authResult),
      };
    } catch (error) {
      return {
        statusCode: error.statusCode || 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: error.message }),
      };
    }
};
  