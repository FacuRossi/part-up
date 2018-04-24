Part-up models
=================

[![Join the chat at https://gitter.im/part-up/part-up](https://badges.gitter.im/part-up/part-up.svg)](https://gitter.im/part-up/part-up?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

The Part-up model definitions are ES6 classes and involve
- Documentation for the blueprint of the document
- Prototype functions and properties (like `user.getFirstname()`)
- Static functions and properties (like `UserModel.getPublicFields()` and `UserModel.getSchema()`)
- Common static and prototype functions as defined in `src/lib/Model` (such as `.equals()`)

Construct manually
------------------
```
import { MyModel } from 'part-up-js-models';

var myExtendedDocument = new MyModel(myDocument);
```

Creates a version of myDocument which is *extended* with MyModel's prototype properties. This is the way the model constructors work; they return an extended version of the document provided as first argument.


Construct on the fly (with Meteor Mongo collections)
----------------------------------------------------
```
import { LinkMeteorCollection } from 'part-up-js-helpers';

var linker = new LinkMeteorCollection(Mongo, Meteor.connection);
linker.link(MyModel, meteorCollectionOrMeteorCollectionName);
```

This function mutates `MyModel` comprehensively. It
- extends MyModel with all collection prototype functions like `find()` and `findOne()`.
- transforms every collection document with an instance of MyModel.
- provides a query builder at `.query()`. See QUERYBUILDER.md for its API documentation.

