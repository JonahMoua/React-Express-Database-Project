import { Request, Response } from 'express';
import { User, sequelize } from '../services/db'; // Import your User model
import { Model } from 'sequelize';

const { Op } = require('sequelize');

const addUser = async (req: Request, res: Response) => {
  const userData = req.body

  try {

    await User.create(userData)

    res.status(201).json({
      success: true,
      data: userData,
    });
  } 
  catch (err) {
    console.error('Failed to add a new user.', err);
    res.status(500).json({
      success: false,
    });
  }
}


const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const updatedUserData = req.body; //this is prob the same error as adding

  try {
    const updatedUserDetails = await User.findOne({
      where: { id: userId },
    });

    if (updatedUserDetails) {
  
      updatedUserDetails.update(updatedUserData);

      
      await updatedUserDetails.save();

      res.json({
        success: true,
        data: updatedUserDetails,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
  } 
  catch (err) {
    console.error('Failed to update user.', err);
    res.status(500).json({
      success: false,
    });
  }
};



async function deleteUser(req: Request, res: Response) {
  const userId = req.params.id;

  try {
    await User.destroy({ where: { id: userId } });
    res.status(204).send();
  } 
  catch (err) {
    console.error('Failed to delete user.', err);
    res.status(500).json({
      success: false,
    });
  }
}

async function searchUsers(req: Request, res: Response) {
  const { q: searchTerm } = req.query;

  try {
    const searchResults = await User.findAll({
      where: {
        [Op.or]: [
          {
            id: {
              [Op.eq]: searchTerm,
            },
          },
          {
            registered: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          {
            firstName: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          {
            middleName: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          {
            lastName: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          {
            email: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          {
            phoneNumber: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          {
            address: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          {
            adminNotes: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
        ],
      },
    });

    res.json({
      success: true,
      data: {
        results: searchResults
      },
    });
  } catch (err) {
    console.error('Failed to search users.', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
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

export default{
  addUser,
  updateUser,
  deleteUser,
  searchUsers,
  sortUsers,
  getPaginatedUsers,
};
