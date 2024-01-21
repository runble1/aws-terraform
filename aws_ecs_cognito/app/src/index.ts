import express from 'express';
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  jti?: string;
}

const app = express();
const port = process.env.PORT || 3000;

//const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || '';
//const COGNITO_USER_POOL_CLIENT_ID = process.env.COGNITO_USER_POOL_CLIENT_ID || '';

const COGNITO_USER_POOL_ID = 'ap-northeast-1_HZPdrZHbz'
const COGNITO_USER_POOL_CLIENT_ID = '6vfrv8npi2a90pm7hhsk4g1did'

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

app.use(express.json());

app.post('/authenticate', async (req, res) => {
  try {
    const { username, password } = req.body;
    const idToken = await authenticateUser(username, password);
    const decodedToken = decodeToken(idToken);
    const jti = decodedToken.jti;
    
    res.json({ jti });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
