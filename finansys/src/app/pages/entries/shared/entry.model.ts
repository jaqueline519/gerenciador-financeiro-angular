import { BaseResourceModel } from "src/app/shared/models/base-resource.model";
import { Category } from "../../categories/shared/category.model";

export class Entry extends BaseResourceModel{
  constructor(
    public date?: string,
    user_id?: string,
    public amount?: number,
    public description?: string,
    public id?: number,
    public name?: string,
    public paid?: boolean,
    public type?: string,
    public category?: Category
  ){ 
    super();
  }

  static types = {
    expense: 'Despesa',
    revenue: 'Receita'
  };
 
  static fromJson(jsonData: any): Entry {
    return Object.assign(new Entry(), jsonData)
  }
 
  get paidText(): string {
    return this.paid ? 'Pago' : 'Pedente'; //verifica se o lançamento foi pago ou não
  }
} 