const { hashSync, compareSync } = require("bcrypt");

/**
 * Hash a password with 10 rounds
 * @param {string} password
 * @returns {string}
 */
const getHash = (password) => hashSync(password, 10);

/**
 * Check if a password is valid
 * @param {string} password
 * @param {string} hash
 */
const isValidPassword = (password, hash) => compareSync(password, hash);

module.exports = { getHash, isValidPassword };