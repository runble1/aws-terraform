import { NextResponse } from 'next/server';

export async function GET() {
  console.log("Healthcheck route accessed");
  console.log("Error");
  console.error('Error: ヘルスチェックへのアクセス時にエラーが発生しました。');
  return NextResponse.json({ status: 'ok' });
}