import { expect } from 'chai';
import request from 'request';

describe('user', () => {
    it('register page', () => {
        request.get('http://localhost:7800/register', async (err, res, body) => {
            if (err) {
                console.log(err)
            }
            else {
                await expect(res.statusCode).to.equal(200);
                await expect(res).to.have.property(body);
            }
        });
    });

    it('Add user', () => {
        request.post('http://localhost:7800/userdata', async (err, res, body) => {
            if (err) {
                console.log(err)
            }
            else {
                await expect(res.statusCode).to.equal(302);
                await expect(res).to.have.property(body);
            }
        });
    });

    it('login page', () => {
        request.get('http://localhost:7800/login', async (err, res, body) => {
            if (err) {
                console.log(err)
            }
            else {
                await expect(res.statusCode).to.equal(200);
                await expect(res).to.have.property(body);
            }
        });
    });

    it('login user', () => {
        request.post('http://localhost:7800/logindata', async (err, res, body) => {
            if (err) {
                console.log(err)
            }
            else {
                await expect(res.statusCode).to.equal(302);
                await expect(res).to.have.property(body);
            }
        });
    });

    it('forgot password ', () => {
        request.get('http://localhost:7800/forgot_password', async (err, res, body) => {
            if (err) {
                console.log(err)
            }
            else {
                await expect(res.statusCode).to.equal(200);
                await expect(res).to.have.property(body);
            }
        });
    });

    it('email address user', () => {
        request.post('http://localhost:7800/email_address', async (err, res, body) => {
            if (err) {
                console.log(err)
            }
            else {
                await expect(res.statusCode).to.equal(302);
                await expect(res).to.have.property(body);
            }
        });
    });

    it('otp page', () => {
        request.get('http://localhost:7800/getOtp', async (err, res, body) => {
            if (err) {
                console.log(err)
            }
            else {
                await expect(res.statusCode).to.equal(200);
                await expect(res).to.have.property(body);
            }
        });
    });

    it('otp check', () => {
        request.post('http://localhost:7800/otpdata', async (err, res, body) => {
            if (err) {
                console.log(err)
            }
            else {
                await expect(res.statusCode).to.equal(302);
                await expect(res).to.have.property(body);
            }
        });
    });

    it('new password page', () => {
        request.get('http://localhost:7800/change_password', async (err, res, body) => {
            if (err) {
                console.log(err)
            }
            else {
                await expect(res.statusCode).to.equal(200);
                await expect(res).to.have.property(body);
            }
        });
    });

    it('password change', () => {
        request.post('http://localhost:7800/new_password', async (err, res, body) => {
            if (err) {
                console.log(err)
            }
            else {
                await expect(res.statusCode).to.equal(302);
                await expect(res).to.have.property(body);
            }
        });
    });

    it('logout', () => {
        request.get('http://localhost:7800/logout', async (err, res, body) => {
            if (err) {
                console.log(err)
            }
            else {
                await expect(res.statusCode).to.equal(200);
                await expect(res).to.have.property(body);
            }
        });
    });

    it('new user page', () => {
        request.get('http://localhost:7800/newUser', async (err, res, body) => {
            if (err) {
                console.log(err)
            }
            else {
                await expect(res.statusCode).to.equal(200);
                await expect(res).to.have.property(body);
            }
        });
    });

    it('new user add', () => {
        request.post('http://localhost:7800/newUserdata', async (err, res, body) => {
            if (err) {
                console.log(err)
            }
            else {
                await expect(res.statusCode).to.equal(302);
                await expect(res).to.have.property(body);
            }
        });
    });
});