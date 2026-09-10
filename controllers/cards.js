const { dataSource } = require('../db/data-source');

const cardController = {
  async getCards(req, res, next) {
    try {
      const cardRepo = dataSource.getRepository('Cards');
      const cards = await cardRepo.find({
        order: { id: 'ASC' }
      });

      cards.sort((a, b) => (a.id === 0) - (b.id === 0));

      res.status(200).json({
        status: 'success',
        data: cards
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = cardController;
