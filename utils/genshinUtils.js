module.exports = {
  getUidStartByServer(server) {
    if (server.toUpperCase() === 'EUROPE') return [7];
    if (server.toUpperCase() === 'AMERICA') return [6];
    if (server.toUpperCase() === 'ASIA') return [8, 18];
    if (server.toUpperCase() === 'TWHKMO') return [9];
    return null;
  },
  parseCardIds(raw) {
    if (!raw) return [];
    return raw
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item !== '')
      .map((item) => Number(item));
  }
};
