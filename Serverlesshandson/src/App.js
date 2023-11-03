import React from 'react';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';

import ApiGet from './ApiGet';
import ApiPost from './ApiPost';
import awsLogo from './aws-logo.png';
import './App.css';

Amplify.configure(awsconfig);

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>AWS Serverless Handson</h1>
          <p>Built using AWS Amplify</p>
        </header>
        <section className="App-section">
          <h2>GET method</h2>
          <ApiGet />
        </section>
        <section className="App-section">
          <h2>POST method</h2>
          <ApiPost />
        </section>
        <footer className="App-footer">
          <p>Powered by
            <a href="https://aws.amazon.com/" target="blank">
              <img className="aws-logo" src={awsLogo} alt="AWS" />
            </a>
          </p>
        </footer>
      </div>
    );
  }
}

export default App;
