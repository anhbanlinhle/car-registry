import pool from "../../../configs/connectDB";

//TODO - Viết lại hàm này để trả về thông tin của xe theo licenseId

let previewInfo = async (req, res) => {
  let licenseId = req.body.licenseId;

  if (licenseId === undefined) {
    return res.status(422).send({ message: "Missing parameter!" });
  }

  let base = `select r.id AS r_id, r.name as r_name, v.*, `;
  let date = new Date().toISOString().slice(0, 10);

  let type = `select type 
  from owner o 
  join vehicles v 
  on o.id = v.ownerId
  where v.licenseId = ?`;
  const [rows, fields] = await pool.query(type, [licenseId]);
  if (rows[0] == null) {
    return res.send({ data: null, valid: false });
  } else {
    if (rows[0].type === 1) {
      let query =
        base +
        ` p.* from vehicles v left join region r on v.regionId = r.id JOIN personal p on v.ownerId = p.id WHERE v.licenseId = ?`;
      const [rows, fields] = await pool.query(query, [licenseId]);
      return res.send({ data: rows, ownerType: 1 });
    } else {
      let query =
        base +
        ` c.* from vehicles v left join region r on v.regionId = r.id JOIN company c on v.ownerId = c.id WHERE v.licenseId = ?`;
      const [rows, fields] = await pool.query(query, [licenseId]);
      return res.send({ data: rows, ownerType: 0 });
    }
  }
};

module.exports = {
  previewInfo,
};
