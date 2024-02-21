
import { expect } from 'chai';
import request from 'request';

describe('category', () => {
    it('Get All category', (done) => {
        request.get('http://localhost:7800/category', (err, res, body) => {
            expect(res).to.have.property('body');
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('Add category', (done) => {
        request.post('http://localhost:7800/add_categoryData', (err, res, body) => {
            expect(res.statusCode).to.equal(302);
            expect(res).to.have.property('body');
            done();
        });
    });

    it('add category page', (done) => {
        request.get('http://localhost:7800/category_Add', (err, res, body) => {
            expect(res.statusCode).to.equal(200);
            expect(res).to.have.property('body');
            done();
        });
    });

    it('Delete category', (done) => {
        request.get('http://localhost:7800/delete_category', (err, res, body) => {
            expect(res.statusCode).to.equal(200);
            expect(res).to.have.property('body');
            done();
        });
    });

    it('editpage category', (done) => {
        request.get('http://localhost:7800/edit_category', (err, res, body) => {
            expect(res.statusCode).to.equal(200);
            expect(res).to.have.property('body');
            done();
        });
    });

    it('Update category', (done) => {
        request.post('http://localhost:7800/update_category', (err, res, body) => {
            expect(res.statusCode).to.equal(302);
            expect(res).to.have.property('body');
            done();
        });
    });
});