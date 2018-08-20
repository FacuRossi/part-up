
const makeFieldsObject = (...fields) => {
  const fieldsObject = {};

  if (fields && fields.length) {
    fields.forEach(field => {
      fieldsObject[field] = 1;
    });
  }

  return fieldsObject;
}

export const includeFields = (validator) => (...fields) => (options = {}) => {
  const fields = makeFieldsObject(...fields);

  return Object.assign(options, fields);
}
