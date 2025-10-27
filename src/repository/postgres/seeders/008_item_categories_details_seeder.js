/**
 * Seeder: Item Categories Details
 * Add 15 item category details data
 */

exports.seed = async function(knex) {
  // Check if data already exists
  const existing = await knex('item_categories_details').count('item_category_detail_id as count').first();
  if (parseInt(existing.count) > 0) {
    console.log('Item categories details seeder already has data, skipping...');
    return;
  }

  // Get item categories
  const itemCategories = await knex('item_categories').select('item_category_id');

  if (itemCategories.length === 0) {
    console.log('Please run item categories seeder first');
    return;
  }

  const itemDetails = [];

  // Sample part data
  const partNumbers = ['PN-001', 'PN-002', 'PN-003', 'PN-004', 'PN-005', 'PN-006', 'PN-007', 'PN-008', 'PN-009', 'PN-010'];
  const targetIds = ['T001', 'T002', 'T003', 'T004', 'T005', 'T006', 'T007', 'T008', 'T009', 'T010'];
  const items = [
    { nameEn: 'Engine Oil Filter', nameCn: '机油滤清器', desc: 'High quality oil filter' },
    { nameEn: 'Air Filter', nameCn: '空气滤清器', desc: 'Premium air filter element' },
    { nameEn: 'Fuel Filter', nameCn: '燃油滤清器', desc: 'High efficiency fuel filter' },
    { nameEn: 'Brake Pad Set', nameCn: '刹车片套装', desc: 'Ceramic brake pads' },
    { nameEn: 'Spark Plug', nameCn: '火花塞', desc: 'Iridium spark plug' },
    { nameEn: 'Timing Belt', nameCn: '正时皮带', desc: 'Reinforced timing belt' },
    { nameEn: 'Water Pump', nameCn: '水泵', desc: 'High flow water pump' },
    { nameEn: 'Radiator Hose', nameCn: '散热器软管', desc: 'Cooling system hose' },
    { nameEn: 'Battery', nameCn: '电池', desc: '12V automotive battery' },
    { nameEn: 'Alternator', nameCn: '发电机', desc: 'High output alternator' }
  ];

  // Create details for first 15 item categories
  for (let i = 0; i < 15 && i < itemCategories.length; i++) {
    const item = items[i % items.length];
    const partNum = partNumbers[i % partNumbers.length];
    const targetId = targetIds[i % targetIds.length];

    itemDetails.push({
      item_category_id: itemCategories[i].item_category_id,
      target_id: targetId,
      part_number: partNum,
      catalog_item_name_en: item.nameEn,
      catalog_item_name_ch: item.nameCn,
      description: item.desc,
      quantity: Math.floor(Math.random() * 10) + 1,
      unit: 'pcs'
    });
  }

  await knex('item_categories_details').insert(itemDetails);

  console.log('Item categories details seeder completed');
};

