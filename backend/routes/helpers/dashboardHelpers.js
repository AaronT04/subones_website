function pagedParams(req, defaults = { limit: 50, offset: 0 }) {
    const limit = Math.min(Number(req.query.limit ?? defaults.limit), 200);
    const offset = Math.max(Number(req.query.offset ?? defaults.offset), 0);
    const q = (req.query.q ?? '').toString().trim();
    const field = (req.query.field ?? '').toString().trim().toLowerCase(); 
    return { limit, offset, q, field };
  }
  
  function buildSearchWhere({ q, field, mapAll, mapByField }) {
    if (!q) return { where: '', params: [] };
  
    if (field && mapByField[field]) {
      if (field === 'id') {
        if (/^\d+$/.test(q)) {
          const first = mapByField.id[0];
          return { where: `WHERE ${first} = ?`, params: [Number(q)] };
        } else {
          const first = mapByField.id[0];
          return { where: `WHERE CAST(${first} AS CHAR) LIKE ?`, params: [`${q}%`] };
        }
      }
  
      const clauses = mapByField[field].map(col => `LOWER(${col}) LIKE ?`);
      return { where: `WHERE (${clauses.join(' OR ')})`, params: Array(clauses.length).fill(`%${q.toLowerCase()}%`) };
    }
  
    if (mapAll && mapAll.length) {
      const clauses = mapAll.map(col => `LOWER(${col}) LIKE ?`);
      return { where: `WHERE (${clauses.join(' OR ')})`, params: Array(mapAll.length).fill(`%${q.toLowerCase()}%`) };
    }
  
    return { where: '', params: [] };
  }
  
  const toNumberId = (rows) =>
    rows.map((r) => ({ ...r, id: typeof r.id === 'string' ? Number(r.id) : r.id }));
  
  module.exports = {
    pagedParams,
    buildSearchWhere,
    toNumberId,
  };