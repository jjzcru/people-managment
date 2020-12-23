export default class Api {
    constructor() {
        this.host = 'https://coding-test.rootstack.net';
    }
	getJobs() {
		return new Promise({});
	}

	getMe() {
		return new Promise({});
	}

    authenticate({email, password}) {
		return new Promise(async (resolve, reject) => {
            try {
                const formData = new FormData();
                formData.append('email', email);
                formData.append('password', password);
                const response = await fetch(`${this.host}/api/auth/login`, {
                    method: 'post',
                    body: formData,
                    mode: 'cors',
                    redirect: "follow",
                    referrer: "no-referrer",
                    headers: {
                        'Accept': '*/*',
                    }
                })
                const data = await response.json();
                resolve(data);
            } catch(e) {
                reject(e);
            }
        });
	}
}
