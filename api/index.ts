import Axios, { Method } from 'axios';

/**
 * The class for api errors.
 */
export class APIError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'APIError';
    }
}

/**
 * The api class.
 */
export default new class API {
    /**
     * Send a request to the api.
     * @param {object} param0 The request data.
     */
    async request({ endpoint, method, body, headers }: {
      endpoint: string;
      method: Method;
      body?: object;
      headers?: object;
    }) {
        try {
            const baseUrl = process.env.BACKEND_URL;

            const { data } = await Axios({
                url: `${baseUrl}${endpoint}`,
                method,
                data: body ? body: null,
                headers: headers ? headers : null,
                withCredentials: true,
            });

            return data;
        } catch (err) {
            err = err.response.data.error;

            throw new APIError(
                `${err.charAt(0).toUpperCase() + err.slice(1)}.`
            );
        }
    }

    /**
     * Get a testimonial from a user.
     */
    async getTestimonial() {
        return await this.request({
            endpoint: '/users/testimonial',
            method: 'GET',
        });
    }

    /**
     * Send a login request.
     * @param {string} username The user's username.
     * @param {string} password The user's password.
     */
    async login(username: string, password: string) {
        return await this.request({
            endpoint: '/auth/login',
            method: 'POST',
            body: {
                username,
                password,
            },
        });
    }

    /**
     * Send a register request.
     * @param {string} username The user's username
     * @param {string} password The user's password.
     * @param {string} email The email to register with.
     * @param {string} invite The invite to register with.
     */
    async register(username: string, password: string, email: string, invite: string) {
        return await this.request({
            endpoint: '/auth/register',
            method: 'POST',
            body: {
                username,
                password,
                email,
                invite,
            },
        });
    }

    /**
     * Send a password reset email to a user.
     * @param {string} email The email to send a reset to.
     */
    async resetPassword(email: string) {
        return await this.request({
            endpoint: '/auth/password_resets/send',
            method: 'POST',
            body: {
                email,
            },
        });
    }
};
