/**
 * Seeder: Units
 * Add 15 units data
 */

exports.seed = async function(knex) {
  // Check if data already exists
  const existing = await knex('units').count('unit_id as count').first();
  if (parseInt(existing.count) > 0) {
    console.log('Units seeder already has data, skipping...');
    return;
  }

  await knex('units').insert([
    { unit_name_en: 'pcs', unit_name_cn: '件', unit_description: 'Pieces' },
    { unit_name_en: 'set', unit_name_cn: '套', unit_description: 'Set' },
    { unit_name_en: 'pair', unit_name_cn: '对', unit_description: 'Pair' },
    { unit_name_en: 'box', unit_name_cn: '箱', unit_description: 'Box' },
    { unit_name_en: 'liter', unit_name_cn: '升', unit_description: 'Liter' },
    { unit_name_en: 'kg', unit_name_cn: '千克', unit_description: 'Kilogram' },
    { unit_name_en: 'meter', unit_name_cn: '米', unit_description: 'Meter' },
    { unit_name_en: 'roll', unit_name_cn: '卷', unit_description: 'Roll' },
    { unit_name_en: 'tube', unit_name_cn: '管', unit_description: 'Tube' },
    { unit_name_en: 'bottle', unit_name_cn: '瓶', unit_description: 'Bottle' },
    { unit_name_en: 'carton', unit_name_cn: '箱装', unit_description: 'Carton' },
    { unit_name_en: 'pack', unit_name_cn: '包', unit_description: 'Pack' },
    { unit_name_en: 'strip', unit_name_cn: '条', unit_description: 'Strip' },
    { unit_name_en: 'sheet', unit_name_cn: '张', unit_description: 'Sheet' },
    { unit_name_en: 'unit', unit_name_cn: '单位', unit_description: 'Unit' }
  ]);

  console.log('Units seeder completed');
};

