import { Component } from 'react';
import { AppContext } from '../services/AppContext';
import styles from './Authenticate.module.css';

export default class Authenticate extends Component {
    static contextType = AppContext;

	state = {
		email: '',
		password: '',
    };
    
	componentDidMount() {
        if(this.isAuthenticated()) {
            window.location.href = '/';
        }
	}

	isAuthenticated = () => {
		return !!localStorage.getItem('token');
    };
    
    onSubmit = (e) => {
        e.preventDefault();

        const {api} = this.context;
        const {email, password} = this.state;
        
        api.authenticate({email, password})
            .then((data) => {
                const {error, access_token} = data;
                if(error) {
                    alert(error);
                    return;
                }

                localStorage.setItem('token', access_token);
                window.location.href = '/';
            }) 
            .catch((e) => {
                alert(e.message);
            })
    }

	render() {
		const { email, password } = this.state;

		const isValidInput = !!email && !!password && isValidEmail(email);

		const submitButton = isValidInput ? (
			<button type={'submit'}>Login</button>
		) : (
			<button disabled>Login</button>
		);

		return (
			<main className={styles['container']}>
				<form onSubmit={this.onSubmit}>
					<div>
						<label htmlFor={'email'}>Email</label>
						<input
							type={'email'}
							name={'email'}
							value={email}
							onChange={(e) => {
								this.setState({ email: e.target.value });
							}}
						/>
						<label htmlFor={'password'}>Password</label>
						<input
							type={'password'}
							name={'password'}
							value={password}
							onChange={(e) => {
								this.setState({ password: e.target.value });
							}}
						/>
					</div>
					<div>{submitButton}</div>
				</form>
			</main>
		);
	}
}

function isValidEmail(email) {
	// eslint-disable-next-line no-useless-escape
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}
