const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../src/user');
const BlogPost = require('../src/blogPost');

describe('middleware', () => {
  beforeEach(done => {
    joe = new User({ name: 'Joe' });
    blogPosts = new BlogPost({
      title: 'JS is Great',
      content: 'Yep it really is'
    });

    joe.blogPosts.push(blogPosts);

    Promise.all([joe.save(), blogPosts.save()]).then(() => done());
  });

  it('users clean up dangling blogposts on remove', done => {
    joe
      .remove()
      .then(() => BlogPost.count())
      .then(count => {
        assert(count === 0);
        done();
      });
  });
});
