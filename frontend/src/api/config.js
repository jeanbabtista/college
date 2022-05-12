export const getUrlWithHost = (url) => `http://localhost:5000${url}`

export const getResponse = (isError, message, data = null) => ({
  error: isError,
  message,
  data,
})

const methods = {
  GET: 'GET',
  POST: 'POST',
}

export const endpoints = {
  user: {
    /*
    requires fields:
    - username: string
    - password: string
    - email: string
    */
    register: {
      url: getUrlWithHost('/user'),
      method: methods.POST,
    },
    /*
    requires fields:
    - username: string
    - password: string
    */
    login: {
      url: getUrlWithHost('/user/login'),
      method: methods.POST,
    },
    logout: {
      url: getUrlWithHost('/user/logout'),
      method: methods.GET,
    },
    getProfile: (id) => ({
      url: getUrlWithHost(`/user/${id}`),
      method: methods.GET,
    }),
  },
  message: {
    /*
    requires fields:
    - title: string
    - imagePath: string
    - user: string (id)
    - tags: [string]
    */
    create: {
      url: getUrlWithHost('/message'),
      method: methods.POST,
    },
    vote: (id, option) => ({
      url: getUrlWithHost(`/message/${id}/vote?option=${option}`),
      method: methods.GET,
    }),
    markInappropriate: (id) => ({
      url: getUrlWithHost(`/message/${id}/inappropriate`),
      method: methods.GET,
    }),
    filterDecay: {
      url: getUrlWithHost('/message/decay'),
      method: methods.GET,
    },
    getAll: {
      url: getUrlWithHost('/message'),
      method: methods.GET,
    },
  },
  tag: {
    getAllMessagesByTag: (tagId) => ({
      url: getUrlWithHost(`/tag/${tagId}`),
      method: methods.GET,
    }),
  },
  comment: {
    /*
    requires fields:
    - message: string (id)
    - user: string (id)
    - text: string
    */
    create: {
      url: getUrlWithHost('/comment'),
      method: methods.POST,
    },
  },
}
