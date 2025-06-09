// src/database/seed/seed.ts
import { AppDataSource } from '../../../../data-source';
import { Role } from '../../../core/entities/role.entity';
import { Department } from '../../../core/entities/department.entity';
import { GradeLevel } from '../../../core/entities/grade-level.entity';
import { Class } from '../../../core/entities/class.entity';

async function seed() {
  await AppDataSource.initialize();
  console.log('DB connected ✅');

  const roleRepo = AppDataSource.getRepository(Role);
  const departmentRepo = AppDataSource.getRepository(Department);
  const gradeRepo = AppDataSource.getRepository(GradeLevel);
  const classRepo = AppDataSource.getRepository(Class);

  // Hapus dulu semua data lama supaya bersih
  await classRepo.clear();
  await gradeRepo.clear();
  await departmentRepo.clear();
  await roleRepo.clear();
  console.log('Old data cleared ✅');

  // === 1. Seed Roles dengan parent-child relations dan deskripsi bahasa Indonesia ===
  // Parent roles dulu dengan deskripsi
  const parentRolesData = [
    { roleName: 'Siswa', description: 'Pengguna yang berperan sebagai siswa di sekolah' },
    { roleName: 'Guru', description: 'Pengajar atau tenaga pendidik di sekolah' },
    { roleName: 'Perangkat Kelas', description: 'Pengurus kelas seperti ketua kelas dan sekretaris' },
    { roleName: 'Wali Kelas', description: 'Guru yang bertanggung jawab atas wali kelas' },
    { roleName: 'Perangkat Sekolah', description: 'Staf pendukung sekolah seperti BK dan Waka' },
    { roleName: 'Operator', description: 'Pengelola sistem atau admin sekolah' },
  ];
  const parentRoles = parentRolesData.map(data => roleRepo.create(data));
  await roleRepo.save(parentRoles);

  // Map roleName ke parent role entity untuk relasi child nanti
  const parentMap = new Map(parentRoles.map(r => [r.roleName, r]));

  // Child roles dengan parent reference dan deskripsi
  const childRolesData = [
    { roleName: 'Siswa', description: 'Siswa sebagai pengguna sistem', parent: parentMap.get('Siswa') },
    { roleName: 'Guru', description: 'Guru sebagai pengguna sistem', parent: parentMap.get('Guru') },
    { roleName: 'Ketua Kelas', description: 'Ketua kelas sebagai pengurus kelas', parent: parentMap.get('Perangkat Kelas') },
    { roleName: 'Sekretaris', description: 'Sekretaris kelas sebagai pengurus kelas', parent: parentMap.get('Perangkat Kelas') },
    { roleName: 'Wali Kelas', description: 'Wali kelas yang membimbing siswa', parent: parentMap.get('Wali Kelas') },
    { roleName: 'BK', description: 'Bimbingan Konseling, staf pendukung sekolah', parent: parentMap.get('Perangkat Sekolah') },
    { roleName: 'Waka', description: 'Wakil kepala sekolah, staf pendukung sekolah', parent: parentMap.get('Perangkat Sekolah') },
    { roleName: 'Admin', description: 'Administrator sistem dengan hak akses penuh', parent: parentMap.get('Operator') },
  ];
  const childRoles = childRolesData.map(data => roleRepo.create(data));
  await roleRepo.save(childRoles);

  console.log('Roles with parent-child relations and descriptions seeded ✅');

  // === 2. Seed Departments ===
  const departmentNames = ['RPL', 'TKJ', 'DKV', 'PSPT', 'ANIMASI', 'PEKSOS'];
  const departments: Department[] = [];

  for (const name of departmentNames) {
    const dep = departmentRepo.create({
      departmentName: name,
      departmentCode: name,
    });
    departments.push(dep);
  }
  await departmentRepo.save(departments);
  console.log('Departments ✅');

  // === 3. Seed Grade Levels ===
  const gradeData = [
    { levelName: 'X', levelOrder: 1 },
    { levelName: 'XI', levelOrder: 2 },
    { levelName: 'XII', levelOrder: 3 },
  ];
  const grades: GradeLevel[] = [];

  for (const g of gradeData) {
    const grade = gradeRepo.create(g);
    grades.push(grade);
  }
  await gradeRepo.save(grades);
  console.log('Grade Levels ✅');

  // === 4. Seed Classes ===
  const classNames = [
    'RPL1', 'RPL2', 'RPL3', 'RPL4',
    'TKJ1', 'TKJ2', 'TKJ3', 'TKJ4',
    'DKV1', 'DKV2', 'DKV3', 'DKV4',
    'PSPT1', 'PSPT2', 'PSPT3', 'PSPT4',
    'ANIMASI1', 'ANIMASI2',
    'PEKSOS1', 'PEKSOS2', 'PEKSOS3', 'PEKSOS4',
  ];

  const classes: Class[] = [];

  for (const cname of classNames) {
    const depName = cname.replace(/[0-9]/g, '');
    const gradeNum = parseInt(cname.replace(/\D/g, ''));

    const department = departments.find(d => d.departmentCode === depName);
    const grade = grades.find(g => g.levelOrder === gradeNum);

    if (!department || !grade) {
      console.warn(`Skip class ${cname} (department or grade not found)`);
      continue;
    }

    const newClass = classRepo.create({
      className: cname,
      department,
      gradeLevel: grade,
    });

    classes.push(newClass);
  }
  await classRepo.save(classes);
  console.log('Classes ✅');

  await AppDataSource.destroy();
  console.log('🌱 Seeding Complete');
}

seed().catch((err) => {
  console.error('❌ Error Seeding:', err);
});
