/**
 * Seeder: Products
 * Add 15 products data
 */

exports.seed = async function(knex) {
  // Check if data already exists
  const existing = await knex('products').count('product_id as count').first();
  if (parseInt(existing.count) > 0) {
    console.log('Products seeder already has data, skipping...');
    return;
  }

  const products = [
    { product_name_en: 'Honda Civic', product_name_cn: '本田思域', product_description: '2023 Honda Civic', vin_number: 'HCM1234567890123' },
    { product_name_en: 'Toyota Camry', product_name_cn: '丰田凯美瑞', product_description: '2023 Toyota Camry', vin_number: 'TCM1234567890123' },
    { product_name_en: 'BMW 3 Series', product_name_cn: '宝马3系', product_description: '2023 BMW 3 Series', vin_number: 'BMW1234567890123' },
    { product_name_en: 'Mercedes C-Class', product_name_cn: '奔驰C级', product_description: '2023 Mercedes C-Class', vin_number: 'MER1234567890123' },
    { product_name_en: 'Audi A4', product_name_cn: '奥迪A4', product_description: '2023 Audi A4', vin_number: 'AUD1234567890123' },
    { product_name_en: 'Volkswagen Golf', product_name_cn: '大众高尔夫', product_description: '2023 VW Golf', vin_number: 'VWG1234567890123' },
    { product_name_en: 'Ford Focus', product_name_cn: '福特福克斯', product_description: '2023 Ford Focus', vin_number: 'FRD1234567890123' },
    { product_name_en: 'Chevrolet Malibu', product_name_cn: '雪佛兰迈锐宝', product_description: '2023 Chevrolet Malibu', vin_number: 'CHV1234567890123' },
    { product_name_en: 'Nissan Altima', product_name_cn: '日产天籁', product_description: '2023 Nissan Altima', vin_number: 'NIS1234567890123' },
    { product_name_en: 'Hyundai Elantra', product_name_cn: '现代伊兰特', product_description: '2023 Hyundai Elantra', vin_number: 'HYU1234567890123' },
    { product_name_en: 'Kia Optima', product_name_cn: '起亚K5', product_description: '2023 Kia Optima', vin_number: 'KIA1234567890123' },
    { product_name_en: 'Mazda 3', product_name_cn: '马自达3', product_description: '2023 Mazda 3', vin_number: 'MAZ1234567890123' },
    { product_name_en: 'Subaru Impreza', product_name_cn: '斯巴鲁翼豹', product_description: '2023 Subaru Impreza', vin_number: 'SUB1234567890123' },
    { product_name_en: 'Mitsubishi Lancer', product_name_cn: '三菱蓝瑟', product_description: '2023 Mitsubishi Lancer', vin_number: 'MIT1234567890123' },
    { product_name_en: 'Lexus ES', product_name_cn: '雷克萨斯ES', product_description: '2023 Lexus ES', vin_number: 'LEX1234567890123' }
  ];

  await knex('products').insert(products);

  console.log('Products seeder completed');
};

