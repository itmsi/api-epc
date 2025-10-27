/**
 * Seeder: Type Categories
 * Add 15 type categories data
 */

exports.seed = async function(knex) {
  // Check if data already exists
  const existing = await knex('type_categories').count('type_category_id as count').first();
  if (parseInt(existing.count) > 0) {
    console.log('Type categories seeder already has data, skipping...');
    return;
  }

  // Get categories
  const categories = await knex('categories').select('category_id', 'category_name_en');

  if (categories.length === 0) {
    console.log('Please run categories seeder first');
    return;
  }

  // Create type categories for each category
  const typeCategories = [];

  categories.forEach(category => {
    typeCategories.push({
      category_id: category.category_id,
      type_category_name_en: `${category.category_name_en} - Type A`,
      type_category_name_cn: '类型A',
      type_category_description: `Type A specification for ${category.category_name_en}`
    });
  });

  // Take only first 15 to match the count
  const insertData = typeCategories.slice(0, 15);
  
  await knex('type_categories').insert(insertData);

  console.log('Type categories seeder completed');
};

