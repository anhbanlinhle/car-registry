import pool from "../../../configs/connectDB";
// task - Preview Regist
// input - license Id
// output - regist Id, Regist Date, Expire Date

let previewRegist = async (req, res) => {
  let licenseId = req.body.licenseId;
  let centreId = req.session.userid;

  if (licenseId === undefined) {
    return res.status(422).send({ message: "Missing parameter!" });
  }
  
  //Kiểm tra ngày sửa chữa
  let currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() - 6);
  let sixMonthsAgo = currentDate.toISOString().slice(0, 10);

  let date = new Date();
  let registDate = date.toISOString().slice(0, 10);
  let query = "select modifyDate from vehicles where licenseId = ?";
  let modifyDate = await pool.query(query, [licenseId]);
  if (modifyDate != null) {
    modifyDate = modifyDate[0][0].modifyDate;
  }
  let expireDate = new Date();
  if (modifyDate == null || modifyDate == "") {
    expireDate.setMonth(date.getMonth() + 18);
  }
  if (modifyDate > sixMonthsAgo) {
    expireDate.setMonth(date.getMonth() + 12);
  } else {
    expireDate.setMonth(date.getMonth() + 6);
  }
  expireDate = expireDate.toISOString().slice(0, 10);
  let findId = `SELECT (MAX(id) + 1) as id FROM registry`;
  let id = await pool.query(findId);
  id = id[0][0].id;

  // logic - lấy tên trung tâm đăng kiểm hiện tạiSELECT (MAX(id) + 1) FROM 'registry'
  let getCentreName = "select name from centre where id = ?";
  let centreName = await pool.query(getCentreName, [centreId]);
  if (centreName.length > 0) {
    centreName = centreName[0][0].name;
  }
  

  return res.send({ id, registDate, expireDate, centreName });
};

module.exports = {
  previewRegist,
};
