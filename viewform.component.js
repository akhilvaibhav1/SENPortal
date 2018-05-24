var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { BlockUI } from 'ng-block-ui';
import { Router, ActivatedRoute } from '@angular/router';
import { ReconciliationService } from '../../services/reconciliation.service';
import { IndependenceCustomerService } from '../../services/independenceCustomer.service';
import { IndependenceEquipmentService } from '../../services/independenceEquipment.service';
import { ReconciliationComponent } from '../reconciliation.component';
import { SearchForm } from './searchform.component';
import { FormModal } from '../../util/formModal';
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
        this.editData = {};
        this.viewOnlyData = {};
        this.disableFields = true;
        this.disableModemModel = true;
        this.disableNUCModel = true;
        this.disableEqpmtModel = true;
        this.reconCompleted = false;
        this.deleteError = false;
        this.updated = false;
        this.updateError = false;
        this.viewMode = true;
        this.spireTypeList = ['Spire 2.0', 'Spire 2.0 CREW', 'Spire 3.0', 'Spire 3.1', 'Spire 4.1', 'Spire Type 5.0', 'Spire Type 6.0'];
    }
    ViewEditForm.prototype.ngOnInit = function () {
        var _this = this;
        this.disableFields = false;
        this.disableNUCModel = true;
        this.disableModemModel = true;
        this.viewMode = true;
        this.editData = this.searchScreen.editData;
        this.viewOnlyData = this.searchScreen.viewData;
        this.reconService.loadFormDetails().then(function (res) {
            _this.editFormPageBlock.start('Loading...');
            _this.nucManufacturerListResponse = res.nucMake;
            _this.modemManufacturerListResponse = res.modemMake;
            _this.manufacturerListResponse = res.equipMake;
            _this.modemCarrierResponse = res.modemCarrier;
            _this.editFormPageBlock.stop();
        }).catch(function (err) {
            console.log("Error Processing loadFormDetails" + err);
            _this.editFormPageBlock.stop();
        });
        this.reconService.loadCtryStateBottler().then(function (res) {
            _this.editFormPageBlock.start('Loading...');
            _this.countryListResponse = res.countries;
            _this.spireTypeList = res.spireUnitTypes;
            _this.editFormPageBlock.stop();
        }).catch(function (err) {
            console.log("Error Processing loadFormDetails" + err);
            _this.editFormPageBlock.stop();
        });
    };
    ViewEditForm.prototype.onCountryChange = function () {
        for (var i = 0; i < this.countryListResponse.length; i++) {
            var country = this.countryListResponse[i];
            if (country.countryName === this.editData.country) {
                this.stateListResponse = country.states;
                this.bottlerListResponse = country.bottlingPartners;
            }
        }
        var bottlerFound = false;
        for (var i = 0; i < this.bottlerListResponse.length; i++) {
            var bottlerNm = this.bottlerListResponse[i];
            if (bottlerNm.bottlingPartnerName === this.editData.btlrNm) {
                bottlerFound = true;
                break;
            }
        }
        if (!bottlerFound) {
            this.editData.btlrNm = "";
        }
        if (this.editData.country != null && this.editData.country != "") {
            this.disableFields = false;
        }
        else {
            this.editData.btlrNm = "";
            this.disableFields = true;
        }
    };
    ViewEditForm.prototype.onNUCMakeChange = function () {
        var _this = this;
        var temp = this.nucManufacturerListResponse;
        var newTemp = {};
        for (var t in temp) {
            newTemp[temp[t]["key"]] = temp[t]["value"];
        }
        JSON.stringify(newTemp);
        this.reconService.getModelByPartManufacturer(this.editData.nucMake, newTemp[this.editData.nucMake]).then(function (res) {
            _this.nucModelResponse = res;
        });
        if (this.editData.nucMake != null && this.editData.nucMake != "") {
            this.disableNUCModel = false;
        }
        else {
            this.disableNUCModel = true;
        }
    };
    ViewEditForm.prototype.onModemMakeChange = function () {
        var _this = this;
        var temp = this.modemManufacturerListResponse;
        var newTemp = {};
        for (var t in temp) {
            newTemp[temp[t]["key"]] = temp[t]["value"];
        }
        JSON.stringify(newTemp);
        this.reconService.getModelByPartManufacturer(this.editData.modemMake, newTemp[this.editData.modemMake]).then(function (res) {
            _this.modemModelResponse = res;
        });
        if (this.editData.modemMake != null && this.editData.modemMake != "") {
            this.disableModemModel = false;
        }
        else {
            this.disableModemModel = true;
        }
    };
    ViewEditForm.prototype.onEquipMakeChange = function () {
        var _this = this;
        var temp = this.manufacturerListResponse;
        var newTemp = {};
        for (var t in temp) {
            newTemp[temp[t]["key"]] = temp[t]["value"];
        }
        JSON.stringify(newTemp);
        this.reconService.getModelByEquipManufacturer(newTemp[this.editData.eqpmtMfgr], this.editData.eqpmtMfgr).then(function (res) {
            _this.equipModelResponse = res;
        });
        if (this.editData.eqpmtMfgr != null && this.editData.eqpmtMfgr != "") {
            this.disableEqpmtModel = false;
        }
        else {
            this.disableEqpmtModel = true;
        }
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
        this.searchScreen.hideSearch = true;
        this.updated = false;
        this.searchScreen.searchForm();
        document.documentElement.scrollTop = 0;
    };
    ViewEditForm.prototype.backToViewForm = function () {
        this.viewMode = true;
        document.documentElement.scrollTop = 0;
    };
    ViewEditForm.prototype.backToEditForm = function () {
        this.updated = false;
        this.updateError = false;
        this.viewMode = false;
        if (this.editData.status == 'COMPLETED') {
            this.reconCompleted = true;
        }
        else {
            this.reconCompleted = false;
        }
        document.documentElement.scrollTop = 0;
    };
    ViewEditForm.prototype.deleteFormRule = function () {
        document.documentElement.scrollTop = 200;
        this.deleteFormModal.open();
    };
    ViewEditForm.prototype.deleteForm = function () {
        var _this = this;
        this.updated = false;
        this.updateError = false;
        this.searchScreen.deleted = false;
        this.deleteError = false;
        this.clearData();
        this.reconService.deleteForm(this.editData.custEqpmtFormId)
            .then(function (res) {
            if (res) {
                _this.searchScreen.deleted = true;
                _this.searchScreen.deletedEqpmtSrlNum = _this.editData.eqpmtSrlNum;
                _this.reconComponent.hideAdd = false;
                _this.searchScreen.hideSearch = true;
                _this.searchScreen.searchForm();
            }
            else {
                _this.deleteError = true;
                _this.viewMode = true;
            }
        }).catch(function (err) {
            console.log("Error Processing deleteForm" + err);
            _this.deleteError = true;
            _this.viewMode = true;
        });
    };
    ViewEditForm.prototype.updateForm = function () {
        var _this = this;
        this.updated = false;
        this.updateError = false;
        this.clearData();
        if (this.editData.btlrNm != null && this.editData.btlrNm != ""
            && this.editData.country != null && this.editData.country != ""
            && this.editData.custNm != null && this.editData.custNm != ""
            && this.editData.eqpmtLocDsc != null && this.editData.eqpmtLocDsc != ""
            && this.editData.eqpmtSrlNum != null && this.editData.eqpmtSrlNum != ""
            && this.editData.eqpmtType != null && this.editData.eqpmtType != ""
            && this.editData.nucSerialNum != null && this.editData.nucSerialNum != ""
            && this.editData.modemSerialNum != null && this.editData.modemSerialNum != "") {
            this.editFormPageBlock.start('Loading...');
            var temp = this.countryListResponse;
            var newTemp = {};
            for (var t in temp) {
                newTemp[temp[t]["countryName"]] = temp[t]["countryValue"];
            }
            JSON.stringify(newTemp);
            this.editData.country = newTemp[this.editData.country];
            this.reconService.editForm(this.editData)
                .then(function (res) {
                if (res) {
                    _this.viewOnlyData.custEqpmtFormId = _this.setDefaultValueToDisplay(_this.editData.custEqpmtFormId);
                    _this.viewOnlyData.reviewEqpmtSrlNum = _this.setDefaultValueToDisplay(_this.editData.eqpmtSrlNum);
                    _this.viewOnlyData.reviewEqpmtType = _this.setDefaultValueToDisplay(_this.editData.eqpmtType);
                    _this.viewOnlyData.reviewEqpmtLocDsc = _this.setDefaultValueToDisplay(_this.editData.eqpmtLocDsc);
                    _this.viewOnlyData.reviewIdentItemId = _this.setDefaultValueToDisplay(_this.editData.identItemId);
                    _this.viewOnlyData.reviewBtlrNm = _this.setDefaultValueToDisplay(_this.editData.btlrNm);
                    _this.viewOnlyData.reviewCustNm = _this.setDefaultValueToDisplay(_this.editData.custNm);
                    _this.viewOnlyData.reviewStatus = _this.setDefaultValueToDisplay(_this.editData.status);
                    _this.viewOnlyData.reviewNucSerialNum = _this.setDefaultValueToDisplay(_this.editData.nucSerialNum);
                    _this.viewOnlyData.reviewModemSerialNum = _this.setDefaultValueToDisplay(_this.editData.modemSerialNum);
                    _this.viewOnlyData.dateSubmitted = _this.setDefaultValueToDisplay(_this.editData.dateSubmitted);
                    _this.viewOnlyData.reviewBtlrCustIdVal = _this.setDefaultValueToDisplay(_this.editData.btlrCustIdVal);
                    _this.viewOnlyData.reviewDeploymentDt = _this.setDefaultValueToDisplay(_this.editData.deploymentDt);
                    _this.viewOnlyData.reviewCustAddrTxt1 = _this.setDefaultValueToDisplay(_this.editData.custAddrTxt1);
                    _this.viewOnlyData.reviewCustAddrTxt2 = _this.setDefaultValueToDisplay(_this.editData.custAddrTxt2);
                    _this.viewOnlyData.reviewCustCity = _this.setDefaultValueToDisplay(_this.editData.custCity);
                    _this.viewOnlyData.reviewCustState = _this.setDefaultValueToDisplay(_this.editData.custState);
                    _this.viewOnlyData.reviewCustPostCd = _this.setDefaultValueToDisplay(_this.editData.custPostCd);
                    _this.viewOnlyData.reviewGoLiveDt = _this.setDefaultValueToDisplay(_this.editData.goLiveDt);
                    _this.viewOnlyData.reviewEqpmtMfgr = _this.setDefaultValueToDisplay(_this.editData.eqpmtMfgr);
                    _this.viewOnlyData.reviewEqpmtModel = _this.setDefaultValueToDisplay(_this.editData.eqpmtModel);
                    _this.viewOnlyData.reviewNucMake = _this.setDefaultValueToDisplay(_this.editData.nucMake);
                    _this.viewOnlyData.reviewNucModel = _this.setDefaultValueToDisplay(_this.editData.nucModel);
                    _this.viewOnlyData.reviewThirdPartyEqpmtId = _this.setDefaultValueToDisplay(_this.editData.thirdPartyEqpmtId);
                    _this.viewOnlyData.reviewModemCarrier = _this.setDefaultValueToDisplay(_this.editData.modemCarrier);
                    _this.viewOnlyData.reviewModemModel = _this.setDefaultValueToDisplay(_this.editData.modemModel);
                    _this.viewOnlyData.reviewModemMake = _this.setDefaultValueToDisplay(_this.editData.modemMake);
                    var temp = _this.countryListResponse;
                    var newTemp = {};
                    for (var t in temp) {
                        newTemp[temp[t]["countryValue"]] = temp[t]["countryName"];
                    }
                    JSON.stringify(newTemp);
                    _this.viewOnlyData.reviewCountry = _this.setDefaultValueToDisplay(newTemp[_this.editData.country]);
                    _this.editData.country = _this.viewOnlyData.reviewCountry;
                    _this.updated = true;
                    _this.viewMode = true;
                    _this.searchScreen.searchForm();
                }
                else {
                    _this.updateError = true;
                    _this.viewMode = true;
                }
                _this.editFormPageBlock.stop();
            }).catch(function (err) {
                console.log("Error Processing updateForm" + err);
                _this.updateError = true;
                _this.viewMode = true;
                _this.editFormPageBlock.stop();
            });
        }
        else {
            alert('Please enter all the mandatory fields');
        }
    };
    ViewEditForm.prototype.setDefaultValueToDisplay = function (input) {
        return (input != null && input != "") ? input : " - ";
    };
    ViewEditForm.prototype.clearData = function () {
        this.searchScreen.deleted = false;
        this.reconComponent.addError = false;
        this.reconComponent.added = false;
    };
    return ViewEditForm;
}());
__decorate([
    BlockUI('editFormPage'),
    __metadata("design:type", Object)
], ViewEditForm.prototype, "editFormPageBlock", void 0);
__decorate([
    ViewChild('deploymentDate'),
    __metadata("design:type", jqxDateTimeInputComponent)
], ViewEditForm.prototype, "deploymentDate", void 0);
__decorate([
    ViewChild('goLiveDateRef'),
    __metadata("design:type", jqxDateTimeInputComponent)
], ViewEditForm.prototype, "goLiveDate", void 0);
__decorate([
    ViewChild('deleteFormModal'),
    __metadata("design:type", FormModal)
], ViewEditForm.prototype, "deleteFormModal", void 0);
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
//# sourceMappingURL=viewform.component.js.map