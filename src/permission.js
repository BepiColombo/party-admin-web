import router from "./router";
import store from "./store";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/storage"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login", "/auth-redirect"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = getToken();
  // console.log("router permission", hasToken);
  if (hasToken) {
    if (to.path === "/login") {
      // if is logged in, redirect to the home page
      next();
      NProgress.done();
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasPerms = store.getters.perms && store.getters.perms.length > 0;
      if (hasPerms) {
        next();
      } else {
        try {
          // console.log("router permission try:");
          // get user info
          const { menus } = await store.dispatch("user/getInfo");

          // generate accessible routes map based on roles
          await store.dispatch("permission/generateRoutes", menus);

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true });
          // next();
        } catch (error) {
          // console.log("router permission err:", error);
          // remove token and go to login page to re-login
          await store.dispatch("user/resetToken");
          // next(`/login?redirect=${to.path}`);
          next(`/login`);
        } finally {
          NProgress.done();
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login`);
      NProgress.done();
    }
    next();
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
