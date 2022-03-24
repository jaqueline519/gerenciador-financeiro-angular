import { Component, Injector} from '@angular/core';
import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form/Base-resource-form.component';
import { Category } from './../shared/category.model';
import { Validators } from "@angular/forms";
import { CategoryService } from "../shared/category.service";

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent extends BaseResourceFormComponent<Category> {

  constructor(protected categoryService: CategoryService, protected injector: Injector) { 
    super(injector, new Category(), categoryService, Category.fromJson)
  }

  protected buildResourceForm() {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      user_id: ["jaqueline_santos"],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  protected createPageTitle(): string {
    return "Cadastro de nova categoria"
  }

  protected editionPageTitle(): string {
    const categoryName = this.resource.name || "";
    return "Editando categoria " + categoryName;
  }
}
