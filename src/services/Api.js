export default class Api {
	constructor() {
		this.host = 'https://coding-test.rootstack.net';
	}
	getJobs() {
		return new Promise(async (resolve, reject) => {
			try {
				const token = localStorage.getItem('token');
				const response = await fetch(`${this.host}/api/jobs`, {
					method: 'get',
					mode: 'cors',
					redirect: 'follow',
					referrer: 'no-referrer',
					headers: {
						Accept: '*/*',
						Authorization: `bearer ${token}`,
					},
				});
				const { last_page } = await response.json();
				if (!last_page) {
					reject(new Error('INVALID_TOKEN'));
					return;
				}

				resolve(await this.getJobsFromAllThePages(last_page));
			} catch (e) {
				reject(e);
			}
		});
	}

	getJobsFromAllThePages = async (totalOfPages) => {
		const jobs = [];
		const promises = [];
		for (let i = 1; i <= totalOfPages; i++) {
			promises.push(
				new Promise(async (resolve, reject) => {
					try {
                        const jobsFromPage = await this.getJobsByPage(i);
                        for(const job of jobsFromPage) {
                            jobs.push(job);
                        }
						resolve();
					} catch (e) {
						reject(e);
					}
				})
			);
		}

		await Promise.all(promises);
		return jobs;
	};

	getJobsByPage(page) {
		return new Promise(async (resolve, reject) => {
			try {
				const token = localStorage.getItem('token');
				const response = await fetch(
					`${this.host}/api/jobs?page=${page}`,
					{
						method: 'get',
						mode: 'cors',
						redirect: 'follow',
						referrer: 'no-referrer',
						headers: {
							Accept: '*/*',
							Authorization: `bearer ${token}`,
						},
					}
				);
				const { data } = await response.json();
				resolve(data);
			} catch (e) {
				reject(e);
			}
		});
	}

	getMe() {
		return new Promise(async (resolve, reject) => {
			try {
                const token = localStorage.getItem('token');
				const response = await fetch(`${this.host}/api/auth/me`, {
					method: 'get',
					mode: 'cors',
					redirect: 'follow',
					referrer: 'no-referrer',
					headers: {
						Accept: '*/*',
						Authorization: `bearer ${token}`,
					},
				});
				const data = await response.json();
				resolve(data);
			} catch (e) {
				reject(e);
			}
		});
	}

	authenticate({ email, password }) {
		return new Promise(async (resolve, reject) => {
			try {
				const formData = new FormData();
				formData.append('email', email);
				formData.append('password', password);
				const response = await fetch(`${this.host}/api/auth/login`, {
					method: 'post',
					body: formData,
					mode: 'cors',
					redirect: 'follow',
					referrer: 'no-referrer',
					headers: {
						Accept: '*/*',
					},
				});
				const data = await response.json();
				resolve(data);
			} catch (e) {
				reject(e);
			}
		});
	}
}
