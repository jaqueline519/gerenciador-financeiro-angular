import { Observable } from 'rxjs';
import { CategoryService } from './../../categories/shared/category.service';
import { BaseResourceService } from 'src/app/shared/service/base-resource.service';
import { Injectable, Injector } from '@angular/core';
import { Entry } from './entry.model';
import { catchError, map } from 'rxjs/operators';
import * as moment from "moment"
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class EntryService extends BaseResourceService<Entry>{

  constructor(
    protected injector: Injector, 
    private categoryService: CategoryService,
    private route: ActivatedRoute
    ){ 
    super("lancamentos", "user_id=jaqueline_santos", injector, Entry.fromJson)
  }

   create(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServer(entry, super.create.bind(this));
  } 

  update(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServer(entry, super.update.bind(this))
  }

  getByMonthAndYear(month: number, year: number): Observable<Entry[]>{
    return this.getAll().pipe(
      map(entries => this.filterByMonthAndYear(entries, month, year))
    )
}
  
  private setCategoryAndSendToServer(entry: Entry, sendFn: any): Observable<Entry>{
    return this.categoryService.getById(entry.category.id).pipe(
     category => {
        entry.category
        return sendFn(entry)
      },
      catchError(this.handleError)
    );
  }

  private filterByMonthAndYear(entries: Entry[], month: number, year: number) {
    return entries.filter(entry => {
      const entryDate = moment(entry.date, "DD/MM/YYYY");
      const monthMatches = entryDate.month() + 1 == month;
      const yearMatches = entryDate.year() == year;

      if(monthMatches && yearMatches) return entry;
    })
  }
}