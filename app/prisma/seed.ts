import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Seed Pooja Services
  console.log('📿 Seeding Pooja Services...')

  const poojaServices = [
    {
      poojaName: 'Nithya Pooja',
      price: 201.00,
      displayOrder: 1,
      description: 'Daily worship service',
    },
    {
      poojaName: 'Padha Pooja',
      price: 201.00,
      displayOrder: 2,
      description: 'Foot worship ceremony',
    },
    {
      poojaName: 'Panchmrutha Abhisheka',
      price: 201.00,
      displayOrder: 3,
      description: 'Five sacred substances abhishekam',
    },
    {
      poojaName: 'Madhu Abhisheka',
      price: 251.00,
      displayOrder: 4,
      description: 'Honey ablution ceremony',
    },
    {
      poojaName: 'Sarva Seva',
      price: 501.00,
      displayOrder: 5,
      description: 'Complete worship service',
    },
    {
      poojaName: 'Vishesha Alankara Seva',
      price: 1001.00,
      displayOrder: 6,
      description: 'Special decoration service',
    },
    {
      poojaName: 'Belli Kavachadharane',
      price: 1001.00,
      displayOrder: 7,
      description: 'Silver armor adornment',
    },
    {
      poojaName: 'Sahasranama Archane',
      price: 251.00,
      displayOrder: 8,
      description: 'Thousand names archana',
    },
    {
      poojaName: 'Vayusthuthi Punascharne',
      price: 501.00,
      displayOrder: 9,
      description: 'Vayu stuti repeated chanting',
    },
    {
      poojaName: 'Kanakabhisheka',
      price: 501.00,
      displayOrder: 10,
      description: 'Gold ablution ceremony',
    },
    {
      poojaName: 'Vastra Arpane Seva',
      price: 2001.00,
      displayOrder: 11,
      description: 'Cloth offering service',
    },
  ]

  // Check if services already exist
  const existingCount = await prisma.poojaService.count()

  if (existingCount === 0) {
    await prisma.poojaService.createMany({
      data: poojaServices,
    })
  } else {
    console.log('⏭️  Pooja Services already exist, skipping...')
  }

  console.log(`✅ Created ${poojaServices.length} Pooja Services`)

  // Seed System Configuration
  console.log('⚙️  Seeding System Configuration...')

  const configs = [
    {
      configKey: 'temple_name',
      configValue: 'Guru Seva Mandali',
      description: 'Temple name for receipts and certificates',
    },
    {
      configKey: 'temple_deity',
      configValue: 'Shri Raghavendra Swamy',
      description: 'Temple deity name',
    },
    {
      configKey: 'temple_subtitle',
      configValue: 'Brundavana Sannidhi',
      description: 'Temple subtitle',
    },
    {
      configKey: 'temple_address',
      configValue: 'No. 9/2, Damodhara Mudaliar Street, Halasuru',
      description: 'Temple address line 1',
    },
    {
      configKey: 'temple_city',
      configValue: 'Bangalore',
      description: 'City',
    },
    {
      configKey: 'temple_state',
      configValue: 'Karnataka',
      description: 'State',
    },
    {
      configKey: 'temple_pincode',
      configValue: '560 008',
      description: 'Pincode',
    },
    {
      configKey: 'temple_phone_1',
      configValue: '9902820105',
      description: 'Primary contact number',
    },
    {
      configKey: 'temple_phone_2',
      configValue: '7019337306',
      description: 'Secondary contact number',
    },
    {
      configKey: 'temple_email',
      configValue: 'contact@gurusevamandali.org',
      description: 'Contact email',
    },
    {
      configKey: 'razorpay_enabled',
      configValue: 'true',
      configType: 'boolean',
      description: 'Enable Razorpay payments',
    },
    {
      configKey: 'whatsapp_enabled',
      configValue: 'true',
      configType: 'boolean',
      description: 'Enable WhatsApp notifications',
    },
    {
      configKey: 'fiscal_year_start_month',
      configValue: '4',
      configType: 'number',
      description: 'Fiscal year starts in April',
    },
  ]

  for (const config of configs) {
    await prisma.systemConfig.upsert({
      where: { configKey: config.configKey },
      update: {
        configValue: config.configValue,
        configType: config.configType || 'string',
        description: config.description,
      },
      create: {
        configKey: config.configKey,
        configValue: config.configValue,
        configType: config.configType || 'string',
        description: config.description,
      },
    })
  }

  console.log(`✅ Created ${configs.length} System Configuration entries`)

  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
