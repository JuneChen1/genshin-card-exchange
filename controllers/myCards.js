const { isValidGenshinUid } = require('../utils/validUtils');
const appError = require('../utils/appError');
const { dataSource } = require('../db/data-source');

const myCardController = {
  async getMyCards(req, res, next) {
    const { uid } = req.query;
    if (!isValidGenshinUid(uid)) return next(appError(400, 'uid 格式錯誤'));
    try {
      const linkRepo = dataSource.getRepository('UserCards');
      const result = await linkRepo.find({
        where: { genshin_uid: uid, user: { id: req.user.id } },
        relations: { card: true }
      });

      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },
  async updateCards(req, res, next) {
    const { genshinUid, offered, wanted } = req.body;
    if (
      !isValidGenshinUid(genshinUid) ||
      !Array.isArray(offered) ||
      !Array.isArray(wanted)
    )
      return next(appError(400, '欄位未填寫正確'));
    if (offered.length === 0 && wanted.length === 0)
      return next(appError(400, '沒有可更新的欄位'));

    const overlap = offered.filter((cardId) => wanted.includes(cardId));
    if (overlap.length > 0)
      return next(appError(400, '同一張卡片不能同時是提供與需求'));

    try {
      const result = await dataSource.transaction(async (manager) => {
        const linkRepo = manager.getRepository('UserCards');
        const deleteData = await linkRepo.find({
          where: { genshin_uid: genshinUid, user: { id: req.user.id } }
        });
        await linkRepo.remove(deleteData);

        const newData = [];
        offered.forEach((cardId) =>
          newData.push({
            genshin_uid: genshinUid,
            status: 'offered',
            user: { id: req.user.id },
            card: { id: cardId }
          })
        );
        wanted.forEach((cardId) =>
          newData.push({
            genshin_uid: genshinUid,
            status: 'wanted',
            user: { id: req.user.id },
            card: { id: cardId }
          })
        );

        return linkRepo.save(newData);
      });

      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = myCardController;
