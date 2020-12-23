import React, { Component } from 'react';

import Api from './services/Api';
import './App.css';

import { AppContext } from './services/AppContext';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './views/Home';
import Authenticate from './views/Authenticate';

class App extends Component {
	state = {
		api: null,
	};

	componentDidMount() {
		const api = new Api();
		/*const email = 'tvandervort@example.net';
		const password = 'password';*/

		this.setState({
			api,
		});
	}

	render() {
		const { api } = this.state;
		if (!api) {
			return null;
		}
		return (
			<AppContext.Provider
				value={{
					api,
				}}
			>
				<Router>
					<Switch>
						<Route exact path="/auth" component={Authenticate} />
						<Route exact path="/" component={Home} />
					</Switch>
				</Router>
			</AppContext.Provider>
		);
	}
}

export default App;
