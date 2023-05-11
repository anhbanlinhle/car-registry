import crypto from 'crypto';
import pool from '../../../configs/connectDB';
// logic - Lấy data từ body, kiểm tra tồn tại acc hay chưa, sau đó check pass mới và repass nếu pass mới và repass khớp thì insert vào db, nếu không thì trả về lỗi
// task - tạo acc mới và centre mới

let insertCentre = async (req, res) => {

    let name = req.body.centreName;
    let city = req.body.city;
    let district = req.body.district;
    let email = req.body.email;
    let password = crypto.createHash('sha256').update("z").digest('hex');
    
    if (carType === undefined || order === undefined || resPerPage === undefined || page === undefined) {
        return res.status(422).send({message: 'Missing parameter!'})
    }

    let type = 0;
    
    //Kiểm tra tồn tại chưa
    let check = 'select * from account where email = ?'
    const [rows, fields] = await pool.query(check, [email])
    if (rows.length > 0) {
        return res.status(400).send({message: 'Email already exists'})
    }
    else {
        let insertAcc = 'insert into account (email, password, type) values (?, ?, ?)'
        let insertCen = 'insert into centre (name, city, district, activation) values (?, ?, ?, CURRENT_DATE())'
        
        await pool.query(insertCen, [name, city, district])
        await pool.query(insertAcc, [email, password, type])
        return res.status(200).send({message: 'Account created'})
    }
}

module.exports = {
    insertCentre
}