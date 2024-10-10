
import { Controller, Post, Delete, Param } from '@nestjs/common';
import { UserService } from './user.service';  // Assuming user service exists

@Controller('compliance')
export class ComplianceController {
  constructor(private readonly userService: UserService) {}

  @Delete('data/:userId')
  deleteUserData(@Param('userId') userId: number) {
    // This function would trigger the deletion of all personal data (GDPR compliance)
    return this.userService.deleteUserData(userId);
  }

  @Post('export/:userId')
  exportUserData(@Param('userId') userId: number) {
    // This function would trigger the export of all personal data
    return this.userService.exportUserData(userId);
  }
}
