import { OnInit, AfterContentChecked, Injector, Directive } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../service/base-resource.service';
import toastr from "toastr";
import * as uuid from 'uuid';

@Directive()
export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

    currentAction: string;
    resourceForm: FormGroup;
    pageTitle: string;
    serverErrorMessages: string[] = null;
    submittingForm: boolean = false;
    idNotExists: boolean;
    generatedId: number;

    protected route: ActivatedRoute;
    protected router: Router;
    protected formBuilder: FormBuilder;
    protected resourceId: number;
    protected userId: string = "jaqueline_santos"

    constructor(
        protected injector: Injector,
        public resource: T,
        protected resourceService: BaseResourceService<T>,
        protected jsonDataToResourceFn: (jsonData) => T
    ) {
        this.route = this.injector.get(ActivatedRoute);
        this.router = this.injector.get(Router);
        this.formBuilder = this.injector.get(FormBuilder);
    }

    ngOnInit() {
        this.setCurrentAction();
        this.buildResourceForm();
        this.loadResource();
        this.route.params.subscribe(params => this.resourceId = params['id']);
    }


    ngAfterContentChecked() {
        this.setPageTitle();
    }

    submitForm() {
        this.submittingForm = true;

        if (this.currentAction == "new")
            this.createResource();
        else 
            this.updateResource();
    }

    protected setCurrentAction() {
        if (this.route.snapshot.url[0].path == "new")
            this.currentAction = "new"
        else
            this.currentAction = "edit"
    }

    protected loadResource() {
        if (this.currentAction == "edit") {
            this.route.paramMap.pipe(
                params => this.resourceService.getById(this.route.snapshot.url[0].path)
            )
                .subscribe(
                    resource => {
                        this.resource = resource;
                        this.resourceForm.patchValue(resource);
                    },
                    (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
                )
        }
    }

    protected setPageTitle() {
        if (this.currentAction == 'new')
            this.pageTitle = this.creationPageTitle();
        else {
            this.pageTitle = this.editionPageTitle();
        }
    }

    protected creationPageTitle(): string {
        return "Novo"
    }
    protected editionPageTitle(): string {
        return "Edição"
    }

    protected createResource() {
        const resource: T = this.jsonDataToResourceFn(this.resourceForm.value)
        const idString = uuid.v4().toString()
        const idNumbers = idString.replace(/([^\d])+/gim, '', "^\+?[1-9]\d*$")
        resource.id = idNumbers
        this.resourceService.create(resource)
            .subscribe(
                resource => this.actionsForSuccess(resource),
                error => this.actionsForError(error)
            )
    }

    protected updateResource() {
        const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);
        this.resourceService.update(resource)
            .subscribe(
                resource => this.actionsForSuccess(resource),
                error => this.actionsForError(error)
            )
        console.log("update executado = ", resource)
    }

    protected actionsForSuccess(resource: T) {
        toastr.success("Solicitação processada com sucesso!");
        const baseComponentPath: string = this.route.snapshot.parent.url[0].path;
        this.router.navigateByUrl(baseComponentPath).then(
            () => this.router.navigate([baseComponentPath, resource.id, "edit"])
        )
    }

    protected actionsForError(error) {
        toastr.error("Ocorreu um erro ao processar a sua solicitação!");

        this.submittingForm = false;

        if (error.status === 422)
            this.serverErrorMessages = JSON.parse(error._body).errors;
        else
            this.serverErrorMessages = ["Falha na comunicação com o servidor. Por favor, tente novamente mais tarde."]
    }

    protected abstract buildResourceForm(): void;

}
