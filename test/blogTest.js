import { expect } from 'chai';
import request from 'request';

describe('blogs', () => {

    it('Get All blog', () => {
        request.get('http://localhost:7800/blog', async(err, res, body) => {
            if (err) {
                console.log(err);
            }
            else {
                await expect(res).to.have.property(body);
                await expect(res.statusCode).to.equal(200);
            }
        });
    });

    it('Add blog', () => {
        request.get('http://localhost:7800/blog_Add', async(err, res, body) => {
            if (err) {
                console.log(err);
            } else {
                await expect(res.statusCode).to.equal(200);
                await expect(res).to.have.property(body);
            }
        });
    });

    it('Add blog data', () => {
        request.post('http://localhost:7800/add_blogData', async(err, res, body) => {
            if (err) {
                console.log(err);
            } else {
                await expect(res.statusCode).to.equal(302);
                await expect(res).to.have.property(body);
            }
        });
    });

    it('Delete blog', () => {
        request.get('http://localhost:7800/delete_blog', async(err, res, body) => {
            if (err) {
                console.log(err);
            } else {
                await expect(res.statusCode).to.equal(200);
                await expect(res).to.have.property(body);
            }
        });
    });

    it('edit blog', () => {
        request.get('http://localhost:7800/edit_blog', async(err, res, body) => {
            if (err) {
                console.log(err);
            } else {
                await expect(res.statusCode).to.equal(200);
                await expect(res).to.have.property(body);
            }
        });
    });

    it('update blog', () => {
        request.post('http://localhost:7800/update_blog', async(err, res, body) => {
            if (err) {
                console.log(err);
            } else {
                await expect(res.statusCode).to.equal(302);
                await expect(res).to.have.property(body);
            }
        });
    });

    it('like blog', () => {
        request.get('http://localhost:7800/like', async(err, res, body) => {
            if (err) {
                console.log(err);
            } else {
                await expect(res.statusCode).to.equal(200);
                await expect(res).to.have.property(body);
            }
        });
    });

    it('unlike blog', () => {
        request.get('http://localhost:7800/unlike', async(err, res, body) => {
            if (err) {
                console.log(err);
            } else {
                await expect(res.statusCode).to.equal(200);
                await expect(res).to.have.property(body);
            }
        });
    });

    it('follow blog', () => {
        request.get('http://localhost:7800/follow', async(err, res, body) => {
            if (err) {
                console.log(err);
            } else {
                await expect(res.statusCode).to.equal(200);
                await expect(res).to.have.property(body);
            }
        });
    });

    it('unfollow blog', () => {
        request.get('http://localhost:7800/unfollow', async(err, res, body) => {
            if (err) {
                console.log(err);
            } else {
                await expect(res.statusCode).to.equal(200);
                await expect(res).to.have.property(body);
            }
        });
    });

    it('saved blog', () => {
        request.get('http://localhost:7800/followBloggers', async (err, res, body) => {
            if (err) {
                console.log(err);
            } else {
                await  expect(res.statusCode).to.equal(404);
                await  expect(res).to.have.property(body);
            }
        });
    });

    it('comment blog', () => {
        request.post('http://localhost:7800/comment', async(err, res, body) => {
            if (err) {
                console.log(err);
            } else {
                await expect(res.statusCode).to.equal(302);
                await expect(res).to.have.property(body);
            }
        });
    });

    it('serach blog', () => {
        request.post('http://localhost:7800/searchData', async(err, res, body) => {
            if (err) {
                console.log(err);
            } else {
                await expect(res.statusCode).to.equal(500);
                await expect(res).to.have.property(body);
            }
        });
    });

    it('datesearch blog', () => {
        request.post('http://localhost:7800/DateSearchData', async(err, res, body) => {
            if (err) {
                console.log(err);
            } else {
                await expect(res.statusCode).to.equal(200);
                await expect(res).to.have.property(body);
            }
        });
    });

    it('categoryresult blog', () => {
        request.get('http://localhost:7800/getCategoryResult', async(err, res, body) => {
            if (err) {
                console.log(err);
            } else {
                await expect(res.statusCode).to.equal(200);
                await expect(res).to.have.property(body);
            }
        });
    });

    it('user blog', () => {
        request.get('http://localhost:7800/userPost', async(err, res, body) => {
            if (err) {
                console.log(err);
            } else {
                await expect(res.statusCode).to.equal(200);
                await expect(res).to.have.property(body);
            }
        });
    });

    it('active blog', () => {
        request.get('http://localhost:7800/blogActive', async(err, res, body) => {
            if (err) {
                console.log(err);
            } else {
                await expect(res.statusCode).to.equal(200);
            }
        });
    });

    it('deactive blog', () => {
        request.get('http://localhost:7800/blogDeactive', async(err, res, body) => {
            if (err) {
                console.log(err);
                console.log(err);
            } else {
                await expect(res.statusCode).to.equal(200);
            }
        });
    });

    it('adminrole', () => {
        request.get('http://localhost:7800/adminRole', async(err, res, body) => {
            if (err) {
                console.log(err);
            } else {
                await expect(res.statusCode).to.equal(200);
                await expect(res).to.have.property(body);
            }
        });
    });

    it('user role blog', () => {
        request.get('http://localhost:7800/userRole', async(err, res, body) => {
            if (err) {
                console.log(err);
            } else {
                await expect(res.statusCode).to.equal(200);
                await expect(res).to.have.property(body);
            }
        });
    });

});