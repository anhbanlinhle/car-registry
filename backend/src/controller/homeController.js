require("dotenv").config();

import { verifyToken } from "./verifyToken";
import { verifyAdmin } from "./verifyAdmin";
// section - user
  // section - authenticate
import { authenticate } from "./user/authenticate/authenticate";
import { logout } from "./user/authenticate/logout";
import { changePassword } from "./user/authenticate/changePassword";
  // section - info
import { centreInfo } from "./user/info/centreInfo";
import { getDataForChart } from "./centre/info/data4Chart";
import { detailModal } from "./user/info/detailModal";
import { previewInfo } from "./user/info/previewInfo";
  // section - owner
import { ownerInfo } from "./user/owner/ownerInfo";
  // section - stats
import { allArea } from "./user/stats/allArea";
import { allCentre } from "./user/stats/allCentre";
import { allCarBrand } from "./user/stats/allCarBrand";

// section - centre
  // section - filter
import { allBrand } from "./centre/filter/allBrand";
import { allCity } from "./centre/filter/allCity";
import { brand } from "./centre/filter/brand";
import { exactBrand } from "./centre/filter/exactBrand";
import { exactCity } from "./centre/filter/exactCity";
import { owner } from "./centre/filter/owner";
import { time } from "./centre/filter/time";
  // section - forecast
import { forecast } from "./centre/forecast/forecast";
  // section - info
import { previewRegist } from "./centre/info/previewRegist";
import { viewLatestRegist } from "./centre/info/viewLatestRegist";
  // section - management
import { newRegist } from "./centre/management/newRegist";
import { updateModify } from "./centre/management/updateModify";
  // section - owner
import { registHistory } from "./centre/owner/registHistory";
  // section - stats
import { allRegist } from "./centre/stats/allRegist";
import { registByLicense } from "./centre/stats/registByLicense";
import { registByTime } from "./centre/stats/registByTime";
import { registModal } from "./centre/stats/registModal";
  // section - vehicles
import { expired } from "./centre/vehicles/expired";
import { findByLicense } from "./centre/vehicles/findByLicense";
import { registed } from "./centre/vehicles/registed";
import { vehicles } from "./centre/vehicles/vehicles";

// section - department
  // section - filter
import { adminFilterBrand } from "./department/filter/adminFilterBrand";
import { adminFilterOwner } from "./department/filter/adminFilterOwner";
import { adminFilterTime } from "./department/filter/adminFilterTime";
import { adminViewAllBrand } from "./department/filter/adminViewAllBrand";
import { adminViewAllCity } from "./department/filter/adminViewAllCity";
import { adminViewExactBrand } from "./department/filter/adminViewExactBrand";
import { adminViewExactCity } from "./department/filter/adminViewExactCity";


  // section - forecast
import { forecastAll } from "./department/forecast/forecastAll";
import { forecastByCentre } from "./department/forecast/forecastByCentre";
import { forecastByArea } from "./department/forecast/forecastByArea.js";
  // section - management
import { addDataFromExcel } from "./department/management/addDataFromExcel";
import { insertCentre } from "./department/management/insertCentre";
import { removeCentre } from "./department/management/removeCentre";
import { previewCentreInfo } from "./department/management/previewCentreInfo";
import { updateCentreInfo } from "./department/management/updateCentreInfo";
import { searchCentreByName } from "./department/management/searchCentreByName";
// section - owner
import { ownerHistory } from "./department/owner/ownerHistory";
// section - stats
import { adminAllRegist } from "./department/stats/adminAllRegist";
import { adminRegistByLicense } from "./department/stats/adminRegistByLicense";
import { adminRegistByTime } from "./department/stats/adminRegistByTime";
import { adminRegistByCentre } from "./department/stats/adminRegistByCentre";
import { adminRegistByArea } from "./department/stats/adminRegistByArea";
  // section - vehicles
import { viewAllCentres } from "./department/vehicles/viewAllCentres";
import { viewAllVehicles } from "./department/vehicles/viewAllVehicles";
import { viewExpiredVehicles } from "./department/vehicles/viewExpiredVehicles";
import { viewRegistedVehicles } from "./department/vehicles/viewRegistedVehicles";
import { viewUnregistedVehicles } from "./department/vehicles/viewUnregistedVehicles";
import { searchByLicense } from "./department/vehicles/searchByLicense";

  // section - info
import { adminGetDataForChart } from "./department/info/adminGetDataForChart";
import { getRankByRegist } from "./department/info/getRankByRegist";
import { getProductiveYear } from "./department/info/getProductiveYear";
import { getBurstyMonth } from "./department/info/getBurstyMonth";

let homepage = async (req, res) => {
  console.log(
    req.session.id === undefined ? `Session: ` : `\x1b[4mSession\x1b[0m: `,
    req.session.id
  );
  console.log(
    req.session.userid === undefined ? `Userid: ` : `\x1b[4mUserid\x1b[0m: `,
    req.session.userid
  );
  console.log(
    req.session.token === undefined ? `Token: ` : `\x1b[4mToken\x1b[0m: `,
    req.session.token
  );

  return res.send([
    {
      session: req.session.id,
      userid: req.session.userid,
      token: req.session.token,
    },
  ]);
};

module.exports = {
  homepage, verifyToken, verifyAdmin,

  authenticate, logout, changePassword,
  centreInfo, getDataForChart, detailModal, previewInfo,
  ownerInfo,
  allArea, allCentre, allCarBrand,
  
  allBrand, allCity, brand, exactBrand, exactCity, owner, time,
  forecast,
  previewRegist, viewLatestRegist,
  newRegist, updateModify,
  registHistory,
  allRegist, registByLicense, registByTime, registModal,
  expired, findByLicense, registed, vehicles,
  
  forecastAll, forecastByCentre, forecastByArea, ownerHistory,
  addDataFromExcel, insertCentre, removeCentre, previewCentreInfo, updateCentreInfo, searchCentreByName,
  adminAllRegist, adminRegistByLicense, adminRegistByTime, adminRegistByCentre, adminRegistByArea,
  viewAllCentres, viewAllVehicles, viewRegistedVehicles, viewExpiredVehicles, viewUnregistedVehicles, searchByLicense,
  adminFilterBrand, adminFilterOwner, adminFilterTime, adminViewAllBrand, adminViewAllCity, adminViewExactBrand, adminViewExactCity,
  adminGetDataForChart, getRankByRegist, getProductiveYear, getBurstyMonth
};
