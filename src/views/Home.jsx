import { Component, useState, useEffect } from 'react';
import { AppContext } from '../services/AppContext';
import styles from './Home.module.css';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default class Home extends Component {
	static contextType = AppContext;

	state = {
		me: null,
		jobs: [],
		selectedJob: null,
	};

	componentDidMount() {
		console.clear();
		if (!this.isAuthenticated()) {
			window.location.href = '/auth';
		}

		this.getMe();
		this.getJobs();
	}

	onJobClick = (job) => {
		this.setState({
			selectedJob: job,
		});
	};

	getMe = () => {
		const { api } = this.context;
		api.getMe()
			.then((me) => {
				const { id } = me;
				if (!id) {
					localStorage.removeItem('token');
					localStorage.removeItem('jobs');
					window.location.href = '/auth';
					return;
				}
				this.setState({ me });
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
		const { me, jobs, selectedJob } = this.state;
		return (
			<div className={styles['container']}>
				<main>
					<div>
						<section className={styles['me-section']}>
							<Me me={me} />
						</section>
						<section className={styles['jobs-section']}>
							<Jobs jobs={jobs} onJobClick={this.onJobClick} />
						</section>
					</div>
					<div>
						<Map jobs={jobs} job={selectedJob} />
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

function Jobs({ jobs, onJobClick }) {
	const [searchTitle, setSearchTitle] = useState('');
	const [searchAssign, setSearchAssign] = useState('');
	const [searchStatus, setSearchStatus] = useState('');
	const [filteredJobs, setFilteredJobs] = useState(jobs);

	useEffect(() => {
		let tempJobs = [...jobs];
		if (!!searchTitle) {
			tempJobs = tempJobs.filter((job) => {
				const { title } = job;
				return title.includes(searchTitle);
			});
		}
		if (!!searchAssign) {
			tempJobs = tempJobs.filter((job) => {
				const { assigned_to } = job;
				return assigned_to.includes(searchAssign);
			});
		}
		if (!!searchStatus) {
			tempJobs = tempJobs.filter((job) => {
				const { status } = job;
				return status.replace(' ', '-') === searchStatus;
			});
		}
		setFilteredJobs(tempJobs);
	}, [jobs, searchTitle, searchStatus, searchAssign]);

	if (!jobs || !jobs.length) {
		return <div></div>;
	}

	return (
		<div>
			<table>
				<thead>
					<tr>
						<th>Title</th>
						<th>Assigned To</th>
						<th>Status</th>
					</tr>
					<tr>
						<th>
							<input
								type={'text'}
								value={searchTitle}
								onChange={(e) => {
									setSearchTitle(e.target.value);
								}}
							/>
						</th>
						<th>
							<input
								type={'text'}
								value={searchAssign}
								onChange={(e) => {
									setSearchAssign(e.target.value);
								}}
							/>
						</th>
						<th>
							<select
								value={searchStatus}
								onChange={(e) => {
									console.log(e.target.value);
									setSearchStatus(e.target.value);
								}}
							>
								<option value={''}>All</option>
								<option value={'pending'}>Pending</option>
								<option value={'in-progress'}>
									In Progress
								</option>
								<option value={'complete'}>Complete</option>
							</select>
						</th>
					</tr>
				</thead>
				<tbody>
					{filteredJobs.map((job) => {
						const { id, title, status, assigned_to } = job;

						return (
							<tr
								key={id}
								onClick={() => {
									onJobClick(job);
								}}
							>
								<td>{title}</td>
								<td>{assigned_to}</td>
								<td
									className={
										styles[
											`job-${status.replace(' ', '-')}`
										]
									}
								>
									{status}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

function Map({ jobs, job }) {
	const [map, setMap] = useState(null);
	useEffect(() => {
		if (job) {
			const { latitude, longitude } = job;
			map.setView({ lat: latitude, lng: longitude }, 5);
		}
	}, [job, map]);
	if (!jobs || !jobs.length) {
		return <section className={styles['map-section']}></section>;
	}
	let latitude, longitude;
	let zoom;

	if (!job) {
		zoom = 3;
		const averageLocation = averageGeolocation(jobs);
		latitude = averageLocation.latitude;
		longitude = averageLocation.longitude;
	}

	return (
		<section className={styles['map-section']}>
			<MapContainer
				zoom={zoom}
				center={[latitude, longitude]}
				className={styles['map-container']}
				whenCreated={(map) => {
					setMap(map);
				}}
			>
				<TileLayer
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{jobs.map((job) => {
					const {
						id,
						latitude,
						longitude,
						description,
						title,
						status,
						date,
						assigned_to,
					} = job;
					return (
						<Marker key={id} position={[latitude, longitude]}>
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
										<p className={styles['status']}>
											{status}
										</p>
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
		let latitude = (coord.latitude * Math.PI) / 180;
		let longitude = (coord.longitude * Math.PI) / 180;

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
		latitude: (centralLatitude * 180) / Math.PI,
		longitude: (centralLongitude * 180) / Math.PI,
	};
}
