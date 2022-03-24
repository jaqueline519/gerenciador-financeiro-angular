import { BaseResourceModel } from "../models/base-resource.model";
import { Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

export abstract class BaseResourceService<T extends BaseResourceModel> {

  resource: BaseResourceModel;
  protected http: HttpClient;
  baseUrl = "https://p38yx781aa.execute-api.us-east-1.amazonaws.com/Stage";
  protected path: string = `${this.baseUrl}/${this.type}?${this.apiPath}`

  constructor(
    protected type: string,
    protected apiPath: string,
    protected injector: Injector,
    protected jsonDataToResourceFn: (jsonData: any) => T) {
    this.http = injector.get(HttpClient);
  }

  getAll(): Observable<T[]> {
    return this.http.get(this.path).pipe(
      map(this.jsonDataToResources.bind(this)),
      catchError(this.handleError)
    )
  }

  getById(id): Observable<T> {
    const url = `${this.baseUrl}/${this.type}/${id}?${this.apiPath}`;
    console.log(url)
    return this.http.get(url).pipe(
      map(this.jsonDataToResource.bind(this)),
      catchError(this.handleError)
    )
  }

  create(resource: T): Observable<T> {
    const url = `${this.baseUrl}/${this.type}`
    return this.http.post(url, resource).pipe(
      map(() => resource),
      catchError(this.handleError)
    )
  }

  update(resource: T): Observable<T> {
    const url = `${this.baseUrl}/${this.type}`;
    return this.http.put(url, resource).pipe(
      map(() => resource),
      catchError(this.handleError)
    )
  }

  delete(id: number): Observable<any> {
    const url = `${this.baseUrl}/${this.type}?${this.apiPath}&id=${id}`;
    return this.http.delete(url).pipe(
      map(() => null),
      catchError(this.handleError)
    )
  }

  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach(element => resources.push(this.jsonDataToResourceFn(element)));
    return resources;
  }

  protected jsonDataToResource(jsonData: any): T {
    return this.jsonDataToResourceFn(jsonData);
  }

  protected handleError(error: any): Observable<any> {
    console.log("ERRO NA REQUISIÇÃO => ", error);
    return throwError(error);
  }

}