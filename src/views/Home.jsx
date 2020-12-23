import { Component } from 'react';
import { AppContext } from '../services/AppContext';
import styles from './Home.module.css';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default class Home extends Component {
	static contextType = AppContext;

	/* TODO
        1.  Me Card
        2. Jobs Card

    */

	state = {
		me: null,
		jobs: [],
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
		if (localStorage.getItem('jobs')) {
			this.setState({
				jobs: JSON.parse(localStorage.getItem('jobs')),
			});

			return;
		}
		api.getJobs()
			.then((jobs) => {
				localStorage.setItem('jobs', JSON.stringify(jobs));
				this.setState({
					jobs,
				});
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

function Map({ jobs }) {
	if (!jobs || !jobs.length) {
		return <section className={styles['map-section']}></section>;
	}
    
    const {latitude, longitude} = averageGeolocation(jobs);

	return (
		<section className={styles['map-section']}>
			<MapContainer
				zoom={3}
				center={[latitude, longitude]}
				className={styles['map-container']}
			>
				<TileLayer
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{jobs.map((job) => {
					const {
						latitude,
						longitude,
						description,
						title,
						status,
						date,
						assigned_to,
					} = job;
					return (
						<Marker position={[latitude, longitude]}>
							<Popup>
								<div className={styles['marker']}>
									<div>
										<h4>Title</h4>
										<p>{title}</p>
									</div>
									<div>
										<h4>Description</h4>
										<p>{description}</p>
									</div>
                                    <div>
										<h4>Status</h4>
										<p className={styles['status']}>{status}</p>
									</div>
                                    <div>
										<h4>Assigned To</h4>
										<p>{assigned_to}</p>
									</div>
                                    <div>
										<h4>Date</h4>
										<p>{date}</p>
									</div>
								</div>
							</Popup>
						</Marker>
					);
				})}
			</MapContainer>
		</section>
	);
}

function averageGeolocation(coords) {
    if (coords.length === 1) {
      return coords[0];
    }
  
    let x = 0.0;
    let y = 0.0;
    let z = 0.0;
  
    for (let coord of coords) {
      let latitude = coord.latitude * Math.PI / 180;
      let longitude = coord.longitude * Math.PI / 180;
  
      x += Math.cos(latitude) * Math.cos(longitude);
      y += Math.cos(latitude) * Math.sin(longitude);
      z += Math.sin(latitude);
    }
  
    let total = coords.length;
  
    x = x / total;
    y = y / total;
    z = z / total;
  
    let centralLongitude = Math.atan2(y, x);
    let centralSquareRoot = Math.sqrt(x * x + y * y);
    let centralLatitude = Math.atan2(z, centralSquareRoot);
  
    return {
      latitude: centralLatitude * 180 / Math.PI,
      longitude: centralLongitude * 180 / Math.PI
    };
  }