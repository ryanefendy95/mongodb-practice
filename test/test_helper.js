const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

before(done => {
  var promise = mongoose.connect('mongodb://localhost/user_test', {
    useMongoClient: true
  });

  promise
    .once('open', () => done())
    .on('error', error => console.warn('Warning', error));
});

beforeEach(done => {
  // mongoose normalize collection names to lowercase so blogPosts -> blogposts
  const { users, comments, blogposts } = mongoose.connection.collections;
  users.drop(() => {
    comments.drop(() => {
      blogposts.drop(() => {
        done();
      });
    });
  });
});
