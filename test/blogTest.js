import { expect } from 'chai';
import request from 'request';

describe('blogs', () => {

    it('Get All blog', (done) => {
        request.get('http://localhost:7500/blog', (err, res, body) => {
            if (err) {
                done(err)
            }
            else {
                expect(res).to.have.property('body');
                expect(res.statusCode).to.equal(200);
                done();
            }
        });
    });

    it('Add blog', (done) => {
        request.get('http://localhost:7500/blog_Add', (err, res, body) => {
            if (err) {
                done(err)
            } else {
                expect(res.statusCode).to.equal(200);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('Add blog data', (done) => {
        request.post('http://localhost:7500/add_blogData', (err, res, body) => {
            if (err) {
                done(err)
            } else {
                expect(res.statusCode).to.equal(302);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('Delete blog', (done) => {
        request.get('http://localhost:7500/delete_blog', (err, res, body) => {
            if (err) {
                done(err)
            } else {
                expect(res.statusCode).to.equal(200);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('edit blog', (done) => {
        request.get('http://localhost:7500/edit_blog', (err, res, body) => {
            if (err) {
                done(err)
            } else {
                expect(res.statusCode).to.equal(200);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('update blog', (done) => {
        request.post('http://localhost:7500/update_blog', (err, res, body) => {
            if (err) {
                done(err)
            } else {
                expect(res.statusCode).to.equal(302);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('like blog', (done) => {
        request.get('http://localhost:7500/like', (err, res, body) => {
            if (err) {
                done(err)
            } else {
                expect(res.statusCode).to.equal(200);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('unlike blog', (done) => {
        request.get('http://localhost:7500/unlike', (err, res, body) => {
            if (err) {
                done(err)
            } else {
                expect(res.statusCode).to.equal(200);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('save blog', (done) => {
        request.get('http://localhost:7500/save', (err, res, body) => {
            if (err) {
                done(err)
            } else {
                expect(res.statusCode).to.equal(200);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('unsave blog', (done) => {
        request.get('http://localhost:7500/unsave', (err, res, body) => {
            if (err) {
                done(err)
            } else {
                expect(res.statusCode).to.equal(200);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('saved blog', (done) => {
        request.get('http://localhost:7500/saveblogs', (err, res, body) => {
            if (err) {
                done(err)
            } else {
                expect(res.statusCode).to.equal(404);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('comment blog', (done) => {
        request.post('http://localhost:7500/comment', (err, res, body) => {
            if (err) {
                done(err)
            } else {
                expect(res.statusCode).to.equal(302);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('serach blog', (done) => {
        request.post('http://localhost:7500/searchData', (err, res, body) => {
            if (err) {
                done(err)
            } else {
                expect(res.statusCode).to.equal(500);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('datesearch blog', (done) => {
        request.post('http://localhost:7500/DateSearchData', (err, res, body) => {
            if (err) {
                done(err)
            } else {
                expect(res.statusCode).to.equal(200);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('categoryresult blog', (done) => {
        request.get('http://localhost:7500/getCategoryResult', (err, res, body) => {
            if (err) {
                done(err)
            } else {
                expect(res.statusCode).to.equal(200);
                expect(res).to.have.property('body');
                done();
            }
        });
    });
 
    it('user blog', (done) => { 
        request.get('http://localhost:7500/userPost', (err, res, body) => {
            if (err) {
                done(err)
            } else {
                expect(res.statusCode).to.equal(200);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('active blog', (done) => {
        request.get('http://localhost:7500/blogActive', (err, res, body) => {
            if (err) {
                done(err)
            } else {
                expect(res.statusCode).to.equal(200);
                done();
            }
        });
    });

    it('deactive blog', (done) => {
        request.get('http://localhost:7500/blogDeactive', (err, res, body) => {
            if (err) {
                console.log(err);
                done(err)
            } else {
                expect(res.statusCode).to.equal(200);
                done();
            }
        });
    });

    it('adminrole', (done) => {
        request.get('http://localhost:7500/adminRole', (err, res, body) => {
            if (err) {
                done(err)
            } else {
                expect(res.statusCode).to.equal(500);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

    it('user role blog', (done) => {
        request.get('http://localhost:7500/userRole', (err, res, body) => {
            if (err) {
                done(err)
            } else {
                expect(res.statusCode).to.equal(500);
                expect(res).to.have.property('body');
                done();
            }
        });
    });

});