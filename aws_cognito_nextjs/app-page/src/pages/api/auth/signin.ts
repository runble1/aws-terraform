import type { NextApiRequest, NextApiResponse } from 'next';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, password } = req.body;

  const cognito = new CognitoIdentityServiceProvider({
    region: 'your_region', // AWSリージョン
  });

  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: 'your_cognito_client_id',
    UserPoolId: 'your_cognito_user_pool_id',
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };

  try {
    const data = await cognito.adminInitiateAuth(params).promise();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Authentication failed', error });
  }
}
