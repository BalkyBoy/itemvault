import 'reflect-metadata';
import { UserRepository } from './repositories/user.repo';
import { ItemsRepository } from './repositories/items.repo';
import { AuthService } from './modules/auth/auth.service';
import { AuthController } from './modules/auth/auth.controller';
import { ItemsService } from './modules/items/items.service';
import { ItemsController } from './modules/items/items.controller';
import { DashboardService } from './modules/dashboard/dashboard.service';
import { DashboardController } from './modules/dashboard/dashboard.controller';
import { container } from 'tsyringe';

function registerDependenciesInternal(): void {
    container.registerSingleton('UserRepository', UserRepository);
    container.registerSingleton('AuthService', AuthService);
    container.registerSingleton(AuthController, AuthController);
    container.registerSingleton('ItemsRepository', ItemsRepository);
    container.registerSingleton('ItemsService', ItemsService);
    container.registerSingleton(ItemsController, ItemsController);
    container.registerSingleton('DashboardService', DashboardService);
    container.registerSingleton(DashboardController, DashboardController);
}

registerDependenciesInternal();

export function registerDependencies(): void {
    
}