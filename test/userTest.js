import { expect } from 'chai';
import request from 'request';

describe('user', () => {
    it('register page', (done) => {
        request.get('http://localhost:7500/register', (err, res, body) => {
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
        request.post('http://localhost:7500/userdata', (err, res, body) => {
            if (err) {
                done(err)
            }
            else {
                expect(res.statusCode).to.equal(500);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('login page', (done) => {
        request.get('http://localhost:7500/login', (err, res, body) => {
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
        request.post('http://localhost:7500/logindata', (err, res, body) => {
            if (err) {
                done(err)
            }
            else {
                expect(res.statusCode).to.equal(500);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('forgot password ', (done) => {
        request.get('http://localhost:7500/forgot_password', (err, res, body) => {
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
        request.post('http://localhost:7500/email_address', (err, res, body) => {
            if (err) {
                done(err)
            }
            else {
                expect(res.statusCode).to.equal(500);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('otp page', (done) => {
        request.get('http://localhost:7500/getOtp', (err, res, body) => {
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
        request.post('http://localhost:7500/otpdata', (err, res, body) => {
            if (err) {
                done(err)
            }
            else {
                expect(res.statusCode).to.equal(500);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('new password page', (done) => {
        request.get('http://localhost:7500/change_password', (err, res, body) => {
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
        request.post('http://localhost:7500/new_password', (err, res, body) => {
            if (err) {
                done(err)
            }
            else {
                expect(res.statusCode).to.equal(500);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('logout', (done) => {
        request.get('http://localhost:7500/logout', (err, res, body) => {
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
        request.get('http://localhost:7500/newUser', (err, res, body) => {
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
        request.post('http://localhost:7500/newUserdata', (err, res, body) => {
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