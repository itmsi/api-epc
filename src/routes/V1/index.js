const express = require('express')
// const { verifyToken } = require('../../middlewares')

const routing = express();
const API_TAG = '/api/epc';

/* RULE
naming convention endpoint: using plural
Example:
- GET /api/examples
- POST /api/examples
- GET /api/examples/:id
- PUT /api/examples/:id
- DELETE /api/examples/:id
*/

// Example Module (Template untuk module Anda)
// const exampleModule = require('../../modules/example')
// routing.use(`${API_TAG}/examples`, exampleModule)

// Master Category Module
const masterCategoryModule = require('../../modules/masterCategory')
routing.use(`${API_TAG}/master_category`, masterCategoryModule)

// Categories Module
const categoriesModule = require('../../modules/categories')
routing.use(`${API_TAG}/categories`, categoriesModule)

// Type Category Module
const typeCategoryModule = require('../../modules/type_category')
routing.use(`${API_TAG}/type_category`, typeCategoryModule)

// Tambahkan routes module Anda di sini
// Example:
// const yourModule = require('../../modules/yourModule')
// routing.use(`${API_TAG}/your-endpoint`, yourModule)

module.exports = routing;
