import {ROLE_ADMIN, ROLE_USER} from "../assets/userRoles.js";
export default class AuthService {
    static async registerUser(registerData) {
        const fetchOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(registerData)
        }
        return await fetch("http://localhost:8080/auth/register/user", fetchOptions);
    }

    static async registerAdmin(registerData) {
        const fetchOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(registerData)
        }
        return await fetch("http://localhost:8080/auth/register/admin", fetchOptions);
    }

    static async login(loginData){
        debugger;
        const fetchOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginData)
        };
        const response = await fetch("http://localhost:8080/auth/login", fetchOptions)
        if (response.ok) {
            const data = await response.json();
            if (data.token && data.token.startsWith("Bearer ")) {
                this.saveToken(data.token);
                return { success: true };
            }
        } else if (response.status === 401) {
            return { success: false, error: "Er is geen account gevonden met dit e-mail en/of wachtwoord" };
        } else {
            return { success: false, error: "Inloggen mislukt" };
        }
    }

    static async logout(){
        const fetchOptions = {
            method: "POST",
            headers: {"Authorization": "Bearer " + sessionStorage.getItem("myToken")},
        }
        const response = await fetch("http://localhost:8080/auth/logout", fetchOptions);
        if (response.ok) {
            this.removeToken();
            return { success: true }
        }
        else {
            const errorText = await response.text();
            return { success: false, error: errorText || "Logout failed" }
        }
    }

    static saveToken(token) {
        sessionStorage.setItem("myToken", token);
    }

    static removeToken() {
        sessionStorage.removeItem("myToken");
        sessionStorage.removeItem("myRole");
    }

    static async getRole() {
        const fetchOptions = {
            method: "GET",
            headers: {"Content-Type": "application/json", "Authorization": "Bearer " + sessionStorage.getItem("myToken")},
        }
        const response = await fetch("http://localhost:8080/auth/role", fetchOptions);
        if (response.status === 200) {
            let role = await response.text();
            if (role === "ROLE_USER") {
                role = ROLE_USER;
            }
            if (role === "ROLE_ADMIN") {
                role = ROLE_ADMIN;
            }
            this.saveRole(role)
            return role;
        }
        else {
            return null;
        }
    }

    static saveRole(role) {
        sessionStorage.setItem("myRole", role);
    }

    static getSavedRole() {
        return sessionStorage.getItem("myRole");
    }

    static isUser() {
        return this.getSavedRole() === ROLE_USER;
    }

    static isAdmin() {
        return this.getSavedRole() === ROLE_ADMIN;
    }

    static isLoggedIn() {
        return Boolean(sessionStorage.getItem("myToken"));
    }
}