import { Injectable, Injector } from '@angular/core';
import { Category } from './category.model';
import { BaseResourceService } from '../../../shared/service/base-resource.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseResourceService<Category> {

  constructor(protected injector: Injector) {
    super("categorias", "user_id=jaqueline_santos", injector, Category.fromJson);
  }

} 

