// Migration script for Vercel Postgres
// Run this after setting up Vercel Postgres database

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateToVercelPostgres() {
  try {
    console.log('🔄 Starting migration to Vercel Postgres...');

    // Test database connection
    await prisma.$connect();
    console.log('✅ Connected to Vercel Postgres');

    // Run Prisma migrations
    console.log('📊 Running database migrations...');
    const { execSync } = require('child_process');
    execSync('npx prisma db push', { stdio: 'inherit' });

    // Seed the database
    console.log('🌱 Seeding database...');
    execSync('npm run db:seed', { stdio: 'inherit' });

    console.log('✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrateToVercelPostgres();