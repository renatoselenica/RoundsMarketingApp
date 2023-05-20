export const getAppSchema = {
  querystring: {
    type: 'object',
    properties: {
      packageName: { type: 'string' },
    },
    required: ['packageName'],
  },
}

export const addAppSchema = {
  body: {
    type: 'object',
    properties: {
      packageUrl: { type: 'string' },
    },
    required: ['packageUrl'],
  },
}

export const addAppScreenshot = {
  body: {
    type: 'object',
    properties: {
      packageName: { type: 'string' },
    },
    required: ['packageUrl'],
  },
}
