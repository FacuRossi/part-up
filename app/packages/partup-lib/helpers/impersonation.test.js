import impersonation, { IMPERSONATION_REQUEST_STATUS } from './impersonation';

const validTime = () => moment().subtract((impersonation.durationMS * 0.5), 'ms');
const invalidTime = () => moment().subtract((impersonation.durationMS + 1), 'ms');

Tinytest.add(
  `impersonation.isActive returns TRUE when status '${IMPERSONATION_REQUEST_STATUS.ACCEPTED}' and 'created_at' comparrison is above 0 and below ${impersonation.durationMS}`,
  (test) => {
    const sut = {
      created_at: validTime(),
      status: IMPERSONATION_REQUEST_STATUS.ACCEPTED,
    };

    test.equal(impersonation.isActive(sut), true);
  },
);

Tinytest.add(
  `impersonation.isActive returns FALSE when status '${IMPERSONATION_REQUEST_STATUS.ACCEPTED}' and request time is expired`,
  (test) => {
    const sut = {
      created_at: invalidTime(),
      status: IMPERSONATION_REQUEST_STATUS.ACCEPTED,
    };

    test.equal(impersonation.isActive(sut), false);
  },
);

Tinytest.add(
  `impersonation.isActive returns FALSE when status is not ${IMPERSONATION_REQUEST_STATUS.ACCEPTED} but timestamp is within the boundaries`,
  (test) => {
    const sut = {
      created_at: validTime(),
      status: 'doog pop',
    };

    test.equal(impersonation.isActive(sut), false);
  }
);

Tinytest.add(
  `impersonation.isExpired returns TRUE when timestamp comparrison returns 0 or less`,
  (test) => {
    const sut = {
      created_at: invalidTime(),
    };

    test.equal(impersonation.isExpired(sut), true);
  }
);

Tinytest.add(
  `impersonation.isExpired returns FALSE when timestamp comparrison is within 0 and ${impersonation.durationMS}`,
  (test) => {
    const sut = {
      created_at: validTime(),
    };

    test.equal(impersonation.isExpired(sut), false);
  }
);

Tinytest.add(
  `impersonation.timeLeft returns time in ms`,
  (test) => {
    const sut = {
      created_at: moment().subtract(1, 'minutes'),
    }

    const timeLeft = impersonation.timeLeft(sut);
    const isTrue = timeLeft > 0 && timeLeft < impersonation.durationMS;

    test.equal(isTrue, true);
  }
)