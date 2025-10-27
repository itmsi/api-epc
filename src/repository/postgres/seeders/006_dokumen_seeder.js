/**
 * Seeder: Dokumen
 * Add 15 dokumen data
 */

exports.seed = async function(knex) {
  // Check if data already exists
  const existing = await knex('dokumen').count('dokumen_id as count').first();
  if (parseInt(existing.count) > 0) {
    console.log('Dokumen seeder already has data, skipping...');
    return;
  }

  await knex('dokumen').insert([
    { dokumen_name: 'Tecnologia', dokumen_description: 'Tecnologia technical documentation' },
    { dokumen_name: 'Bosch Automotive', dokumen_description: 'Bosch automotive components catalog' },
    { dokumen_name: 'Delphi Parts', dokumen_description: 'Delphi parts specification' },
    { dokumen_name: 'Continental', dokumen_description: 'Continental parts manual' },
    { dokumen_name: 'ZF Service', dokumen_description: 'ZF service documentation' },
    { dokumen_name: 'Mahle Parts', dokumen_description: 'Mahle parts catalog' },
    { dokumen_name: 'Valeo Components', dokumen_description: 'Valeo components guide' },
    { dokumen_name: 'TRW Products', dokumen_description: 'TRW product specifications' },
    { dokumen_name: 'Brembo Systems', dokumen_description: 'Brembo brake systems' },
    { dokumen_name: 'Monroe Shocks', dokumen_description: 'Monroe shock absorbers' },
    { dokumen_name: 'NGK Spark Plugs', dokumen_description: 'NGK ignition components' },
    { dokumen_name: 'Gates Belts', dokumen_description: 'Gates belts and hoses' },
    { dokumen_name: 'Motorcraft Filters', dokumen_description: 'Motorcraft filters catalog' },
    { dokumen_name: 'ACDelco Parts', dokumen_description: 'ACDelco parts reference' },
    { dokumen_name: 'Standard Parts', dokumen_description: 'Standard parts documentation' }
  ]);

  console.log('Dokumen seeder completed');
};

