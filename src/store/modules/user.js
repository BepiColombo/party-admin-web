import { login, logout, getInfo } from "@/api/auth";
import { getToken, setToken, removeToken } from "@/utils/storage";
import router, { resetRouter } from "@/router";

const state = {
  token: getToken(),
  userInfo: "",
  perms: []
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
    setToken(token);
  },
  SET_PERMS: (state, perms) => {
    state.perms = perms;
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo;
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          const { data } = response;
          commit("SET_TOKEN", data.token);
          setToken(data.token);
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const { data } = response;

          if (!data) {
            reject("Verification failed, please Login again.");
          }

          const { menus, userInfo } = data;
          let perms = menus.reduce((p, v) => {
            p.push(v.perms);
            return p;
          }, []);

          commit("SET_PERMS", perms);
          commit("SET_USERINFO", userInfo);
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state, dispatch }) {
    commit("SET_TOKEN", "");
    commit("SET_PERMS", []);
    removeToken();
    resetRouter();
    dispatch("tagsView/delAllViews", null, { root: true });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit("SET_TOKEN", "");
      commit("SET_PERMS", []);
      removeToken();
      resolve();
    });
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + "-token";
      commit("SET_TOKEN", token);
      setToken(token);

      const { roles } = await dispatch("getInfo");

      resetRouter();

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch("permission/generateRoutes", roles, {
        root: true
      });

      // dynamically add accessible routes
      router.addRoutes(accessRoutes);

      // reset visited views and cached views
      dispatch("tagsView/delAllViews", null, { root: true });

      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
