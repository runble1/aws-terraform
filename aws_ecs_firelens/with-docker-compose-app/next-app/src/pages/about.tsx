// pages/about.tsx
import React from 'react';
import { GetServerSideProps } from 'next';

type Props = {};

const About: React.FC<Props> = () => {
    return (
        <div>
            <h1>About Page</h1>
            <p>This is the about page...</p>
        </div>
    );
};

export default About;

export const getServerSideProps: GetServerSideProps = async (context) => {
    // ログデータを作成
    const logData = {
        page: "About",
        method: context.req.method,
        path: context.req.url,
        timestamp: new Date().toISOString()
    };

    // コンソールにログ出力
    console.log(JSON.stringify(logData));

    // props を返す
    return { props: {} };
};
