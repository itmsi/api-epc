/**
 * Seeder: Products Details
 * Add 15 product details data
 */

exports.seed = async function(knex) {
  // Check if data already exists
  const existing = await knex('products_details').count('product_detail_id as count').first();
  if (parseInt(existing.count) > 0) {
    console.log('Products details seeder already has data, skipping...');
    return;
  }

  // Get products
  const products = await knex('products').select('product_id');
  
  // Get dokumen
  const dokumen = await knex('dokumen').select('dokumen_id');

  if (products.length === 0 || dokumen.length === 0) {
    console.log('Please run products and dokumen seeders first');
    return;
  }

  const productDetails = [];

  // Create details for each product (1 detail per product for 15 products)
  for (let i = 0; i < 15 && i < products.length; i++) {
    const randomDokumen = dokumen[Math.floor(Math.random() * dokumen.length)];

    productDetails.push({
      product_id: products[i].product_id,
      dokumen_id: randomDokumen.dokumen_id,
      product_detail_name_en: `Product Detail ${i + 1}`,
      product_detail_name_cn: `产品详情 ${i + 1}`,
      product_detail_description: `Detailed specification for product ${i + 1}`
    });
  }

  await knex('products_details').insert(productDetails);

  console.log('Products details seeder completed');
};

