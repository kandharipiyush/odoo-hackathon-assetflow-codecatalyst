const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding database...');

  // 1. Seed Departments (IT, HR, Finance)
  const departmentsData = [
    { name: 'IT' },
    { name: 'HR' },
    { name: 'Finance' }
  ];

  const departments = {};
  for (const dept of departmentsData) {
    const record = await prisma.department.upsert({
      where: { name: dept.name },
      update: {},
      create: { name: dept.name }
    });
    departments[dept.name] = record;
    console.log(`Seeded department: ${dept.name} (${record.id})`);
  }

  // 2. Seed Asset Categories (Electronics, Furniture, Vehicles)
  const categoriesData = [
    { name: 'Electronics' },
    { name: 'Furniture' },
    { name: 'Vehicles' }
  ];

  for (const cat of categoriesData) {
    const record = await prisma.assetCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: { name: cat.name }
    });
    console.log(`Seeded asset category: ${cat.name} (${record.id})`);
  }

  // 3. Seed Admin User (System Admin, admin@assetflow.com, Admin@123, role: ADMIN, status: ACTIVE, dept: IT)
  const adminEmail = 'admin@assetflow.com';
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const itDept = departments['IT'];

  if (!itDept) {
    throw new Error('IT department was not found/created during seeding.');
  }

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: 'System Admin',
      password_hash: adminPasswordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      department_id: itDept.id
    },
    create: {
      name: 'System Admin',
      email: adminEmail,
      password_hash: adminPasswordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      department_id: itDept.id
    }
  });

  console.log(`Seeded admin user: ${adminUser.name} (${adminUser.id})`);
  console.log('Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
