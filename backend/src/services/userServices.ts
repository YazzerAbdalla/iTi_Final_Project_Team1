import userModel from "../models/userModel"; // Assuming userModel is a default export
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Define the interface for the login input
interface LoginInput {
  email: string;
  password: string;
}

export async function login({ email, password }: LoginInput) {
  try {
    // Correctly search for the user by email
    const findUser = await userModel.findOne({ email });

    // Check if user exists
    if (!findUser) {
      return { data: "Wrong email or password", statusCode: 400 };
    }

    // Compare provided password with stored hashed password
    const passwordMatch = await bcrypt.compare(password, findUser.password);

    // Check if the password matches
    if (!passwordMatch) {
      return { data: "Wrong email or password", statusCode: 400 };
    }

    // Login successful, return user data
    const token = jwt.sign(
      {
        email,
        firstName: findUser.firstName,
        lastName: findUser.lastName,
      },
      process.env.JWT_SECRET_KEY || ""
    );
    return { data: token, statusCode: 200 };
  } catch (error) {
    // Log the error for debugging
    console.error("Login error:", error);
    throw new Error("Something went wrong during login!");
  }
}

// Define the interface for the registration input
interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export async function register({
  firstName,
  lastName,
  email,
  password,
}: RegisterInput) {
  try {
    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return { data: "Email already exists", statusCode: 400 };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    const token = jwt.sign(
      {
        email,
        firstName,
        lastName,
      },
      process.env.JWT_SECRET_KEY || ""
    );
    return { data: token, statusCode: 200 };
  } catch (error) {
    // Log the error for debugging
    console.error("Registration error:", error);
    throw new Error("Something went wrong during registration!");
  }
}
