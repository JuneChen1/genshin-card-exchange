const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isValidString, isValidPassword } = require('../utils/validUtils');
const appError = require('../utils/appError');
const { dataSource } = require('../db/data-source');

const authController = {
  async register(req, res, next) {
    try {
      const { username, password, contact_info } = req.body;
      if (
        !isValidString(username) ||
        !isValidPassword(password) ||
        (contact_info && !isValidString(contact_info))
      )
        return next(appError(400, '欄位未填寫正確'));

      const userRepo = dataSource.getRepository('Users');
      const existing = await userRepo.findOneBy({
        name: username.trim()
      });
      if (existing) return next(appError(409, '名字已被使用'));

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await userRepo.save({
        name: username.trim(),
        password: hashedPassword,
        contact_info: contact_info ? contact_info.trim() : null,
        role: 'USER'
      });

      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            name: user.name
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      if (!isValidString(username) || !isValidString(password))
        return next(appError(400, '欄位未填寫正確'));

      const userRepo = dataSource.getRepository('Users');
      const user = await userRepo.findOneBy({
        name: username.trim()
      });
      if (!user) return next(appError(400, '使用者不存在或密碼輸入錯誤'));

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return next(appError(400, '使用者不存在或密碼輸入錯誤'));

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_DAY }
      );

      res.status(200).json({
        status: 'success',
        data: {
          token,
          user: {
            name: user.name
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },
  logout(req, res) {
    res.status(200).json({
      status: 'success',
      message: '登出成功'
    });
  }
};

module.exports = authController;
