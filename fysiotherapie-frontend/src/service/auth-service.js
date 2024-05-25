export default class AuthService {
    async registerUser(registerData) {
        const fetchOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(registerData)
        }
        return await fetch("http://localhost:8080/auth/register/user", fetchOptions);
    }

    async registerAdmin(registerData) {
        const fetchOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(registerData)
        }
        return await fetch("http://localhost:8080/auth/register/admin", fetchOptions);
    }

    async login(loginData){
        const fetchOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(loginData)
        }
        return await fetch("http://localhost:8080/auth/login", fetchOptions);
    }

    async getRole() {
        const fetchOptions = {
            method: "GET",
            headers: {"Content-Type": "application/json", "Authorization": "Bearer " + sessionStorage.getItem("token")},
            credentials: 'include',
            exposedHeaders: ["Set-Cookie"]

        }
        return await fetch("http://localhost:8080/auth/role", fetchOptions);
    }
}