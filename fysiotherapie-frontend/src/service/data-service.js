export default class DataService {
    async _request({ path, method = 'GET', isFile = false, body = null }){
        let url = `http://localhost:8080/physiotherapists/physiotherapist/${path}`;
        let options = {
            method: method,
            headers: {
            },
            body:body
        }

        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            console.log(response.json())

            // return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error; // Rethrow the error for further handling
        }
    }

    async getJsonDataPoints() {
        const data = await this._request({
            path: '/getjsondata'
        })
    }

    async fileUpload(file) {
        const data = await this._request({
            path: 'fileupload',
            method: 'POST',
            isFile: true,
            body: file,
        })
    }
}