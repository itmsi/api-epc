/**
 * Seeder: Categories
 * Add 15 categories data
 */

exports.seed = async function(knex) {
  // Check if data already exists
  const existing = await knex('categories').count('category_id as count').first();
  if (parseInt(existing.count) > 0) {
    console.log('Categories seeder already has data, skipping...');
    return;
  }

  // Get master categories
  const masterCategories = await knex('master_categories').select('master_category_id', 'master_category_name_en');

  if (masterCategories.length === 0) {
    console.log('Please run master categories seeder first');
    return;
  }

  // Create categories for each master category
  const categories = [];
  let categoryIndex = 0;

  masterCategories.forEach(master => {
    // Add 2 categories for each master category
    for (let i = 0; i < 2; i++) {
      const types = ['Standard', 'Premium', 'Premium Plus'];
      const typesCn = ['标准', '高级', '超级'];
      
      categories.push({
        master_category_id: master.master_category_id,
        master_category_name_en: master.master_category_name_en,
        category_name_en: `${master.master_category_name_en} - ${types[i]}`,
        category_name_cn: `分类 - ${typesCn[i]}`,
        category_description: `${master.master_category_name_en} category for standard components`
      });
      categoryIndex++;
    }
  });

  // Take only first 15 to match the count
  const insertData = categories.slice(0, 15);
  
  await knex('categories').insert(insertData);

  console.log('Categories seeder completed');
};

