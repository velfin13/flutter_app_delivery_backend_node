const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const storage = require("../utils/cloud_storage");

module.exports = {
  login(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    User.findUserByEmail(email, async (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Hubo un error con el registro del usuario",
          error: err,
        });
      }

      if (!data) {
        return res.status(401).json({
          success: false,
          message: "Contraseña es incorrecta o Usuario incorrecto",
          error: err,
        });
      }

      const isPasswordValid = await bcrypt.compare(password, data.password);

      if (isPasswordValid) {
        const token = jwt.sign(
          { id: data.id, email: data.email },
          process.env.secretOrKey,
          {}
        );

        const myUser = {
          id: `${data.id}`,
          name: data.name,
          lastname: data.lastname,
          email: data.email,
          phone: data.phone,
          image: data.image,
          sesion_token: `JWT ${token}`,
        };

        return res.status(201).json({
          success: true,
          message: "El usuario fue autenticado correctamente",
          data: myUser, // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "Contraseña es incorrecta o Usuario incorrecto",
          error: err,
        });
      }
    });
  },

  register(req, res) {
    const user = req.body; // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE
    User.create(user, (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Hubo un error con el registro del usuario",
          error: err,
        });
      }

      return res.status(201).json({
        success: true,
        message: "El registro se realizo correctamente",
        data: data, // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
      });
    });
  },

  async registerWithImage(req, res) {
    const user = JSON.parse(req.body.user); // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE

    const files = req.files;

    if (files.length > 0) {
      const path = `image_${Date.now()}`;
      const url = await storage(files[0], path);
      if (url != undefined && url != null) {
        user.image = url;
      }
    }

    User.create(user, (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Hubo un error con el registro del usuario",
          error: err,
        });
      }

      user.id = `${data}`;

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.secretOrKey,
        {}
      );

      user.sesion_token = `JWT ${token}`;

      return res.status(201).json({
        success: true,
        message: "El registro se realizo correctamente",
        data: user, // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
      });
    });
  },
};
