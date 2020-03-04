import router, { asyncRoutes, constantRoutes } from "@/router";

/**
 * Use meta.role to determine if the current user has permission
 * @param perms
 * @param route
 */
function hasPermission(perms, route) {
  if (route.meta && route.meta.perms) {
    return perms.includes(route.meta.perms);
  } else {
    return true;
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param perms
 */
export function filterAsyncRoutes(routes, perms) {
  const res = [];

  routes.forEach(route => {
    const tmp = { ...route };
    if (hasPermission(perms, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, perms);
      }
      res.push(tmp);
    }
  });
  return res;
}

const state = {
  routes: [],
  addRoutes: []
};

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes;
    state.routes = constantRoutes.concat(routes);
  }
};

const actions = {
  generateRoutes({ commit }, menus) {
    return new Promise(resolve => {
      let accessedRoutes;
      let permsList = menus.reduce((p, v) => {
        p.push(v.perms);
        return p;
      }, []);
      accessedRoutes = filterAsyncRoutes(asyncRoutes, permsList);
      router.addRoutes(accessedRoutes);
      commit("SET_ROUTES", accessedRoutes);
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
