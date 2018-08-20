if (process.env.PARTUP_CRON_ENABLED) {
    SyncedCron.add({
        name: 'Update the sitemap',
        schedule: function(parser) {
            return parser.text(Partup.constants.CRON_SITEMAP);
        },
        job: function() {
            if (!process.env.NODE_ENV.match(/development/)) {
                var baseUrl = 'https://part-up.com/';

                // Create networks sitemap
                var networkXml = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
                Networks.find({
                    archived_at: { $exists: false }
                }, { fields: { slug: 1, updated_at: 1 } }).forEach(function(network) {
                    networkXml += '<url>';
                    networkXml += '<loc>' + baseUrl + 'tribes/' + network.slug + '</loc>';
                    networkXml += '<lastmod>' + network.updated_at.toISOString() + '</lastmod>';
                    networkXml += '<changefreq>daily</changefreq>';
                    networkXml += '<priority>0.9</priority>';
                    networkXml += '</url>';
                });
                networkXml += '</urlset>';

                // Upload to S3
                S3.putObjectSync({ Key: 'tribes.xml', Body: networkXml, ContentType: 'application/xml' });

                // Create Part-ups sitemap
                var partupXml = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
                Partups.find({
                    archived_at: { $exists: false },
                    deleted_at: { $exists: false }
                }, { fields: { slug: 1 } }).forEach(function(partup) {
                    partupXml += '<url>';
                    partupXml += '<loc>' + baseUrl + 'partups/' + partup.slug + '</loc>';
                    partupXml += '<changefreq>weekly</changefreq>';
                    partupXml += '<priority>0.8</priority>';
                    partupXml += '</url>';
                });
                partupXml += '</urlset>';

                // Upload to S3
                S3.putObjectSync({ Key: 'part-ups.xml', Body: partupXml, ContentType: 'application/xml' });

                // Create profiles sitemap
                var profilesXml = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
                Meteor.users.find({ deactivatedAt: { $exists: false }, profileVisibility: 'public' }, { fields: { _id: 1 } }).forEach(function(user) {
                    profilesXml += '<url>';
                    profilesXml += '<loc>' + baseUrl + 'profile/' + user._id + '</loc>';
                    profilesXml += '<changefreq>monthly</changefreq>';
                    profilesXml += '<priority>0.7</priority>';
                    profilesXml += '</url>';
                });
                profilesXml += '</urlset>';

                // Upload to S3
                S3.putObjectSync({ Key: 'profiles.xml', Body: profilesXml, ContentType: 'application/xml' });

                // Create swarms sitemap
                var swarmsXml = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
                Swarms.find({}, { fields: { slug: 1, updated_at: 1 } }).forEach(function(swarm) {
                    swarmsXml += '<url>';
                    swarmsXml += '<loc>' + baseUrl + swarm.slug + '</loc>';
                    swarmsXml += '<lastmod>' + swarm.updated_at.toISOString() + '</lastmod>';
                    swarmsXml += '<changefreq>monthly</changefreq>';
                    swarmsXml += '<priority>0.7</priority>';
                    swarmsXml += '</url>';
                });
                swarmsXml += '</urlset>';

                // Upload to S3
                S3.putObjectSync({ Key: 'swarms.xml', Body: swarmsXml, ContentType: 'application/xml' });
            }
        }
    });
}