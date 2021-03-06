import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";

// Route Views
import BlogOverview from "./views/BlogOverview";
import UserProfile from "./views/UserProfile";
import AddNewPost from "./views/AddNewPost";
import Errors from "./views/Errors";
import ComponentsOverview from "./views/ComponentsOverview";
import Tables from "./views/Tables";
import BlogPosts from "./views/BlogPosts";

import HomePage from "./views/Home";
import ProductPage from "./views/Product";
import AddProductPage from "./views/AddProduct";
import LogInPage from "./views/LogIn";
import EmptyLayout from "./layouts/Empty";
import SignUpPage from "./views/SignUp";

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/login" />
    // change this to login
  },
  {
    path: "/home",
    layout: DefaultLayout,
    component: HomePage
  },
  {
    path: "/products/", 
    layout: DefaultLayout,
    component: ProductPage
  },
  {
    path: "/add-product",
    layout: DefaultLayout,
    component: AddProductPage
  },
  {
    path: "/users/",
    layout: DefaultLayout,
    component: UserProfile
  },
  {
    path: "/login",
    layout: EmptyLayout,
    component: LogInPage
  },
  {
    path: "/signup",
    layout: EmptyLayout,
    component: SignUpPage
  },

  {
    path: "/blog-overview",
    layout: DefaultLayout,
    component: BlogOverview
  },

  {
    path: "/add-new-post",
    layout: DefaultLayout,
    component: AddNewPost
  },
  {
    path: "/errors",
    layout: DefaultLayout,
    component: Errors
  },
  {
    path: "/components-overview",
    layout: DefaultLayout,
    component: ComponentsOverview
  },
  {
    path: "/tables",
    layout: DefaultLayout,
    component: Tables
  },
  {
    path: "/blog-posts",
    layout: DefaultLayout,
    component: BlogPosts
  }
];
