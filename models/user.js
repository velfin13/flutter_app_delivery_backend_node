const db = require("../config/config");
const bcrypt = require("bcryptjs");

const User = {};

User.create = async (user, result) => {
  const hash = await bcrypt.hash(user.password, 10);
  const sql = `
        INSERT INTO
            users(
                email,
                name,
                lastname,
                phone,
                image,
                password,
                created_at,
                updated_at
            )
        VALUES(?, ?, ?, ?, ?, ?, ?, ?)
    `;

  db.query(
    sql,
    [
      user.email,
      user.name,
      user.lastname,
      user.phone,
      user.image,
      hash,
      new Date(),
      new Date(),
    ],
    (err, res) => {
      if (err) {
        console.log("Error:", err);
        result(err, null);
      } else {
        console.log("Id del nuevo usuario:", res.insertId);
        result(null, res.insertId);
      }
    }
  );
};

User.findUserByID = async (id, result) => {
  const sql = `SELECT id, email, name, lastname, phone, image, password FROM users WHERE id=?;`;
  db.query(sql, [id], (err, res) => {
    if (err) {
      console.log("Error:", err);
      result(err, null);
    } else {
      console.log("Usuario:", res[0]);
      result(null, res[0]);
    }
  });
};

User.findUserByEmail = async (email, result) => {
  const sql = `SELECT id, email, name, lastname, phone, image, password FROM users WHERE email=?;`;
  db.query(sql, [email], (err, res) => {
    if (err) {
      console.log("Error:", err);
      result(err, null);
    } else {
      console.log("Usuario:", res[0]);
      result(null, res[0]);
    }
  });
};

module.exports = User;
