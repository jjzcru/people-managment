import React, { Component } from 'react';
import Api from './services/Api';
import './App.css';

class App extends Component {
	state = {
		api: null,
	};
	componentDidMount() {
    console.clear();
		const api = new Api();
		const email = 'tvandervort@example.net';
		const password = 'password';

		api.authenticate({
			email,
			password,
		})
			.then(console.log)
			.catch(console.error);

		this.setState({
			api,
		});
	}
	render() {
		return <div>Hello world</div>;
	}
}

export default App;
