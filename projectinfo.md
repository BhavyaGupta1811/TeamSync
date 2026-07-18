backend
│
├── config
│   └── db.js
│
├── models
│   ├── User.js
│   ├── Project.js
│   ├── Task.js
│   └── Comment.js
│
├── controllers
│   ├── authController.js
│   ├── userController.js
│   ├── projectController.js
│   ├── taskController.js
│   ├── commentController.js
│   ├── dashboardController.js
│   ├── searchController.js
│   ├── profileController.js
│   └── reportController.js
│
├── routes
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── projectRoutes.js
│   ├── taskRoutes.js
│   ├── commentRoutes.js
│   ├── dashboardRoutes.js
│   ├── searchRoutes.js
│   ├── profileRoutes.js
│   └── reportRoutes.js
│
├── middleware
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   └── errorMiddleware.js
│
├── utils
│   └── generateToken.js
│
└── server.js

src
│
├── components
│   ├── Sidebar.jsx
│   ├── Navbar.jsx
│   ├── StatCard.jsx
│   ├── Loader.jsx
│   ├── CreateProject.jsx
│   ├── CreateTask.jsx
│   └── TaskComments.jsx
│
├── pages
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Projects.jsx
│   ├── Tasks.jsx
│   └── Profile.jsx
│
├── styles
│   ├── global.css
│   ├── Dashboard.css
│   ├── Navbar.css
│   ├── Sidebar.css
│   ├── Auth.css
│   ├── Projects.css
│   ├── Tasks.css
│   ├── Profile.css
│   ├── Modal.css
│   ├── Comments.css
│   └── Loader.css
│
├── services
│   └── api.js
│
├── context
│   └── AuthContext.jsx
│
├── App.jsx
├── main.jsx
└── routes.jsx