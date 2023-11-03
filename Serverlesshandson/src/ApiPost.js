import React from 'react';
import {API} from 'aws-amplify';
import * as config from './config';

class ApiPost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: false,
      artist  : '',
      title   : '',
      response: '',
    };

    this.handleChangeArtist = this.handleChangeArtist.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeArtist(event) {
    this.setState({
      artist: event.target.value
    });
  }

  handleChangeTitle(event) {
    this.setState({
      title: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      disabled: true,
      response: ''
    });

    const path = config.basePath;
    const init = {
      body: {
        Artist: this.state.artist,
        Title: this.state.title
      },
    };

    API.post(config.apiName, path, init)
      .then(response => {
        console.log(response);
        this.setState({
          disabled: false,
          response: JSON.stringify(response, null, 2)
        });
      })
      .catch(error => {
        alert('Error!');
        console.log(error);
        this.setState({
          disabled: false,
          response: error
        });
      });
  }

  render() {
    return (
      <div className="ApiPost">
        <form onSubmit={this.handleSubmit}>
          <label>
            <div className="label">Artist:</div>
            <input className="textbox" type="text" disabled={this.state.disabled} value={this.state.artist} onChange={this.handleChangeArtist} />
          </label>
          <label>
            <div className="label">Title:</div>
            <input className="textbox" type="text" disabled={this.state.disabled} value={this.state.title} onChange={this.handleChangeTitle} />
          </label>
          <input className="button" type="submit" disabled={this.state.disabled} value="POST" />
          <label>
            <div className="label">Response:</div>
            <textarea className="textbox" rows="9" readOnly disabled={this.state.disabled} value={this.state.response} />
          </label>
        </form>
      </div>
    );
  }
}

export default ApiPost;
