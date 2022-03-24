import { Component, Injector, OnInit} from '@angular/core';
import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form/Base-resource-form.component';
import { Validators } from '@angular/forms';
import { Entry } from './../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import { Category } from "../../categories/shared/category.model";
import { CategoryService } from "../../categories/shared/category.service";

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})

export class EntryFormComponent extends BaseResourceFormComponent<Entry> implements OnInit{

  categories: Array<Category>;
  entry: Entry;
  typesList: Array<any>;

  constructor(
    protected entryService: EntryService,
    protected categoryService: CategoryService,
    protected injector: Injector
  ) {
    super(injector, new Entry(), entryService, Entry.fromJson)
   }

  ngOnInit() {
    super.ngOnInit();
    this.loadCategories()
    this.typesList = this.typeOptions
  }

  get typeOptions(): Array<any>{
    return Object.entries(Entry.types).map(
      ([value, text]) => {
        console.log()
        return {
          text: text,
          value: value
        }
      }
    )
  }

  protected buildResourceForm() {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      user_id: ["jaqueline_santos"],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ["expense", [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      category: [null, [Validators.required]],
    });
  }

  private loadCategories(){
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    );
  }

  protected createPageTitle(): string {
    return "Cadastro de novo lançamento"
  }

  protected editionPageTitle(): string {
    const resourceName = this.resource.name || "";
    return "Editando lançamento " + resourceName;
  }
}