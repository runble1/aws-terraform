import React from 'react';
import {API} from 'aws-amplify';
import * as config from './config';

class ApiGet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: false,
      artist  : '',
      response: '',
      data    : [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      artist: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      disabled: true,
      response: ''
    });

    const path = config.basePath + '/' + this.state.artist;
    const init = {};

    API.get(config.apiName, path, init)
      .then(response => {
        console.log(response);
        this.setState({
          disabled: false,
          response: JSON.stringify(response, null, 2),
          data: response
        });
      })
      .catch(error => {
        alert('Error!');
        console.log(error);
        this.setState({
          disabled: false,
          response: error,
          data: []
        });
      });
  }

  render() {
    return (
      <div className="ApiGet">
        <form onSubmit={this.handleSubmit}>
          <label>
            <div className="label">Artist:</div>
            <input className="textbox" type="text" disabled={this.state.disabled} value={this.state.artist} onChange={this.handleChange} />
          </label>
          <input className="button" type="submit" disabled={this.state.disabled} value="GET" />
          <label>
            <div className="label">Response:</div>
            <textarea className="textbox" rows="9" readOnly disabled={this.state.disabled} value={this.state.response} />
          </label>
        </form>
        <Table data={this.state.data} />
      </div>
    );
  }
}

class Table extends React.Component {
  render() {
    return (
      <div className="Table">
        <table className="table">
          <thead>
            <tr>
              <th className="table-header">Artist</th>
              <th className="table-header">Title</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.data.map((item) => (
                <tr>
                  <td className="table-data">
                    {item.Artist}
                  </td>
                  <td className="table-data">
                    {item.Title}
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    );
  }
}

export default ApiGet;
