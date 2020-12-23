import { Component } from 'react';

export default class Home extends Component {
    componentDidMount() {
        if(!this.isAuthenticated()) {
            window.location.href = '/auth';
        }
    }

    isAuthenticated = () => {
        return !!localStorage.getItem('token')
    }

	render() {
		return <div>Home</div>;
	}
}
