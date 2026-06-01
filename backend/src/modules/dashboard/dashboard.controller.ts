import { inject, injectable } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';
import { DashboardService } from './dashboard.service';
import { SuccessResponse } from '@/shared/utils/response.util';

@injectable()
export class DashboardController {
  constructor(
    @inject('DashboardService')
    private dashboardService: DashboardService
  ) {}

  getStats = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = await this.dashboardService.getStats();
      res.json(SuccessResponse('Dashboard stats retrieved', data));
    } catch (error) {
      next(error);
    }
  };

  getRecentItems = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const items = await this.dashboardService.getRecentItems();
      res.json(SuccessResponse('Recent items retrieved', items));
    } catch (error) {
      next(error);
    }
  };
}
