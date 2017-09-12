const assert = require('assert');
const User = require('../src/user');

describe('Reading users out of the database', () => {
  let joe, maria, alex, zach;
  beforeEach(done => {
    joe = new User({ name: 'Joe' });
    alex = new User({ name: 'Alex' });
    maria = new User({ name: 'Maria' });
    zach = new User({ name: 'Zach' });

    Promise.all([alex.save(), joe.save(), maria.save(), zach.save()]).then(() =>
      done()
    );
  });

  it('finds all users with a name of joe', () => {
    User.find({ name: 'Joe' }).then(users => {
      assert(users[0]._id.toString() === joe._id.toString());
    });
  });

  it('find a user with a particular id', done => {
    User.findOne({ _id: joe._id }).then(user => {
      assert(user.name === 'Joe');
      done();
    });
  });

  it('can skip and limit then result set', done => {
    // -Alex- [Joe Maria] Zach
    User.find({})
      .sort({ name: 1 })
      .skip(1)
      .limit(2)
      .then(users => {
        assert(users.length === 2);
        assert(users[0].name === 'Joe');
        assert(users[1].name === 'Maria');
        done();
      });
  });
});
