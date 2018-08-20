// Unit tests for authorization module

import authorization from './authorization';

Tinytest.add('anyone can see \'public\' profile', function(test) {
  const user = {
    profileVisibility: 'public',
  };

  const canSee = authorization.checkCanSeeProfile(null, user);
  expect(canSee).to.equal(true);
});

Tinytest.add('unregistered viewer cannot see \'partup\' profile', function(test) {
  const user = {
    profileVisibility: 'partup',
  }

  const canSee = authorization.checkCanSeeProfile(null, user);
  expect(canSee).to.equal(false);
});

Tinytest.add('registered viewer can see \'partup\' profile', function(test) {
  const user = {
    profileVisibility: 'partup',
  }

  const canSee = authorization.checkCanSeeProfile({}, user);
  expect(canSee).to.equal(true);
});

Tinytest.add('unregistered viewer cannot see a private profile', function(test) {
  const user = {
    profileVisibility: 'private',
  }

  const canSee = authorization.checkCanSeeProfile(null, user);
  expect(canSee).to.equal(false);
});

Tinytest.add('viewer cannot see private user profile when user has no tribes / partups', function(test) {
  const viewer = {
    networks: [],
    upperOf: [],
    supporterOf: [],
  };
  const user = {
    networks: [],
    upperOf: [],
    supporterOf: [],
    profileVisibility: 'private',
  };

  const canSee = authorization.checkCanSeeProfile(viewer, user);
  expect(canSee).to.equal(false);
});

Tinytest.add('viewer cannot see private user profile when not in same tribe', function(test) {
  const viewer = {
    networks: ['1']
  };
  const user = {
    networks: ['2'],
    profileVisibility: 'private'
  };

  const canSee = authorization.checkCanSeeProfile(viewer, user);
  expect(canSee).to.equal(false);
});

Tinytest.add('viewer can see private user profile when in the same tribe', function(test) {
  const viewer = {
    networks: ['1']
  };
  const user = {
    networks: ['1'],
    profileVisibility: 'private'
  };

  const canSee = authorization.checkCanSeeProfile(viewer, user);
  expect(canSee).to.equal(true);
});

Tinytest.add('viewer can see private user profile when in same partup', function(test) {
  const viewer = {
    upperOf: ['1']
  };
  const user = {
    supporterOf: ['1'],
    profileVisibility: 'private',
  };

  const canSee = authorization.checkCanSeeProfile(viewer, user);
  expect(canSee).to.equal(true);
});
