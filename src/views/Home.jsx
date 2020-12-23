import { Component } from 'react';
import { AppContext } from '../services/AppContext';
import styles from './Home.module.css';

export default class Home extends Component {
	static contextType = AppContext;

	/* TODO
        1.  Me Card
        2. Jobs Card

    */

	state = {
        me: null,
        jobs: []
	};

	componentDidMount() {
		console.clear();
		if (!this.isAuthenticated()) {
			window.location.href = '/auth';
		}

		this.getMe();
		this.getJobs();
	}

	getMe = () => {
		const { api } = this.context;
		api.getMe()
			.then((me) => {
				this.setState({ me });
				console.log(`ME`);
				console.log(me);
			})
			.catch(console.error);
	};

	getJobs = () => {
		const { api } = this.context;
		api.getJobs()
			.then((jobs) => {
                this.setState({
                    jobs
                })
			})
			.catch(console.error);
	};

	isAuthenticated = () => {
		return !!localStorage.getItem('token');
	};

	render() {
		const { me, jobs } = this.state;
		return (
			<div className={styles['container']}>
				<main>
					<div>
						<section className={styles['me-section']}>
							<Me me={me} />
						</section>
						<section className={styles['jobs-section']}>
							<div></div>
						</section>
					</div>
					<div>
						<Map jobs={jobs} />
					</div>
				</main>
			</div>
		);
	}
}

function Me({ me }) {
	if (!me) {
		return <div></div>;
	}
	const { id, name, email } = me;
	return (
		<div>
			<h1>User</h1>
			<div>
				<label htmlFor={'id'}>ID</label>
				<input name={'id'} disabled type={'text'} value={id} />
			</div>
			<div>
				<label htmlFor={'name'}>Name</label>
				<input name={'name'} disabled type={'text'} value={name} />
			</div>
			<div>
				<label htmlFor={'email'}>Email</label>
				<input disabled name={'email'} type={'email'} value={email} />
			</div>
		</div>
	);
}

function Map({jobs}) {
    console.log(`JOBS`);
    console.log(jobs);
    return <section className={styles['map-section']}></section>
}