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