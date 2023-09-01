import { Router } from 'express';
import IRoute from '../types/IRoute';
import UsersController from '../cotrollers/controller'; 

const UsersRouter: IRoute = {
  route: '/users',
  router() {
    const router = Router();

    router.route('/')
      .get(UsersController.getPaginatedUsers) 
      .post(UsersController.addUser);

    router.get('/search', UsersController.searchUsers);
    router.get('/sort', UsersController.sortUsers);

    router.route('/:id')
      .put(UsersController.updateUser)
      .delete(UsersController.deleteUser);

    return router;
  },
};

export default UsersRouter;
