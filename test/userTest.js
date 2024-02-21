import { expect } from 'chai';
import request from 'request';

describe('user', () => {
    it('register page', (done) => {
        request.get('http://localhost:7800/register', (err, res, body) => {
            if (err) {
                done(err)
            }
            else {
                expect(res.statusCode).to.equal(200);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('Add user', (done) => {
        request.post('http://localhost:7800/userdata', (err, res, body) => {
            if (err) {
                done(err)
            }
            else {
                expect(res.statusCode).to.equal(302);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('login page', (done) => {
        request.get('http://localhost:7800/login', (err, res, body) => {
            if (err) {
                done(err)
            }
            else {
                expect(res.statusCode).to.equal(200);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('login user', (done) => {
        request.post('http://localhost:7800/logindata', (err, res, body) => {
            if (err) {
                done(err)
            }
            else {
                expect(res.statusCode).to.equal(302);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('forgot password ', (done) => {
        request.get('http://localhost:7800/forgot_password', (err, res, body) => {
            if (err) {
                done(err)
            }
            else {
                expect(res.statusCode).to.equal(200);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('email address user', (done) => {
        request.post('http://localhost:7800/email_address', (err, res, body) => {
            if (err) {
                done(err)
            }
            else {
                expect(res.statusCode).to.equal(302);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('otp page', (done) => {
        request.get('http://localhost:7800/getOtp', (err, res, body) => {
            if (err) {
                done(err)
            }
            else {
                expect(res.statusCode).to.equal(200);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('otp check', (done) => {
        request.post('http://localhost:7800/otpdata', (err, res, body) => {
            if (err) {
                done(err)
            }
            else {
                expect(res.statusCode).to.equal(302);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('new password page', (done) => {
        request.get('http://localhost:7800/change_password', (err, res, body) => {
            if (err) {
                done(err)
            }
            else {
                expect(res.statusCode).to.equal(200);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('password change', (done) => {
        request.post('http://localhost:7800/new_password', (err, res, body) => {
            if (err) {
                done(err)
            }
            else {
                expect(res.statusCode).to.equal(302);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('logout', (done) => {
        request.get('http://localhost:7800/logout', (err, res, body) => {
            if (err) {
                done(err)
            }
            else {
                expect(res.statusCode).to.equal(200);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('new user page', (done) => {
        request.get('http://localhost:7800/newUser', (err, res, body) => {
            if (err) {
                done(err)
            }
            else {
                expect(res.statusCode).to.equal(200);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('new user add', (done) => {
        request.post('http://localhost:7800/newUserdata', (err, res, body) => {
            if (err) {
                done(err)
            }
            else { 
                expect(res.statusCode).to.equal(302);
                expect(res).to.have.property('body');
                done();
            }
        });
    });
});