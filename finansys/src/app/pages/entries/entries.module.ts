import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID} from '@angular/core'; 
import { EntriesRoutingModule } from './entries-routing.module';
import { EntryListComponent } from './entry-list/entry-list.component';
import { EntryFormComponent } from './entry-form/entry-form.component';
import { CalendarModule } from 'primeng/calendar';
import { IMaskModule } from 'angular-imask';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
/* import ptBr from '@angular/common/locales/pt'; */
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt, 'pt-PT')

@NgModule({
  imports: [
    SharedModule,
    EntriesRoutingModule,
    CalendarModule,
    IMaskModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [{provide: LOCALE_ID, useValue: 'pt-PT'}],
  declarations: [EntryListComponent, EntryFormComponent],

})
export class EntriesModule { }
