export default class DataService {
    async _request({ path, method = 'GET', isFile = false, body = null }){
        let url = `http://localhost:8080/physiotherapists/physiotherapist/${path}`;
        let options = {
            method: method,
            headers: {

            },
        }

        try {
            const response = await fetch(url, options);

            if (body) {
                if (isFile) {
                    delete options.headers['Content-Type']; // Let the browser set the correct boundary for multipart/form-data
                    options.body = body;
                } else {
                    options.headers['Content-Type'] = 'application/json';
                    options.body = JSON.stringify(body);
                }
            }

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error; // Rethrow the error for further handling
        }
    }

    async getJsonDataPoints() {
        const data = await this._request({
            path: '/physiotherapist/getjsondata'
        })
    }

    async fileUpload(file) {
        const data = await this._request({
            path: 'physiotherapist/fileupload',
            method: 'POST',
            isFile: true,
            body: file,
        })
    }
}