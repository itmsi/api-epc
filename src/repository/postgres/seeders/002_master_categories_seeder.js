/**
 * Seeder: Master Categories
 * Add 15 master categories data
 */

exports.seed = async function(knex) {
  // Check if data already exists
  const existing = await knex('master_categories').count('master_category_id as count').first();
  if (parseInt(existing.count) > 0) {
    console.log('Master categories seeder already has data, skipping...');
    return;
  }

  await knex('master_categories').insert([
    {
      master_category_name_en: 'Engine Components',
      master_category_name_cn: '发动机组件',
      master_category_description: 'All engine related components and parts'
    },
    {
      master_category_name_en: 'Transmission System',
      master_category_name_cn: '变速器系统',
      master_category_description: 'Transmission related parts and components'
    },
    {
      master_category_name_en: 'Suspension System',
      master_category_name_cn: '悬挂系统',
      master_category_description: 'Suspension and shock absorber components'
    },
    {
      master_category_name_en: 'Brake System',
      master_category_name_cn: '制动系统',
      master_category_description: 'Brake components and safety systems'
    },
    {
      master_category_name_en: 'Electrical System',
      master_category_name_cn: '电气系统',
      master_category_description: 'Electrical and electronic components'
    },
    {
      master_category_name_en: 'Body Parts',
      master_category_name_cn: '车身零件',
      master_category_description: 'Body panels and exterior components'
    },
    {
      master_category_name_en: 'Interior Components',
      master_category_name_cn: '内饰组件',
      master_category_description: 'Interior parts and accessories'
    },
    {
      master_category_name_en: 'Cooling System',
      master_category_name_cn: '冷却系统',
      master_category_description: 'Radiator, hoses, and cooling components'
    },
    {
      master_category_name_en: 'Exhaust System',
      master_category_name_cn: '排气系统',
      master_category_description: 'Exhaust pipes and muffler components'
    },
    {
      master_category_name_en: 'Fuel System',
      master_category_name_cn: '燃油系统',
      master_category_description: 'Fuel injection and supply components'
    },
    {
      master_category_name_en: 'Air Conditioning',
      master_category_name_cn: '空调系统',
      master_category_description: 'AC compressor and cooling system'
    },
    {
      master_category_name_en: 'Lights & Electrical',
      master_category_name_cn: '灯光和电气',
      master_category_description: 'Lighting and electrical accessories'
    },
    {
      master_category_name_en: 'Filters',
      master_category_name_cn: '过滤器',
      master_category_description: 'Oil, air, and fuel filters'
    },
    {
      master_category_name_en: 'Tires & Wheels',
      master_category_name_cn: '轮胎和轮毂',
      master_category_description: 'Tires, rims, and wheel components'
    },
    {
      master_category_name_en: 'Safety Equipment',
      master_category_name_cn: '安全设备',
      master_category_description: 'Safety belts, airbags, and protection equipment'
    }
  ]);

  console.log('Master categories seeder completed');
};

