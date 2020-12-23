import { Component } from 'react';
import { AppContext } from '../services/AppContext';

export default class Home extends Component {
	static contextType = AppContext;

	state = {
		me: null,
	};

	componentDidMount() {
		console.clear();
		if (!this.isAuthenticated()) {
			window.location.href = '/auth';
		}

		this.getMe();
	}

	getMe = () => {
		const { api } = this.context;
		api.getMe()
			.then((me) => {
				const { id } = me;
				if (!id) {
					window.location.href = '/';
					return;
				}
				this.setState({ me });
			})
			.catch(console.error);
	};

	isAuthenticated = () => {
		return !!localStorage.getItem('token');
	};

	render() {
		return <div>Home</div>;
	}
}
