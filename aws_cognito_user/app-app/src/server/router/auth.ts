import { createRouter } from '@trpc/server';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

export const authRouter = createRouter().mutation('signin', {
  input: z.object({
    username: z.string(),
    password: z.string(),
  }),
  async resolve({ input }) {
    const { username, password } = input;
    const cognito = new CognitoIdentityServiceProvider({
      region: 'your_region',
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
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  },
});
