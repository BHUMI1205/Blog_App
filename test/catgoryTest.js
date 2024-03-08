import { expect } from 'chai';
import request from 'request';

describe('category', () => {
    it('Get All category', () => {
        request.get('http://localhost:7800/category', async (err, res, body) => {
            if (err) {
                console.log(err);
            }
            await expect(res).to.have.property(body);
            await expect(res.statusCode).to.equal(200);
        });
    });

    it('Add category', () => {
        request.post('http://localhost:7800/add_categoryData', async (err, res, body) => {
            if (err) {
                console.log(err);
            }
            await expect(res.statusCode).to.equal(302);
            await expect(res).to.have.property(body);
        });
    });

    it('add category page', () => {
        request.get('http://localhost:7800/category_Add', async (err, res, body) => {
            if (err) {
                console.log(err);
            }
            await expect(res.statusCode).to.equal(200);
            await expect(res).to.have.property(body);
        });
    });

    it('Delete category', () => {
        request.get('http://localhost:7800/delete_category', async (err, res, body) => {
            if (err) {
                console.log(err);
            }
            await expect(res.statusCode).to.equal(200);
            await expect(res).to.have.property(body);
        });
    });

    it('editpage category', () => {
        request.get('http://localhost:7800/edit_category', async (err, res, body) => {
            if (err) {
                console.log(err);
            }
            await expect(res.statusCode).to.equal(200);
            await expect(res).to.have.property(body);
        });
    });

    it('Update category', () => {
        request.post('http://localhost:7800/update_category', async (err, res, body) => {
            if (err) {
                console.log(err);
            }
            await expect(res.statusCode).to.equal(302);
            await expect(res).to.have.property(body);
        });
    });
});