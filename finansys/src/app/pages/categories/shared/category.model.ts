import { BaseResourceModel } from "src/app/shared/models/base-resource.model";

export class Category extends BaseResourceModel {
    constructor(
      public user_id?:string,
      public description?: string,
      public id?: number,
      public name?: string,
    ){
      super();
    }

     static fromJson(jsonData: any): Category {
      return Object.assign(new Category(), jsonData)
    }  
  
  } 