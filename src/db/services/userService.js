import db from '../index';

const userService = {
  // Add a new user
  async addUser(userData) {
    try {
      const newUser = {
        its: userData.its, // Ensure ITS is set as the key
        ...userData,
        createdAt: new Date(),
        status: 'active'
      };
      
      // Check if user with this ITS already exists
      const existingUser = await db.users.get(userData.its);
      if (existingUser) {
        throw new Error(`User with ITS ${userData.its} already exists`);
      }
      
      await db.users.add(newUser);
      return newUser;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  },

  // Get user by ITS
  async getUserByIts(its) {
    try {
      return await db.users.get(its.toString());
    } catch (error) {
      console.error('Error getting user by ITS:', error);
      throw error;
    }
  },

  // Get user by ID (kept for backward compatibility)
  async getUserById(id) {
    return this.getUserByIts(id);
  },

  // Update user
  async updateUser(its, updates) {
    try {
      // Prevent changing the ITS number as it's the primary key
      if (updates.its && updates.its !== its) {
        throw new Error('Cannot change ITS number as it is the primary key');
      }
      
      const user = await this.getUserByIts(its);
      if (!user) {
        throw new Error(`User with ITS ${its} not found`);
      }
      
      await db.users.update(its, updates);
      return await this.getUserByIts(its);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Get all users
  async getAllUsers() {
    try {
      const users = await db.users.toArray();
      console.log('All users in DB:', users);
      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  },
  
  // Debug function to list all users
  async debugListAllUsers() {
    try {
      const users = await this.getAllUsers();
      console.log('=== DEBUG: All Users in Database ===');
      users.forEach((user, index) => {
        console.log(`User ${index + 1}:`, user);
      });
      console.log('Total users:', users.length);
      console.log('===================================');
      return users;
    } catch (error) {
      console.error('Debug error:', error);
      throw error;
    }
  },

  // Import users from XLSX data
  async importUsersFromXLSX(data) {
    try {
      const results = {
        success: 0,
        errors: [],
        total: data.length
      };

      await db.transaction('rw', db.users, async () => {
        for (const user of data) {
          try {
            // Skip if no ITS number
            if (!user.its) {
              results.errors.push({ user, error: 'Missing ITS number' });
              continue;
            }

            // Check for duplicate
            const existingUser = await db.users.get(user.its);
            if (existingUser) {
              results.errors.push({ user, error: `Duplicate ITS: ${user.its}` });
              continue;
            }

            // Add new user with ITS as key
            await db.users.put({
              its: user.its, // Explicitly set ITS as key
              ...user,
              createdAt: new Date(),
              status: 'pending'
            });
            results.success++;
          } catch (error) {
            results.errors.push({ user, error: error.message });
          }
        }
      });

      return results;
    } catch (error) {
      console.error('Error importing users:', error);
      throw error;
    }
  },

  // Delete user by ITS
  async deleteUser(its) {
    try {
      const user = await this.getUserByIts(its);
      if (user) {
        await db.users.delete(user.id);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};

export default userService;
