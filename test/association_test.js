const assert = require('assert');
const mongoose = require('mongoose');
const User = require('../src/user');
const Comment = require('../src/comment');
const BlogPost = require('../src/blogPost');

describe('association', () => {
  let joe, blogPost, comment;

  beforeEach(done => {
    joe = new User({ name: 'Joe' });
    blogPosts = new BlogPost({
      title: 'JS is Great',
      content: 'Yep it really is'
    });
    comment = new Comment({ content: 'Congrats on great post' });

    joe.blogPosts.push(blogPosts);
    blogPosts.comments.push(comment);
    comment.user = joe;

    Promise.all([joe.save(), blogPosts.save(), comment.save()]).then(() =>
      done()
    );
  });

  it('saves a relation between a user and a blogpost', done => {
    User.findOne({ name: 'Joe' })
      .populate('blogPosts')
      .then(user => {
        assert(user.blogPosts[0].title === 'JS is Great');
        done();
      });
  });

  it('saves a full relation graph', done => {
    User.findOne({ name: 'Joe' })
      .populate({
        path: 'blogPosts',
        populate: {
          path: 'comments',
          model: 'comment',
          populate: {
            path: 'user',
            model: 'user'
          }
        }
      })
      .then(user => {
        const { title } = user.blogPosts[0];
        const { content, user: { name } } = user.blogPosts[0].comments[0];
        assert(user.name === 'Joe');
        assert(title === 'JS is Great');
        assert(content === 'Congrats on great post');
        assert(name === 'Joe');

        done();
      });
  });
});
