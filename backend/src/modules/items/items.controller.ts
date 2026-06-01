import { inject, injectable } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';
import { ItemsService } from './items.service';
import {
  CreateItemDto,
  ListItemsQueryDto,
  UpdateItemDto,
} from './dto/items.dto';
import { PaginatedResponse, SuccessResponse } from '@/shared/utils/response.util';

@injectable()
export class ItemsController {
  constructor(
    @inject('ItemsService')
    private itemsService: ItemsService
  ) {}

  list = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const query = req.query as unknown as ListItemsQueryDto;
      const result = await this.itemsService.listItems(query);

      res.json(
        PaginatedResponse('Items retrieved', result.data, result.meta)
      );
    } catch (error) {
      next(error);
    }
  };

  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto: CreateItemDto = req.body;
      const item = await this.itemsService.createItem(req.userId!, dto);

      res.status(201).json(SuccessResponse('Item created', { item }));
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto: UpdateItemDto = req.body;
      const item = await this.itemsService.updateItem(
        req.userId!,
        req.params.id,
        dto
      );

      res.json(SuccessResponse('Item updated', { item }));
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.itemsService.deleteItem(req.userId!, req.params.id);

      res.json(SuccessResponse('Item deleted'));
    } catch (error) {
      next(error);
    }
  };
}
