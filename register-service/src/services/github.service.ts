import axios from 'axios';
import { GitHubUser } from '../types/user';

export class GitHubService {
    private readonly clientId: string;
    private readonly clientSecret: string;

    constructor() {
        this.clientId = process.env.GITHUB_CLIENT_ID || '';
        this.clientSecret = process.env.GITHUB_CLIENT_SECRET || '';
    }

    getAuthUrl(): string {
        const redirectUri = process.env.GITHUB_REDIRECT_URI;
        return `https://github.com/login/oauth/authorize?client_id=${this.clientId}&redirect_uri=${redirectUri}&scope=user:email`;
    }

    async getAccessToken(code: string): Promise<string> {
        const response = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            code: code,
        }, {
            headers: { Accept: 'application/json' }
        });

        return response.data.access_token;
    }

    async getUserData(accessToken: string): Promise<GitHubUser> {
        const response = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        return response.data;
    }

    async getUserEmail(accessToken: string): Promise<string> {
        const response = await axios.get('https://api.github.com/user/emails', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const primaryEmail = response.data.find((email: any) => email.primary);
        return primaryEmail?.email || '';
    }
}
