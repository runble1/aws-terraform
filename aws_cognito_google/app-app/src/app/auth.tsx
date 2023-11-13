import { withTRPC } from '@trpc/next';
import superjson from 'superjson';

const AppRouter = () => {
  // ここにアプリケーションのメインコンポーネントを配置します。
};

export default withTRPC({
  config({ ctx }) {
    // ここにTRPCの設定を記述します。
  },
  ssr: false,
  transformer: superjson,
})(AppRouter);
