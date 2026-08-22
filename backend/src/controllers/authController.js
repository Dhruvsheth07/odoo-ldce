import * as authService from '../services/authService.js';
import { success } from '../utils/apiResponse.js';

export async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    success(res, result, 'Registration successful', 201);
  } catch (err) { next(err); }
}

export async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    success(res, result, 'Login successful');
  } catch (err) { next(err); }
}

export async function logout(req, res) {
  // JWT is stateless — logout is handled client-side by removing the token
  success(res, null, 'Logged out successfully');
}

export async function me(req, res, next) {
  try {
    const user = await authService.getProfile(req.user.id);
    success(res, { user });
  } catch (err) { next(err); }
}
