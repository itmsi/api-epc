const info = {
  description: 'Express.js API Boilerplate - Template untuk pengembangan REST API dengan fitur lengkap',
  version: '1.0.0',
  title: 'Express.js API Boilerplate Documentation',
  contact: {
    email: 'your-email@example.com'
  },
  license: {
    name: 'MIT',
    url: 'https://opensource.org/licenses/MIT'
  }
}

const servers = [
  {
    url: '/api/epc/',
    description: 'Development server'
  },
  {
    url: 'https://services.motorsights.com/api/epc/',
    description: 'Gateway server'
  }
]

const masterCategorySchema = require('./schema/masterCategory');
const masterCategoryPaths = require('./path/masterCategory');
const categoriesSchema = require('./schema/categories');
const categoriesPaths = require('./path/categories');
const typeCategorySchema = require('./schema/type_category');
const typeCategoryPaths = require('./path/type_category');
const unitSchema = require('./schema/unit');
const unitPaths = require('./path/unit');
const itemCategorySchema = require('./schema/item_category');
const itemCategoryPaths = require('./path/item_category');
const productsSchema = require('./schema/products');
const productsPaths = require('./path/products');
const dokumenSchema = require('./schema/dokumen');
const dokumenPaths = require('./path/dokumen');

const schemas = {
  ...masterCategorySchema,
  ...categoriesSchema,
  ...typeCategorySchema,
  ...unitSchema,
  ...itemCategorySchema,
  ...productsSchema,
  ...dokumenSchema,
};

const paths = {
  ...masterCategoryPaths,
  ...categoriesPaths,
  ...typeCategoryPaths,
  ...unitPaths,
  ...itemCategoryPaths,
  ...productsPaths,
  ...dokumenPaths,
};

const index = {
  openapi: '3.0.0',
  info,
  servers,
  paths,
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas
  }
}

module.exports = {
  index
}
