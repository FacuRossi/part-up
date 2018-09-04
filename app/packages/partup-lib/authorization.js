import { get, each, curryRight, concat } from 'lodash';

userProfileVisibilityLevels = {
  levels: [
    {
      level: 'public',
      description: 'user-profile-visibility-level-public-description'
    },
    {
      level: 'partup',
      description: 'user-profile-visibility-level-partup-description'
    },
    {
      level: 'private',
      description: 'user-profile-visibility-level-private-description'
    }
  ],
  /* This is the iterator of this object returning only the 'level' when looping over,
   * See the 'for of' example below.
  **/
  [Symbol.iterator]: function *() {
    for (const item of this.levels) {
      yield item.level;
    }
  }
}

for (const level of userProfileVisibilityLevels) {
  userProfileVisibilityLevels[level.toUpperCase()] = level;
}

const isViewerConnected = (viewer, user) => {
  let isConnected = false;

  if (!viewer) {
    return isConnected;
  }

  for (let networkId of get(user, 'networks', [])) {
    if (get(viewer, 'networks', []).includes(networkId)) {
      isConnected = true;
      return isConnected;
    }
  }

  const curriedGet = curryRight(get)([]);
  const [upperOf, supporterOf] = [curriedGet('upperOf'), curriedGet('supporterOf')];
  const viewerPartupIds = concat(upperOf(viewer), supporterOf(viewer));
  const userPartupIds = concat(upperOf(user), supporterOf(user));

  for (let partupId of userPartupIds) {
    if (viewerPartupIds.includes(partupId)) {
      isConnected = true;
      return isConnected;
    }
  }

  return isConnected;
}

authorization = {
  checkCanSeeProfile(viewer, user) {
    let canSee = false;

    // TODO: some validation if user is a valid user object,
    // {} is now valid.
    if (
      !user
      || user.deactivatedAt
      || user.deletedAt
    ) {
      return false;
    }

    if (get(viewer, '_id') === user._id) {
      return true;
    }

    const userProfileVisibility = get(user, 'profileVisibility');
    switch (userProfileVisibility) {
      case 'public':
        canSee = true;
        break;
      case 'partup':
        canSee = !!viewer;
        break;
      case 'private':
        canSee = isViewerConnected(viewer, user);
        break;
      // undefined is explicitly mentioned in the switch statement,
      // when this feater was implemented no migration is ran and many users do not set their visibility;
      case undefined:
        cansSee = true; // By default all profiles are public;
        break;
      default:
        break;
    }

    return canSee;
  }
}
