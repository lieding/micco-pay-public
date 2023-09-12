export const IS_DEV = process.env.NODE_ENV !== 'production';

export const IS_PROD = process.env.NODE_ENV === 'production';

export const BASE_URL = IS_DEV ? 'https://ne4tzrc9e9.execute-api.eu-west-3.amazonaws.com/dev' :
  "https://lx9l9yqrh6.execute-api.eu-west-3.amazonaws.com/default";
