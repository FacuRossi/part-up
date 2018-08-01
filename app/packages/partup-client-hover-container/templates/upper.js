Template.HoverContainer_upper.onCreated(function() {
  const template = this;
  template.loading = new ReactiveVar(true);
  template.subscribe('users.one', template.data, {
    onReady() {
      template.loading.set(false);
    }
  });
});

Template.HoverContainer_upper.helpers({
    user() {
      var userId = Template.instance().data;
      var user = Meteor.users.findSingleActivePublicProfile(userId).fetch().pop();

      if (user) {
        var image = Images.findOne(user.profile.image);
        if (image) {
          Partup.client.embed.user(user, [image]);
        }
      }

      return user;
    },
    loading() {
      return Template.instance().loading.get();
    }
});
