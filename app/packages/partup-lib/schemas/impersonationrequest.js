
const ImpersonationRequestSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  accepted_at: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
  adminId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  created_at: {
    type: Date,
    defaultValue: new Date(),
  },
  status: {
    type: String,
    allowedValues: [
      'pending',
      'accepted',
    ],
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
});

Partup.schemas.entities.impersonationRequest = ImpersonationRequestSchema;
