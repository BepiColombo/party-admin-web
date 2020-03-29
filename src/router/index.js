import Vue from "vue";
import VueRouter from "vue-router";

// fix vue-router NavigationDuplicated
const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return VueRouterPush.call(this, location).catch(err => err);
};
const VueRouterReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
  return VueRouterReplace.call(this, location).catch(err => err);
};

Vue.use(VueRouter);

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载

/* Layout */
import Layout from "@/layout";

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    不用！control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index")
      }
    ]
  },
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },
  {
    path: "/auth-redirect",
    component: () => import("@/views/login/auth-redirect"),
    hidden: true
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404"),
    hidden: true
  },
  {
    path: "/401",
    component: () => import("@/views/error-page/401"),
    hidden: true
  }
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index"),
        name: "Dashboard",
        meta: {
          title: "概览",
          icon: "data",
          affix: true,
          perms: "dashboard"
        }
      }
    ]
  },
  {
    path: "/profile",
    component: Layout,
    redirect: "modify",
    children: [
      {
        path: "modify",
        component: () => import("@/views/modify_profile"),
        name: "ProfileModify",
        meta: {
          title: "修改资料"
        }
      }
    ],
    hidden: true
  },
  {
    path: "/article",
    component: Layout,
    redirect: "article",
    meta: {
      title: "文章管理",
      icon: "suggest",
      affix: false
    },
    children: [
      {
        path: "article",
        component: () => import("@/views/article/index"),
        name: "Article",
        meta: {
          title: "文章管理",
          icon: "suggest",
          affix: false,
          perms: "article:view"
        }
      },
      {
        path: "article_edit",
        component: () => import("@/views/article/edit"),
        name: "ArticleEdit",
        hidden: true,
        meta: {
          title: "编辑文章",
          icon: "suggest",
          affix: false,
          perms: ["article:update", "article:add"]
        }
      },
      {
        path: "article_detail",
        component: () => import("@/views/article/detail"),
        name: "ArticleDetail",
        hidden: true,
        meta: {
          title: "文章详情",
          icon: "suggest",
          affix: false
        }
      }
    ]
  },
  {
    path: "/user",
    component: Layout,
    redirect: "list",
    meta: {
      title: "用户管理",
      icon: "user-center",
      affix: false,
      perms: "user:view"
    },
    children: [
      {
        path: "list",
        component: () => import("@/views/user/index"),
        name: "User",
        meta: {
          title: "用户管理",
          icon: "user-center",
          affix: false,
          perms: "user:view"
        }
      }
    ]
  },
  {
    path: "/auth",
    component: Layout,
    redirect: "role",
    meta: {
      title: "权限管理",
      icon: "guanliyuan",
      affix: false,
      perms: "role:view"
    },
    children: [
      {
        path: "role",
        component: () => import("@/views/auth/role/index"),
        name: "Role",
        meta: {
          title: "角色管理",
          icon: "Customer management",
          affix: false,
          perms: "role:view"
        }
      },
      {
        path: "menu",
        component: () => import("@/views/auth/menu/index"),
        name: "Menu",
        meta: {
          title: "菜单管理",
          icon: "category",
          affix: false,
          perms: "menu:view"
        }
      }
    ]
  },
  {
    path: "/org",
    component: Layout,
    redirect: "org",
    meta: {
      title: "组织管理",
      icon: "connections",
      affix: false,
      perms: "org:view"
    },
    children: [
      {
        path: "org",
        component: () => import("@/views/org/index"),
        name: "Org",
        meta: {
          title: "组织管理",
          icon: "connections",
          affix: false,
          perms: "org:view"
        }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true }
];

const createRouter = () =>
  new VueRouter({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
