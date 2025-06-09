import { AppDataSource } from '../../../../data-source';
import { Role } from '../../../core/entities/role.entity';
import { Department } from '../../../core/entities/department.entity';
import { GradeLevel } from '../../../core/entities/grade-level.entity';
import { Class } from '../../../core/entities/class.entity';

async function seed() {
  await AppDataSource.initialize();
  console.log('DB connected ✅');

  await AppDataSource.transaction(async (manager) => {
    const roleRepo = manager.getRepository(Role);
    const departmentRepo = manager.getRepository(Department);
    const gradeRepo = manager.getRepository(GradeLevel);
    const classRepo = manager.getRepository(Class);

    // Hapus semua data lama
    await manager.query('TRUNCATE TABLE "classes" CASCADE');
    await manager.query('TRUNCATE TABLE "grade_levels" CASCADE');
    await manager.query('TRUNCATE TABLE "departments" CASCADE');
    await manager.query('TRUNCATE TABLE "roles" CASCADE');    
    console.log('Old data cleared ✅');

    // === 1. Seed Parent Roles ===
    const parentRolesData = [
      { roleName: 'Group Siswa', description: 'Pengguna yang berperan sebagai siswa di sekolah' },
      { roleName: 'Group Guru', description: 'Pengajar atau tenaga pendidik di sekolah' },
      { roleName: 'Perangkat Kelas', description: 'Pengurus kelas seperti ketua kelas dan sekretaris' },
      { roleName: 'Group Wali Kelas', description: 'Guru yang bertanggung jawab atas wali kelas' },
      { roleName: 'Perangkat Sekolah', description: 'Staf pendukung sekolah seperti BK dan Waka' },
      { roleName: 'Operator', description: 'Pengelola sistem atau admin sekolah' },
    ];

    const parentRoles = parentRolesData.map(data => roleRepo.create(data));
    await roleRepo.save(parentRoles);

    const parentMap = new Map(parentRoles.map(r => [r.roleName, r]));

    // === 1b. Seed Child Roles ===
    const childRolesData = [
      { roleName: 'Siswa', description: 'Siswa sebagai pengguna sistem', parent: parentMap.get('Group Siswa') },
      { roleName: 'Guru', description: 'Guru sebagai pengguna sistem', parent: parentMap.get('Group Guru') },
      { roleName: 'Ketua Kelas', description: 'Ketua kelas sebagai pengurus kelas', parent: parentMap.get('Perangkat Kelas') },
      { roleName: 'Sekretaris', description: 'Sekretaris kelas sebagai pengurus kelas', parent: parentMap.get('Perangkat Kelas') },
      { roleName: 'Wali Kelas', description: 'Wali kelas yang membimbing siswa', parent: parentMap.get('Group Wali Kelas') },
      { roleName: 'BK', description: 'Bimbingan Konseling, staf pendukung sekolah', parent: parentMap.get('Perangkat Sekolah') },
      { roleName: 'Waka', description: 'Wakil kepala sekolah, staf pendukung sekolah', parent: parentMap.get('Perangkat Sekolah') },
      { roleName: 'Admin', description: 'Administrator sistem dengan hak akses penuh', parent: parentMap.get('Operator') },
    ];

    const childRoles = childRolesData.map(data => roleRepo.create(data));
    await roleRepo.save(childRoles);
    console.log('Roles with parent-child relations seeded ✅');

    // === 2. Departments ===
    const departmentNames = ['RPL', 'TKJ', 'DKV', 'PSPT', 'ANIMASI', 'PEKSOS'];
    const departments = departmentNames.map(name =>
      departmentRepo.create({ departmentName: name, departmentCode: name })
    );
    await departmentRepo.save(departments);
    console.log('Departments seeded ✅');

    // === 3. Grade Levels ===
    const gradeData = [
      { levelName: 'X', levelOrder: 1 },
      { levelName: 'XI', levelOrder: 2 },
      { levelName: 'XII', levelOrder: 3 },
    ];
    const grades = gradeData.map(g => gradeRepo.create(g));
    await gradeRepo.save(grades);
    console.log('Grade Levels seeded ✅');

    // === 4. Classes ===
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
      const match = cname.match(/^([A-Z]+)(\d+)$/);
      const depCode = match?.[1];
      const gradeNum = parseInt(match?.[2] || '0');

      const department = departments.find(d => d.departmentCode === depCode);
      const grade = grades.find(g => g.levelOrder === gradeNum);

      if (!department || !grade) {
        console.warn(`⚠️  Skip class ${cname}: department or grade not found`);
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
    console.log('Classes seeded ✅');
  });

  await AppDataSource.destroy();
  console.log('🌱 Seeding complete');
}

seed().catch((err) => {
  console.error('❌ Error seeding:', err);
});
