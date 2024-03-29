import pool from "../../../configs/connectDB";

let adminFilterBrand = async (req, res) => {

  let filter = req.body.filter;
  let name = req.body.name;
  let resPerPage = parseInt(req.body.resPerPage);
  let page = parseInt(req.body.page);
  if (req.body.resPerPage === undefined) resPerPage = 10;
  if (req.body.page === undefined) page = 1;

  let carType = req.body.carType;
  let order = req.body.order;

  if (carType === undefined || order === undefined) {
    return res.status(422).send({ ErrorCode: "ER_MISSING_PARAM" });
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

  let count =
  carType === "unregisted" ?
  `
  select count(*) as total from vehicles v
  `
  + sub + (sub === "" ? `where` : `and`) +
  `
   v.licenseId 
  NOT IN 
  (SELECT registry.licenseId  FROM registry)

  `
  :
  `
  select count(*) as total from registry
  where (licenseId, expire) in
  (select v.licenseId as license, max(expire) as expire
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
    `current_date()` 
    ;

  let queryType =
    carType === "registed"
      ? "re.date as registryDate"
      : "timestampdiff(month, re.date, re.expire) as duration";

  let query =
  carType === "unregisted" ?
  `
  select v.licenseId as license, v.brand, v.model, v.version, p.name 
  FROM vehicles v
  join owner o 
      on v.ownerId = o.id
  join personal p
      on p.id = o.id
      `
  + sub + (sub === "" ? `where` : `and`) +
    `
    v.licenseId NOT IN 
  (SELECT registry.licenseId  FROM registry)
  UNION ALL
  select v.licenseId as license, v.brand, v.model, v.version, c.name 
  FROM vehicles v
  join owner o 
      on v.ownerId = o.id
  join company c
      on c.id = o.id
    ` 
      + sub + (sub === "" ? `where` : `and`) +
    `
    v.licenseId NOT IN 
  (SELECT registry.licenseId  FROM registry)
  order by brand ` +
    order +
    `, model ` +
    order +
    `, version ` +
    order +
    ` limit ? offset ?`
  
  :
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
      ` +
    sub +
    `
    group by re.licenseId)  
  and expire` +
    type +
    `current_date()
          union all 
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
      ` +
    sub +
    `
    group by re.licenseId)  
  and expire` +
    type +
    `current_date()
    order by brand ` +
    order +
    `, model ` +
    order +
    `, version ` +
    order +
    ` limit ? offset ?`;
  // bug - đã gọi được api kết quả trả về chính xác  
  
  let rows = []
  let fields = []
  try
  {
  const [countRows, countFields] = await pool.query(count, [name]);

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
  adminFilterBrand,
};
