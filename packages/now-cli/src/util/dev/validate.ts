import Ajv from 'ajv';
import {
  routesSchema,
  cleanUrlsSchema,
  headersSchema,
  redirectsSchema,
  rewritesSchema,
  trailingSlashSchema,
} from '@now/routing-utils';
import { NowConfig } from './types';

const ajv = new Ajv();

const buildsSchema = {
  type: 'array',
  minItems: 0,
  maxItems: 128,
  items: {
    type: 'object',
    additionalProperties: false,
    required: ['use'],
    properties: {
      src: {
        type: 'string',
        minLength: 1,
        maxLength: 4096,
      },
      use: {
        type: 'string',
        minLength: 3,
        maxLength: 256,
      },
      config: { type: 'object' },
    },
  },
};

const validateBuilds = ajv.compile(buildsSchema);
const validateRoutes = ajv.compile(routesSchema);
const validateCleanUrls = ajv.compile(cleanUrlsSchema);
const validateHeaders = ajv.compile(headersSchema);
const validateRedirects = ajv.compile(redirectsSchema);
const validateRewrites = ajv.compile(rewritesSchema);
const validateTrailingSlash = ajv.compile(trailingSlashSchema);

export function validateNowConfigBuilds(config: NowConfig) {
  return validateKey(config, 'builds', validateBuilds);
}

export function validateNowConfigRoutes(config: NowConfig) {
  return validateKey(config, 'routes', validateRoutes);
}

export function validateNowConfigCleanUrls(config: NowConfig) {
  return validateKey(config, 'cleanUrls', validateCleanUrls);
}

export function validateNowConfigHeaders(config: NowConfig) {
  return validateKey(config, 'headers', validateHeaders);
}

export function validateNowConfigRedirects(config: NowConfig) {
  return validateKey(config, 'redirects', validateRedirects);
}

export function validateNowConfigRewrites(config: NowConfig) {
  return validateKey(config, 'rewrites', validateRewrites);
}

export function validateNowConfigTrailingSlash(config: NowConfig) {
  return validateKey(config, 'trailingSlash', validateTrailingSlash);
}

function validateKey(
  config: NowConfig,
  key: keyof NowConfig,
  validate: Ajv.ValidateFunction
) {
  const value = config[key];
  if (!value) {
    return null;
  }

  if (!validate(value)) {
    if (!validate.errors) {
      return null;
    }

    const error = validate.errors[0];

    return `Invalid \`${key}\` property: ${error.dataPath} ${error.message}`;
  }

  return null;
}
