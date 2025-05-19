const bcrypt = require("bcryptjs")

const salt = bcrypt.genSaltSync(10);

const hashPassword = (password)=> {
    return bcrypt.hashSync(password, salt);
}

const decryptPassword = (hashPassword, password)=> {
    return bcrypt.compareSync(password, hashPassword);
}

module.exports = {
    hashPassword,
    decryptPassword
}