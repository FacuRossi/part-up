Template['app_notfound_partup-closed'].events({
  'click [data-signup]'() {
    event.preventDefault();
    Intent.go({ route: 'register' })
  },
  'click [data-login]'() {
    event.preventDefault();
    Intent.go({ route: 'login' });
  },
});
