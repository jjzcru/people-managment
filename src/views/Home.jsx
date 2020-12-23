import { Component } from 'react';
import { AppContext } from '../services/AppContext';

export default class Home extends Component {
	static contextType = AppContext;

	componentDidMount() {
        
        
		if (!this.isAuthenticated()) {
			window.location.href = '/auth';
		}
    }


	isAuthenticated = () => {
		return !!localStorage.getItem('token');
	};

	render() {
		return <div>Home</div>;
	}
}
