import {USER_ROLE, ADMIN_ROLE} from "../assets/userRoles.js";

const jwtSessionStoreKey = "jwtToken";
export default class AuthService {
    // Basically only removes the token from sessionstorage, but in turn blocks the user from seeing protected content.
    logout() {
        sessionStorage.removeItem(jwtSessionStoreKey);
        AuthService.handleNavbarVisibility(); // hides navbar after logging out
    }

    // Only shows navbar when user is logged in
    static handleNavbarVisibility() {
        const sidebar = document.querySelector("sidebar-component");

        console.log(sidebar)

        if(this.isLoggedIn()) {
            sidebar.style.display = 'visible'
        }

        // if (sidebar) {
        //     sidebar._isLoggedIn = AuthService.isLoggedIn(); // Directly set visibility based on logged-in status
        //     sidebar._isAdmin = this.isAdmin(); // Update the property to show admin links
        //     sidebar._isUser = this.isUser(); // Update the property to show patient links
        // }
    }

    static isAdmin() {
        return this.getUserRole() === ADMIN_ROLE;
    }

    static isUser() {
        return this.getUserRole() === USER_ROLE;
    }

    static getUserRole() {
        // Assuming the JWT token's first part is the role
        const jwtToken = sessionStorage.getItem(jwtSessionStoreKey);
        return jwtToken ? jwtToken.split('.')[0] : null;
    }

    static generateToken(role) {
        const prefix = role === "admin" ? ADMIN_ROLE : USER_ROLE;
        console.log(`${prefix}.token.${Date.now().toString()}`)
        return `${prefix}.token.${Date.now().toString()}`;
    }

    // method that verifies if a user is "logged in" (if there is a token in sessionstorage)
    static isLoggedIn() {
        return Boolean(sessionStorage.getItem(jwtSessionStoreKey));
    }
}