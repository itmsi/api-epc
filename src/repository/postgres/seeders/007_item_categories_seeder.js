/**
 * Seeder: Item Categories
 * Add 15 item categories data
 */

exports.seed = async function(knex) {
  // Check if data already exists
  const existing = await knex('item_categories').count('item_category_id as count').first();
  if (parseInt(existing.count) > 0) {
    console.log('Item categories seeder already has data, skipping...');
    return;
  }

  // Get type categories
  const typeCategories = await knex('type_categories').select('type_category_id', 'type_category_name_en');
  
  // Get dokumen
  const dokumen = await knex('dokumen').select('dokumen_id');

  if (typeCategories.length === 0 || dokumen.length === 0) {
    console.log('Please run type categories and dokumen seeders first');
    return;
  }

  const itemCategories = [];

  // Create item categories for first 15 type categories
  for (let i = 0; i < 15 && i < typeCategories.length; i++) {
    const typeCategory = typeCategories[i];
    const randomDokumen = dokumen[Math.floor(Math.random() * dokumen.length)];

    itemCategories.push({
      type_category_id: typeCategory.type_category_id,
      dokumen_id: randomDokumen.dokumen_id,
      item_category_name_en: `${typeCategory.type_category_name_en} Item`,
      item_category_name_cn: `${typeCategory.type_category_name_en} 项目`,
      item_category_description: `Item category for ${typeCategory.type_category_name_en}`,
      item_category_foto: `https://example.com/images/item_${i + 1}.jpg`
    });
  }

  await knex('item_categories').insert(itemCategories);

  console.log('Item categories seeder completed');
};

