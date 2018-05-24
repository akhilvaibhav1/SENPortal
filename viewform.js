var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReconciliationService } from '../../services/reconciliation.service';
import { IndependenceCustomerService } from '../../services/independenceCustomer.service';
import { IndependenceEquipmentService } from '../../services/independenceEquipment.service';
import { ReconciliationComponent } from '../reconciliation.component';
import { SearchForm } from './searchform.component';
import { jqxDateTimeInputComponent } from '../../../jqwidgets-ts/angular_jqxdatetimeinput';
var ViewEditForm = (function () {
    function ViewEditForm(route, router, reconService, custService, equipmentService, reconComponent, searchScreen) {
        this.route = route;
        this.router = router;
        this.reconService = reconService;
        this.custService = custService;
        this.equipmentService = equipmentService;
        this.reconComponent = reconComponent;
        this.searchScreen = searchScreen;
        this.input = {};
        this.disableFields = true;
        this.disableModemModel = true;
        this.disableNUCModel = true;
        this.alertMessage = "";
        this.addCustomerLoading = false;
        this.reviewMode = false;
        this.added = false;
    }
    ViewEditForm.prototype.ngOnInit = function () {
        var _this = this;
        this.disableFields = true;
        this.disableNUCModel = true;
        this.disableModemModel = true;
        this.custService.getCustomerBaseValues('add').then(function (res) {
            _this.bottlerListResponse = res.bottlers;
            _this.countryListResponse = res.countries;
            _this.stateListResponse = res.states;
            _this.acntNameResponse = res.accounts;
            _this.custBussSegmListResponse = res.custBussChannels;
            _this.thrdPartyCustIds = res.thrdPartyCustIds;
        });
        this.equipmentService.getEquipmentBaseValues().then(function (res) {
            _this.manufacturerListResponse = res;
        });
        this.clearField();
    };
    ViewEditForm.prototype.onCountryChange = function () {
        this.disableFields = false;
        this.added = false;
    };
    ViewEditForm.prototype.onNUCMakeChange = function () {
        var _this = this;
        this.disableNUCModel = false;
        var temp = this.manufacturerListResponse;
        var newTemp = {};
        for (var t in temp) {
            newTemp[temp[t]["key"]] = temp[t]["value"];
        }
        JSON.stringify(newTemp);
        this.equipmentService.getModelandSerialByPartManufacturer(this.input.manufacturer, newTemp[this.input.manufacturer]).then(function (res) {
            _this.modelAndSerialResponse = res[0];
        });
    };
    ViewEditForm.prototype.onEquipMakeChange = function () {
        var _this = this;
        this.disableModemModel = false;
        this.disableFields = false;
        var temp = this.manufacturerListResponse;
        var newTemp = {};
        for (var t in temp) {
            newTemp[temp[t]["value"]] = temp[t]["key"];
        }
        JSON.stringify(newTemp);
        this.equipmentService.getModelandSerialByManufacturer(newTemp[this.input.manufacturer], this.input.manufacturer).then(function (res) {
            _this.modelAndSerialResponse = _this.getDistinctModels(res);
        });
    };
    ViewEditForm.prototype.getDistinctModels = function (allModel) {
        var finalModel = [];
        var modelSkeleton;
        var addedItemId = [];
        for (var model in allModel) {
            var myModel = allModel[model];
            for (var m in myModel) {
                modelSkeleton = { "equipmentMakeModel": "", "equipmentModelValue": "" };
                if (myModel[m] instanceof Object && addedItemId.indexOf(myModel[m]["equipmentMakeModel"]) == -1) {
                    modelSkeleton.equipmentMakeModel = myModel[m]["equipmentMakeModel"];
                    modelSkeleton.equipmentModelValue = myModel[m]["equipmentModelValue"];
                    addedItemId.push(myModel[m]["equipmentMakeModel"]);
                    finalModel.push(modelSkeleton);
                }
            }
        }
        return finalModel;
    };
    ViewEditForm.prototype.backToSearchForm = function () {
        this.reconComponent.showAdd = false;
        this.input = {};
    };
    ViewEditForm.prototype.onResetClick = function () {
        this.disableFields = true;
    };
    ViewEditForm.prototype.clearField = function () {
        this.input = {};
    };
    ViewEditForm.prototype.reviewForm = function () {
        if (this.input.btlrNm != null && this.input.country != null && this.input.custNm != null
            && this.input.eqpmtLocDsc != null && this.input.eqpmtSrlNum != null
            && this.input.eqpmtType != null && this.input.nucSerialNum != null
            && this.input.modemSerialNum != null) {
            console.log("Loading review screen");
            this.reviewMode = true;
        }
        else {
            alert('Please enter all the mandatory fields');
        }
    };
    ViewEditForm.prototype.backToEditForm = function () {
        this.reviewMode = false;
    };
    ViewEditForm.prototype.cancelForm = function () {
        this.reviewMode = false;
        this.input = {};
    };
    ViewEditForm.prototype.submitForm = function () {
        var _this = this;
        this.addCustomerLoading = true;
        this.reconService.addForm(this.input).then(function (res) {
            _this.addCustomerLoading = false;
            if (res) {
                _this.searchScreen.added = true;
                _this.reconComponent.showAdd = false;
                _this.input = {};
            }
        });
    };
    return ViewEditForm;
}());
__decorate([
    ViewChild('addCustResponseMessage'),
    __metadata("design:type", ElementRef)
], ViewEditForm.prototype, "elModal", void 0);
__decorate([
    ViewChild('deploymentDate'),
    __metadata("design:type", jqxDateTimeInputComponent)
], ViewEditForm.prototype, "deploymentDate", void 0);
__decorate([
    ViewChild('goLiveDateRef'),
    __metadata("design:type", jqxDateTimeInputComponent)
], ViewEditForm.prototype, "goLiveDate", void 0);
ViewEditForm = __decorate([
    Component({
        selector: 'viewEditForm',
        templateUrl: 'app/reconciliation/forms/viewform.component.html',
        styleUrls: ['app/reconciliation/forms/viewform.css'],
    }),
    __metadata("design:paramtypes", [ActivatedRoute,
        Router, ReconciliationService,
        IndependenceCustomerService,
        IndependenceEquipmentService,
        ReconciliationComponent,
        SearchForm])
], ViewEditForm);
export { ViewEditForm };
//# sourceMappingURL=viewform.js.map