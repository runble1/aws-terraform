import { NextResponse } from 'next/server';

export async function GET() {
  console.log("Healthcheck route accessed");
  console.log("Error");
  console.error('Error: ヘルスチェックへのアクセス時にエラーが発生しました。');

  const logData = {
    event: "UserLogin",
    username: "exampleUser",
    timestamp: new Date().toISOString()
  };

  // console.logを使用してJSON形式でログ出力
  console.log(JSON.stringify(logData));

  

  return NextResponse.json({ status: 'ok' });
}
