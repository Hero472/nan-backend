
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';

// Function to encrypt sensitive data (e.g., passwords)
export async function encryptData(data: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(data, salt);
}

// Function to compare encrypted data (e.g., for login)
export async function compareData(data: string, hash: string): Promise<boolean> {
  return bcrypt.compare(data, hash);
}

// Function to log sensitive actions (e.g., user data modifications)
const logger = new Logger('SecurityLog');

export function logSensitiveAction(action: string, userId: number) {
  logger.log(`Action: ${action}, Performed by User ID: ${userId}`);
}
