// required in top level view - views/layouts/index.hbs
const globals = (user) => {
  const navbarProperties = {
    isLoggedIn: Boolean(user),
    user
  }

  return {
    ...navbarProperties
  }
}

module.exports = {
  globals
}
