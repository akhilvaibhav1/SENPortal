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
import { BlockUI } from 'ng-block-ui';
import { Router, ActivatedRoute } from '@angular/router';
import { ReconciliationService } from '../../services/reconciliation.service';
import { IndependenceCustomerService } from '../../services/independenceCustomer.service';
import { IndependenceEquipmentService } from '../../services/independenceEquipment.service';
import { ReconciliationComponent } from '../reconciliation.component';
import { SearchForm } from './searchform.component';
import { jqxDateTimeInputComponent } from '../../../jqwidgets-ts/angular_jqxdatetimeinput';
var AddForm = (function () {
    function AddForm(route, router, reconService, custService, equipmentService, reconComponent, searchScreen) {
        this.route = route;
        this.router = router;
        this.reconService = reconService;
        this.custService = custService;
        this.equipmentService = equipmentService;
        this.reconComponent = reconComponent;
        this.searchScreen = searchScreen;
        this.addData = {};
        this.disableFields = true;
        this.disableModemModel = true;
        this.disableNUCModel = true;
        this.alertMessage = "";
        this.reviewMode = false;
        this.disableEqpmtModel = false;
    }
    AddForm.prototype.ngOnInit = function () {
        var _this = this;
        this.disableFields = true;
        this.disableNUCModel = true;
        this.disableModemModel = true;
        this.disableEqpmtModel = true;
        this.reconService.loadFormDetails().then(function (res) {
            _this.addFormBlock.start('Loading...');
            _this.nucManufacturerListResponse = res.nucMake;
            _this.modemManufacturerListResponse = res.modemMake;
            _this.manufacturerListResponse = res.equipMake;
            _this.modemCarrierResponse = res.modemCarrier;
            _this.addFormBlock.stop();
        }).catch(function (err) {
            console.log("Error Processing loadFormDetails" + err);
            _this.addFormBlock.stop();
        });
        this.reconService.loadCtryStateBottler().then(function (res) {
            _this.countryListResponse = res.countries;
            _this.spireTypeList = res.spireUnitTypes;
            _this.addFormBlock.stop();
        }).catch(function (err) {
            console.log("Error Processing loadFormDetails" + err);
            _this.addFormBlock.stop();
        });
        this.clearField();
    };
    AddForm.prototype.onCountryChange = function () {
        var temp = this.countryListResponse;
        var newTemp = {};
        for (var t in temp) {
            newTemp[temp[t]["countryName"]] = temp[t]["countryId"];
        }
        JSON.stringify(newTemp);
        for (var i = 0; i < this.countryListResponse.length; i++) {
            var country = this.countryListResponse[i];
            if (country.countryName === this.addData.country) {
                this.stateListResponse = country.states;
                this.bottlerListResponse = country.bottlingPartners;
            }
        }
        if (this.addData.country != null && this.addData.country != "") {
            this.disableFields = false;
        }
        else {
            this.addData.btlrNm = null;
            this.addData.custState = null;
            this.disableFields = true;
        }
    };
    AddForm.prototype.onNUCMakeChange = function () {
        var _this = this;
        var temp = this.nucManufacturerListResponse;
        var newTemp = {};
        for (var t in temp) {
            newTemp[temp[t]["key"]] = temp[t]["value"];
        }
        JSON.stringify(newTemp);
        this.reconService.getModelByPartManufacturer(this.addData.nucMake, newTemp[this.addData.nucMake]).then(function (res) {
            _this.nucModelResponse = res;
        });
        if (this.addData.nucMake != null && this.addData.nucMake != "") {
            this.disableNUCModel = false;
        }
        else {
            this.disableNUCModel = true;
        }
    };
    AddForm.prototype.onModemMakeChange = function () {
        var _this = this;
        var temp = this.modemManufacturerListResponse;
        var newTemp = {};
        for (var t in temp) {
            newTemp[temp[t]["key"]] = temp[t]["value"];
        }
        JSON.stringify(newTemp);
        this.reconService.getModelByPartManufacturer(this.addData.modemMake, newTemp[this.addData.modemMake]).then(function (res) {
            _this.modemModelResponse = res;
        });
        if (this.addData.modemMake != null && this.addData.modemMake != "") {
            this.disableModemModel = false;
        }
        else {
            this.disableModemModel = true;
        }
    };
    AddForm.prototype.onEquipMakeChange = function () {
        var _this = this;
        var temp = this.manufacturerListResponse;
        var newTemp = {};
        for (var t in temp) {
            newTemp[temp[t]["key"]] = temp[t]["value"];
        }
        JSON.stringify(newTemp);
        this.reconService.getModelByEquipManufacturer(newTemp[this.addData.eqpmtMfgr], this.addData.eqpmtMfgr).then(function (res) {
            _this.equipModelResponse = res;
        });
        if (this.addData.eqpmtMfgr != null && this.addData.eqpmtMfgr != "") {
            this.disableEqpmtModel = false;
        }
        else {
            this.disableEqpmtModel = true;
        }
    };
    AddForm.prototype.getDistinctModels = function (allModel) {
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
    AddForm.prototype.backToSearchForm = function () {
        this.reconComponent.hideSearch = false;
        this.reconComponent.hideAdd = true;
        this.reconComponent.added = false;
        this.searchScreen.deleted = false;
        this.searchScreen.searchError = false;
        this.addData = {};
        document.documentElement.scrollTop = 0;
    };
    AddForm.prototype.clearField = function () {
        this.addData = {};
    };
    AddForm.prototype.reviewForm = function () {
        if (this.isNullOrEmpty(this.addData.btlrNm) || this.isNullOrEmpty(this.addData.country)
            || this.isNullOrEmpty(this.addData.custNm) || this.isNullOrEmpty(this.addData.eqpmtLocDsc)
            || this.isNullOrEmpty(this.addData.eqpmtSrlNum) || this.isNullOrEmpty(this.addData.eqpmtType)
            || this.isNullOrEmpty(this.addData.nucSerialNum) || this.isNullOrEmpty(this.addData.modemSerialNum)) {
            alert('Please enter all the mandatory fields');
        }
        else {
            console.log("Loading review screen");
            this.reviewBtlrCustIdVal = this.setDefaultValueToDisplay(this.addData.btlrCustIdVal);
            this.reviewDeploymentDt = this.setDefaultValueToDisplay(this.addData.deploymentDt);
            this.reviewCustAddrTxt1 = this.setDefaultValueToDisplay(this.addData.custAddrTxt1);
            this.reviewCustAddrTxt2 = this.setDefaultValueToDisplay(this.addData.custAddrTxt2);
            this.reviewCustCity = this.setDefaultValueToDisplay(this.addData.custCity);
            this.reviewCustState = this.setDefaultValueToDisplay(this.addData.custState);
            this.reviewCustPostCd = this.setDefaultValueToDisplay(this.addData.custPostCd);
            this.reviewGoLiveDt = this.setDefaultValueToDisplay(this.addData.goLiveDt);
            this.reviewEqpmtMfgr = this.setDefaultValueToDisplay(this.addData.eqpmtMfgr);
            this.reviewEqpmtModel = this.setDefaultValueToDisplay(this.addData.eqpmtModel);
            this.reviewNucMake = this.setDefaultValueToDisplay(this.addData.nucMake);
            this.reviewNucModel = this.setDefaultValueToDisplay(this.addData.nucModel);
            this.reviewThirdPartyEqpmtId = this.setDefaultValueToDisplay(this.addData.thirdPartyEqpmtId);
            this.reviewModemCarrier = this.setDefaultValueToDisplay(this.addData.modemCarrier);
            this.reviewModemModel = this.setDefaultValueToDisplay(this.addData.modemModel);
            this.reviewModemMake = this.setDefaultValueToDisplay(this.addData.modemMake);
            this.reviewMode = true;
        }
    };
    AddForm.prototype.setDefaultValueToDisplay = function (input) {
        return (input != null && input != "") ? input : " - ";
    };
    AddForm.prototype.isNullOrEmpty = function (input) {
        return (input == undefined || input == null || input == "") ? true : false;
    };
    AddForm.prototype.backToEditForm = function () {
        this.reviewMode = false;
    };
    AddForm.prototype.cancelForm = function () {
        this.reviewMode = false;
        this.addData = {};
        this.disableFields = true;
        this.disableNUCModel = true;
        this.disableModemModel = true;
        this.disableEqpmtModel = true;
        document.documentElement.scrollTop = 0;
    };
    AddForm.prototype.submitForm = function () {
        var _this = this;
        this.addFormBlock.start('Loading...');
        this.clearData();
        var temp = this.countryListResponse;
        var newTemp = {};
        for (var t in temp) {
            newTemp[temp[t]["countryName"]] = temp[t]["countryValue"];
        }
        JSON.stringify(newTemp);
        this.addData.country = newTemp[this.addData.country];
        this.reconService.addForm(this.addData).then(function (res) {
            if (res) {
                _this.reconComponent.added = true;
                _this.reviewMode = false;
                _this.reconComponent.hideAdd = true;
                _this.reconComponent.hideSearch = false;
                _this.searchScreen.hideSearch = true;
                _this.addData = {};
                _this.disableFields = true;
                _this.disableNUCModel = true;
                _this.disableModemModel = true;
                _this.disableEqpmtModel = true;
            }
            else {
                _this.reconComponent.addError = true;
                _this.reviewMode = false;
                _this.reconComponent.hideAdd = true;
                _this.reconComponent.hideSearch = false;
                _this.searchScreen.hideSearch = true;
                _this.addData = {};
            }
            _this.addFormBlock.stop();
        }).catch(function (err) {
            console.log("Error Processing addForm" + err);
            _this.reconComponent.addError = true;
            _this.reviewMode = false;
            _this.reconComponent.hideAdd = true;
            _this.reconComponent.hideSearch = false;
            _this.searchScreen.hideSearch = false;
            _this.addData = {};
            _this.addFormBlock.stop();
        });
        document.documentElement.scrollTop = 0;
    };
    AddForm.prototype.clearData = function () {
        this.reconComponent.added = false;
        this.searchScreen.deleted = false;
        this.reconComponent.addError = false;
    };
    return AddForm;
}());
__decorate([
    BlockUI('addFormBlock'),
    __metadata("design:type", Object)
], AddForm.prototype, "addFormBlock", void 0);
__decorate([
    ViewChild('addCustResponseMessage'),
    __metadata("design:type", ElementRef)
], AddForm.prototype, "elModal", void 0);
__decorate([
    ViewChild('deploymentDate'),
    __metadata("design:type", jqxDateTimeInputComponent)
], AddForm.prototype, "deploymentDate", void 0);
__decorate([
    ViewChild('goLiveDateRef'),
    __metadata("design:type", jqxDateTimeInputComponent)
], AddForm.prototype, "goLiveDate", void 0);
AddForm = __decorate([
    Component({
        selector: 'addForm',
        templateUrl: 'app/reconciliation/forms/addform.component.html',
        styleUrls: ['app/reconciliation/forms/addform.css'],
    }),
    __metadata("design:paramtypes", [ActivatedRoute,
        Router, ReconciliationService,
        IndependenceCustomerService,
        IndependenceEquipmentService,
        ReconciliationComponent,
        SearchForm])
], AddForm);
export { AddForm };
//# sourceMappingURL=addform.component.js.map