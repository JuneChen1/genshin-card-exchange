require('dotenv').config();

const bcrypt = require('bcrypt');
const { dataSource } = require('../data-source');

const TEST_PASSWORD = 'Test1234';

// 設計重點：
// - alice / bob 同在 EUROPE (7 開頭)，wanted/offered 互補 → 應互相配對成功
// - carol 卡牌 id 跟 alice/bob 重疊，但在 AMERICA (6 開頭) → 用來驗證 server 篩選會排除她
// - carol 沒有 contact_info → 用來驗證回傳結果不含聯絡方式
// - dave 有兩個 UID（TWHKMO、ASIA）→ 用來驗證同一使用者多個 UID 分開列出
const testUsers = [
  {
    name: 'test_seed_alice',
    contact_info: 'Discord: alice#0001',
    uids: [{ genshin_uid: '700000001', offered: [1, 2], wanted: [3, 4] }]
  },
  {
    name: 'test_seed_bob',
    contact_info: 'Discord: bob#0002',
    uids: [{ genshin_uid: '700000002', offered: [3, 4], wanted: [1, 2] }]
  },
  {
    name: 'test_seed_carol',
    contact_info: null,
    uids: [{ genshin_uid: '600000003', offered: [1], wanted: [5] }]
  },
  {
    name: 'test_seed_dave',
    contact_info: 'Line: dave_id',
    uids: [
      { genshin_uid: '900000004', offered: [5, 6], wanted: [7] },
      { genshin_uid: '800000005', offered: [8], wanted: [9] }
    ]
  }
];

async function seedTestData() {
  await dataSource.initialize();

  try {
    const userRepo = dataSource.getRepository('Users');
    const linkRepo = dataSource.getRepository('UserCards');
    const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);

    for (const testUser of testUsers) {
      let user = await userRepo.findOneBy({ name: testUser.name });

      if (user) {
        await userRepo.save({
          ...user,
          password: hashedPassword,
          contact_info: testUser.contact_info
        });
      } else {
        user = await userRepo.save({
          name: testUser.name,
          password: hashedPassword,
          contact_info: testUser.contact_info,
          role: 'USER'
        });
      }

      for (const uidData of testUser.uids) {
        const existing = await linkRepo.find({
          where: { genshin_uid: uidData.genshin_uid, user: { id: user.id } }
        });
        if (existing.length > 0) await linkRepo.remove(existing);

        const newLinks = [];
        uidData.offered.forEach((cardId) =>
          newLinks.push({
            genshin_uid: uidData.genshin_uid,
            status: 'offered',
            user: { id: user.id },
            card: { id: cardId }
          })
        );
        uidData.wanted.forEach((cardId) =>
          newLinks.push({
            genshin_uid: uidData.genshin_uid,
            status: 'wanted',
            user: { id: user.id },
            card: { id: cardId }
          })
        );

        await linkRepo.save(newLinks);
      }
    }

    console.log(`測試資料 seed 完成，共 ${testUsers.length} 位使用者`);
    console.log(`所有測試帳號密碼皆為：${TEST_PASSWORD}`);
    testUsers.forEach((testUser) => {
      const uids = testUser.uids.map((u) => u.genshin_uid).join(', ');
      console.log(`- ${testUser.name}（UID: ${uids}）`);
    });
  } finally {
    await dataSource.destroy();
  }
}

seedTestData().catch((error) => {
  console.error('測試資料 seed 失敗：', error);
  process.exit(1);
});
