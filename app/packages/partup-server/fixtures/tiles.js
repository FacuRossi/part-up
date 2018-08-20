Meteor.startup(function() {
    if (process.env.NODE_ENV.match(/development|staging/)) {
        if (!Tiles.find().count()) {

            /* 1 */
            // Tiles.insert({
            //     _id : "TFxPXWbPFbrEqL5yE",
            //     upper_id : "K5c5M4Pbdg3B82wQH",
            //     type : "image",
            //     description : "Image #1",
            //     position : 10,
            //     image_id : "T8pfWebTJmvbBNJ2g"
            // });
            // Meteor.users.update('K5c5M4Pbdg3B82wQH', {$addToSet: {'profile.tiles': 'TFxPXWbPFbrEqL5yE'}});

            // /* 2 */
            // Tiles.insert({
            //     _id : "kshT8u57bA4n4C5gq",
            //     upper_id : "K5c5M4Pbdg3B82wQH",
            //     type : "image",
            //     description : "Image #2",
            //     position : 20,
            //     image_id : "D3zGxajTjWCLhXokS"
            // });
            // Meteor.users.update('K5c5M4Pbdg3B82wQH', {$addToSet: {'profile.tiles': 'kshT8u57bA4n4C5gq'}});

            // /* 3 */
            // Tiles.insert({
            //     _id : "Ywa8cwbwnzuoAh3gK",
            //     upper_id : "K5c5M4Pbdg3B82wQH",
            //     type : "image",
            //     description : "Image #3",
            //     position : 30,
            //     image_id : "ComeF2exAjeKBPAf8"
            // });
            // Meteor.users.update('K5c5M4Pbdg3B82wQH', {$addToSet: {'profile.tiles': 'Ywa8cwbwnzuoAh3gK'}});

            // /* 4 */
            // Tiles.insert({
            //     _id : "oFcBMto69huJwvjqm",
            //     upper_id : "K5c5M4Pbdg3B82wQI",
            //     type : "image",
            //     description : "Image #1",
            //     position : 10,
            //     image_id : "J2KxajXMcqiKwrEBu"
            // });
            // Meteor.users.update('K5c5M4Pbdg3B82wQI', {$addToSet: {'profile.tiles': 'oFcBMto69huJwvjqm'}});

            // /* 5 */
            // Tiles.insert({
            //     _id : "kJw8tAZd6KJvPFGqb",
            //     upper_id : "K5c5M4Pbdg3B82wQI",
            //     type : "image",
            //     description : "Image #2",
            //     position : 20,
            //     image_id : "xfYreAouRFh4mnctk"
            // });
            // Meteor.users.update('K5c5M4Pbdg3B82wQI', {$addToSet: {'profile.tiles': 'kJw8tAZd6KJvPFGqb'}});

            // /* 6 */
            // Tiles.insert({
            //     _id : "YPfdhWYRwvzvrfck8",
            //     upper_id : "a7qcp5RHnh5rfaeW9",
            //     type : "image",
            //     description : "Image #1",
            //     position : 10,
            //     image_id : "raaNx9aqA6okiqaS4"
            // });
            // Meteor.users.update('a7qcp5RHnh5rfaeW9', {$addToSet: {'profile.tiles': 'YPfdhWYRwvzvrfck8'}});
        }
    }
});
