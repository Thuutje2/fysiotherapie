import bcrypt from "bcryptjs"; // Import from bcryptjs instead of bcrypt
import {mockUsers} from "../assets/mockUsers.js"; // Import mockUsers from mockUsers.js
import AuthService from "./auth-service.js";

export default class LoginService {

    async authenticateUser(email, password) {
        const user = mockUsers.find(
            (user) => user.username === email
        );

        if (user && (await this.comparePasswords(password, user.hashedPassword))) {
            return AuthService.generateToken(user.role);
        } else {
            console.error("Authentication failed");
            throw new Error("Authentication failed");
        }
    }

    async comparePasswords(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }

}