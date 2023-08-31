// controllers.ts

import { Request, Response } from 'express';
import { User } from '../services/db'; // Import your User model

async function addUser(req: Request, res: Response) {
  const userData = req.body;

  try {
    const newUser = await User.create(userData);
    res.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (err) {
    console.error('Failed to add a new user.', err);
    res.status(500).json({
      success: false,
    });
  }
}

async function updateUser(req: Request, res: Response) {
  const userId = req.params.id;
  const updatedUserData = req.body;

  try {
    await User.update(updatedUserData, {
      where: { id: userId },
    });
    res.json({
      success: true,
      message: 'User updated successfully',
    });
  } catch (err) {
    console.error('Failed to update user.', err);
    res.status(500).json({
      success: false,
    });
  }
}

async function deleteUser(req: Request, res: Response) {
  const userId = req.params.id;

  try {
    await User.destroy({ where: { id: userId } });
    res.status(204).send();
  } catch (err) {
    console.error('Failed to delete user.', err);
    res.status(500).json({
      success: false,
    });
  }
}

async function searchUsers(req: Request, res: Response) {
  const searchTerm = req.query.q;

  try {
    const searchResults = await User.findAll({
      where: { firstName: { $like: `%${searchTerm}%` } }, // Adjust this query as per your database setup
    });
    res.json({
      success: true,
      data: searchResults,
    });
  } catch (err) {
    console.error('Failed to search users.', err);
    res.status(500).json({
      success: false,
    });
  }
}

async function sortUsers(req: Request, res: Response) {
  const sortByField = req.query.field as string;
  const sortOrder = req.query.order as 'ASC' | 'DESC';

  try {
    const sortedUsers = await User.findAll({
      order: [[sortByField, sortOrder]],
    });
    res.json({
      success: true,
      data: sortedUsers,
    });
  } catch (err) {
    console.error('Failed to sort users.', err);
    res.status(500).json({
      success: false,
    });
  }
}

async function getPaginatedUsers(req: Request, res: Response) {
  const { page, pageSize } = req.query;

  const offset = (Number(page) - 1) * Number(pageSize);

  try {
    const paginatedUsers = await User.findAll({
      offset,
      limit: Number(pageSize),
    });

    res.json({
      success: true,
      data: paginatedUsers,
    });
  } catch (err) {
    console.error('Failed to fetch paginated users.', err);
    res.status(500).json({
      success: false,
    });
  }
}

export {
  addUser,
  updateUser,
  deleteUser,
  searchUsers,
  sortUsers,
  getPaginatedUsers,
};
