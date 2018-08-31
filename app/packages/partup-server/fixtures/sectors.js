Meteor.startup(function () {
  if (process.env.NODE_ENV.match(/development|staging/)) {
    if (!Sectors.find().count()) {
      Sectors.insert({
          '_id': '9oNQGxTCKqvsTADnl',
          'name': 'Cultuur',
          'phrase_key': 'network-settings-sector-cultuur'
      });
      Sectors.insert({
          '_id': '2RmvKkMc2gPgZnp1U',
          'name': 'Dienstverlening',
          'phrase_key': 'network-settings-sector-dienstverlening'
      });
      Sectors.insert({
          '_id': 'kJxHQtMKoLsOKaoUh',
          'name': 'Energie',
          'phrase_key': 'network-settings-sector-energie'
      });
      Sectors.insert({
          '_id': 'olHytjJtx28UQL0sx',
          'name': 'Food & Drink',
          'phrase_key': 'network-settings-sector-eten_drinken'
      });
      Sectors.insert({
          '_id': 'FhapMhLSOHcCCbPfO',
          'name': 'Finance',
          'phrase_key': 'network-settings-sector-financien'
      });
      Sectors.insert({
          '_id': 'xPqmVC0HXZSonoTXB',
          'name': 'IT',
          'phrase_key': 'network-settings-sector-it'
      });
      Sectors.insert({
          '_id': 'amBl1EcGQbS1D4yGD',
          'name': 'Maatschappij',
          'phrase_key': 'network-settings-sector-maatschappij'
      });
      Sectors.insert({
          '_id': 'GKrqvl5EPLuh7PpSm',
          'name': 'Makers',
          'phrase_key': 'network-settings-sector-makers'
      });
      Sectors.insert({
          '_id': 'nzlTJheV0FyyQOXsj',
          'name': 'Ondernemen',
          'phrase_key': 'network-settings-sector-ondernemen'
      });
      Sectors.insert({
          '_id': 'cK2VJSFpyqMY01jc5',
          'name': 'Onderwijs',
          'phrase_key': 'network-settings-sector-onderwijs'
      });
      Sectors.insert({
          '_id': 'vg9lIhHdym1a2NXNw',
          'name': 'Overheid',
          'phrase_key': 'network-settings-sector-overheid'
      });
      Sectors.insert({
          '_id': '73Nx9bizIW1IlYxs6',
          'name': 'Sport',
          'phrase_key': 'network-settings-sector-sport'
      });
      Sectors.insert({
          '_id': 'MFBPA6m09F2Qi0jGA',
          'name': 'Vervoer',
          'phrase_key': 'network-settings-sector-vervoer'
      });
      Sectors.insert({
          '_id': 'a0AvnFFexUtOho2FJ',
          'name': 'Water',
          'phrase_key': 'network-settings-sector-water'
      });
      Sectors.insert({
          '_id': 'EK44EKqmXHAMWvNEp',
          'name': 'Zorg',
          'phrase_key': 'network-settings-sector-zorg'
      });
    }
  }
});
