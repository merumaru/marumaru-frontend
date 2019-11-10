export default function() {
  return [
    {
      title: "Home", 
      to: "/home",
      htmlBefore: '<i class="material-icons">explore</i>',
      htmlAfter: ""
    },
    {
      title: "Product Details", 
      to: "/products/1",
      htmlBefore: '<i class="material-icons">description</i>',
      htmlAfter: ""
    },
    {
      title: "Add New Product",
      htmlBefore: '<i class="material-icons">note_add</i>',
      to: "/add-product",
    },
    {
      title: "User Profile",
      htmlBefore: '<i class="material-icons">person</i>',
      to: "/user/:id",
    },
    {
      title: ".",
      htmlBefore: '<i class="material-icons">code</i>',
      to: "/errors",
    },
    {
      title: "Blog Dashboard",
      to: "/blog-overview",
      htmlBefore: '<i class="material-icons">edit</i>',
      htmlAfter: ""
    },
    {
      title: "Blog Posts",
      htmlBefore: '<i class="material-icons">vertical_split</i>',
      to: "/blog-posts",
    },
    {
      title: "Add New Post",
      htmlBefore: '<i class="material-icons">note_add</i>',
      to: "/add-new-post",
    },
    {
      title: "Forms & Components",
      htmlBefore: '<i class="material-icons">view_module</i>',
      to: "/components-overview",
    },
    {
      title: "Tables",
      htmlBefore: '<i class="material-icons">table_chart</i>',
      to: "/tables",
    },
    {
      title: "Errors",
      htmlBefore: '<i class="material-icons">error</i>',
      to: "/errors",
    }
  ];
}
