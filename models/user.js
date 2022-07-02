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
  const sql = `SELECT
                CONVERT(U.id,CHAR),
                U.email,
                U.name,
                U.lastname,
                U.phone,
                U.image,
                U.password,
                JSON_ARRAYAGG(
                    json_object(
                        "id",
                        CONVERT(R.id,CHAR),
                        "name",
                        R.name,
                        "image",
                        R.image,
                        "route",
                        R.route
                    )
                ) as roles
              FROM
                users as U
                inner join user_has_roles as UHR on U.id = UHR.id_user
                inner join roles R on R.id = UHR.id_rol
              WHERE
                U.id = ?
              group by
                U.id;`;

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
  const sql = `SELECT
                  U.id,
                  U.email,
                  U.name,
                  U.lastname,
                  U.phone,
                  U.image,
                  U.password,
                  JSON_ARRAYAGG(
                      json_object(
                          "id",
                          CONVERT(R.id,CHAR),
                          "name",
                          R.name,
                          "image",
                          R.image,
                          "route",
                          R.route
                      )
                  ) as roles
                FROM
                  users as U
                  inner join user_has_roles as UHR on U.id = UHR.id_user
                  inner join roles R on R.id = UHR.id_rol
                WHERE
                  email = ?
                group by
                  U.id;`;

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

User.update = async (user, result) => {
  const sql = `UPDATE users 
              set name=?, 
              lastname=?, 
              phone=?,
              image=?,
              updated_at=?
              where id = ?;
  `;
  db.query(
    sql,
    [
      user.name,
      user.lastname,
      user.phone,
      user.image,
      new Date(),
      user.id
    ],
    (err, res) => {
      if (err) {
        console.log("Error:", err);
        result(err, null);
      } else {
        console.log("Usuario actualizado!! ", res.id);
        result(null, user.id);
      }
    }
  );
};

User.updateWithOutImage = async (user, result) => {
  const sql = `UPDATE users 
              set name=?, 
              lastname=?, 
              phone=?,
              updated_at=?
              where id = ?;
  `;
  db.query(
    sql,
    [
      user.name,
      user.lastname,
      user.phone,
      new Date(),
      user.id
    ],
    (err, res) => {
      if (err) {
        console.log("Error:", err);
        result(err, null);
      } else {
        console.log("Usuario actualizado!! ", res.id);
        result(null, user.id);
      }
    }
  );
};

module.exports = User;
