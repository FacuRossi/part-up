import moment, { isMoment } from 'moment';
import _ from 'lodash';

var d = Debug('services:participation_calculator');

/**
 @namespace Partup server participation calculator service
 @name Partup.server.services.participation_calculator
 @memberof Partup.server.services
 */
Partup.server.services.participation_calculator = {

    calculateParticipationScoreForUpper: function(upperId) {
        var score = 0;
        var upper = Meteor.users.findOneOrFail(upperId);

        var score1 = this._calculateLoginScore(upper);
        var score1weight = 0.25;
        d('Login score for user [' + upperId + '] is ' + score1 + '/100 and counts for 25% → ' + (score1 * score1weight) + '/100');
        score += score1 * score1weight;

        var score2 = this._calculateSupportsRecentPartupsScore(upper);
        var score2weight = 0.25;
        d('Supports recent partups score for user [' + upperId + '] is ' + score2 + '/100 and counts for 25% → ' + (score2 * score2weight) + '/100');
        score += score2 * score2weight;

        var score3 = this._calculateAmountOfUpdatesCreated(upper);
        var score3weight = 0.17;
        d(`Amount of updates created in the last 30 days score for user ${upper._id} is ${score3}/100 and counts for 17% ${score3*score3weight}/100`);
        score += score3 * score3weight;

        var score4 = this._calculateAmountOfComments(upper);
        var score4weight = 0.08;
        d(`Amount of comments created by the current user in the past 30 days for user ${upper._id} is ${score4}/100 and counts for 8% ${score4*score4weight}/100`);
        score += score4 * score4weight;

        var score5 = this._calculateAmountOfContributions(upper);
        var score5weight = 0.25;
        d(`Amount of verified contributions within the last 30 days, ${upper._id} is ${score5}/100 and counts for 25% ${score5*score5weight}/100`);
        score += score5 * score5weight;

        d('Total participation score for user [' + upperId + '] is ' + score + '/100');

        return Math.min(100, score);
    },

    _calculateAmountOfComments({ _id }) {
      const scoreDelta = 4;
      let commentsScore = 0;

      const minimumDate = moment().subtract(30, 'days').toISOString();
      Updates
        .find({ comments_count: { $gte: 0 }, comments: { $elemMatch: { 'creator._id': _id, 'created_at': { $gte: minimumDate } } } })
        .forEach((update) => {
          _.get(update, 'comments', []).forEach(({ creator_id, created_at }) => {
            if (creator_id === _id && created_at >= minimumDate) {
              commentsScore += scoreDelta;
            }
          });
        });

      return Math.min(100, commentsScore);
    },

    _calculateAmountofContributions({ _id }) {
      const scoreDelta = 4;
      let contributionsScore = 0;

      const minimumDate = moment().subtract(30, 'days').toISOString();

      Contributions
        .find({ upper_id: _id, verified: true, created_at: { $gte: minimumDate } })
        .forEach((contribution) => { contributionsScore += scoreDelta; });

      return Math.min(100, contributionsScore);
    },

    _calculateAmountOfUpdatesCreated({ _id }) {
      let updatesScore = 0;
      const scoreDelta = 4;

      const minimumDate = moment().subtract(30, 'days').toISOString();

      Updates
        .find({ upper_id: _id, created_at: { $gte: minimumDate } })
        .forEach(() => { updatesScore += scoreDelta });

      return Math.min(100, updatesScore);
    },

    _calculateSupportsRecentPartupsScore: function(upper) {
        var supports = upper.supporterOf || [];
        var partups = Partups.find({_id: {'$in': supports}});

        var supportsRecentPartupsScore = 0;

        // By using a score delta of 4, an upper can receive the full
        // 100 score of this part by supporting 25 active partups
        var scoreDelta = 4;

        partups.forEach(function(partup) {
            if (!partup.hasEnded()) {
                supportsRecentPartupsScore += scoreDelta;
            }
        });

        return Math.min(100, supportsRecentPartupsScore);
    },

    _calculateLoginScore: function(upper) {
        var logins = upper.logins || [];

        var loginScore = 0;

        // By using a score delta of 4, an upper can receive the full
        // 100 score of this part by logging in 25 days consecutively
        var scoreDelta = 4;

        var day = 24 * 60 * 60 * 1000;
        var now = new Date;
        var createdAt = new Date(upper.createdAt);
        var createdDaysAgo = (now - createdAt) / day;

        var maximumDaysAgoToGiveScore = 25;

        if (createdDaysAgo <= maximumDaysAgoToGiveScore) {
            loginScore += scoreDelta * (maximumDaysAgoToGiveScore - createdDaysAgo);
        }

        logins.forEach(function(login) {
            var daysBetweenLoginAndNow = Math.round(Math.abs((login.getTime() - now.getTime()) / day));

            if (daysBetweenLoginAndNow <= maximumDaysAgoToGiveScore) {
                loginScore += scoreDelta;
            }
        });

        return Math.min(100, loginScore);
    }

};
