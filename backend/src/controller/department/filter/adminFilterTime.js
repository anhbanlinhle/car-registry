import pool from "../../../configs/connectDB";
// task - đang làm dở đừng động vào
let adminFilterTime = async (req, res) => {
  let order = req.body.order === "desc" ? " desc" : " asc";
  let filter = req.body.filter;
  let name = req.body.name;

  let resPerPage = parseInt(req.body.resPerPage);
  let page = parseInt(req.body.page);
  if (req.body.resPerPage === undefined) resPerPage = 10;
  if (req.body.page === undefined) page = 1;

  let carType = req.body.carType;
  let year = parseInt(req.body.year);
  let month = parseInt(req.body.month);
  let quarter = parseInt(req.body.quarter);

  if (
    carType === undefined ||
    year === undefined ||
    month === undefined ||
    quarter === undefined
  ) {
    return res.status(422).send({ ErrorCode: "ER_MISSING_PARAM" });
  }

  if (carType === "unregisted") {
    return res.send({
    data: [],
    countPage: 0,
  });
  }

  let sub = "";
  if (filter === "region") {
    sub = 
    `
    LEFT JOIN region r ON
    r.id = v.regionId 
    WHERE r.name = ?
    `
  }
  else if (filter === "centre") {
    sub = 
    `
    LEFT JOIN centre c ON
    c.id = re.centreId 
    WHERE c.name = ?
    `
  }

  let type = carType === "registed" ? " >= " : " < ";
  let sort = carType === "registed" ? "registryDate" : "expire";
  let filterType = carType === "registed" ? "re.date" : "re.expire";

  let match = "";
  if (req.body.month !== "All") {
    match = `\nand month(` + filterType + `) = ` + month;
  } else if (req.body.quarter !== "All") {
    match =
      `\nand month(` +
      filterType +
      `) > ` +
      (quarter - 1) * 3 +
      `\nand month(` +
      filterType +
      `) <= ` +
      quarter * 3;
  }
  if (req.body.year !== "All") {
    match += `\nand year(` + filterType + `) = ` + year;
  }

  let count =
    `
  select count(*) as total
  from registry re
  join vehicles v
  on re.licenseId = v.licenseId
  where (brand, re.licenseId, expire) in
  (select v.brand as brand, v.licenseId as license, max(expire) as expire
  from vehicles v
  left join registry re
  on re.licenseId = v.licenseId
  `
  +
  sub
  +
  `
  group by v.licenseId)  
  and expire` +
    type +
    `current_date()` +
    match;

  let queryType =
    carType === "registed"
      ? "re.date as registryDate"
      : "timestampdiff(month, re.date, re.expire) as duration";

  let query =
    `
  select re.licenseId as license, v.brand, v.model, v.version, ` +
    queryType +
    `, re.expire, p.name
    from registry re
  join vehicles v 
    on v.licenseId = re.licenseId
  join owner o 
    on v.ownerId = o.id
  join personal p
    on p.id = o.id
  where (re.licenseId, expire) in
    (select v.licenseId as license, max(expire) as expire
      from vehicles v
    left join registry re
      on re.licenseId = v.licenseId
      `
      +
      sub
      + 
      `
    group by re.licenseId)  
  and expire` +
    type +
    `current_date()` +
    match +
    `\nunion all 
  select re.licenseId as license, v.brand, v.model, v.version, ` +
    queryType +
    `, re.expire, c.name
    from registry re
  join vehicles v 
    on v.licenseId = re.licenseId
  join owner o 
    on v.ownerId = o.id
  join company c 
    on c.id = o.id
  where (re.licenseId, expire) in
    (select v.licenseId as license, max(expire) as expire
      from vehicles v
    left join registry re
      on re.licenseId = v.licenseId
      `
      +
      sub
      + 
      `
    group by re.licenseId)  
  and expire` +
    type +
    `current_date()` +
    match +
    `\norder by ` +
    sort + order +
    ` 
    limit ? offset ?`;
  try
  {  
  const [countRows, countFields] = await pool.query(count, [name]);
  let rows = []
  let fields = []
  if (sub === "") {
    [rows, fields] = await pool.query(query, [
    resPerPage,
    resPerPage * (page - 1),
  ]);
  }
  else {
    [rows, fields] = await pool.query(query, [
    name,
    name,
    resPerPage,
    resPerPage * (page - 1),
  ]);
  }
  return res.send({
    data: rows,
    countPage: Math.ceil(countRows[0].total / resPerPage),
  });
}
  catch (err) {
    console.log(err);
    return res.status(500).send({ErrorCode: err.code, ErrorNo: err.errno});
  }
};

module.exports = {
  adminFilterTime,
};
