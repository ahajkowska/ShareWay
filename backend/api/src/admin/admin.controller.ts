import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../users/entities/user.entity.js';
import { PaginationDto } from './dto/pagination.dto.js';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  async getAllUsers(@Query() paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    return this.adminService.getAllUsers(page, limit);
  }

  @Get('trips')
  async getAllTrips(@Query() paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    return this.adminService.getAllTrips(page, limit);
  }

  @Get('users/:id')
  async getUserById(@Param('id', ParseUUIDPipe) userId: string) {
    return this.adminService.getUserById(userId);
  }

  @Patch('users/:id/ban')
  @HttpCode(HttpStatus.OK)
  async banUser(@Param('id', ParseUUIDPipe) userId: string) {
    return this.adminService.banUser(userId);
  }

  @Patch('users/:id/unban')
  @HttpCode(HttpStatus.OK)
  async unbanUser(@Param('id', ParseUUIDPipe) userId: string) {
    return this.adminService.unbanUser(userId);
  }

  @Post('users/:id/reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Param('id', ParseUUIDPipe) userId: string) {
    return this.adminService.initiatePasswordReset(userId);
  }
}
