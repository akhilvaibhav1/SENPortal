import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Router, ActivatedRoute } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { ReconciliationService } from '../../services/reconciliation.service';
import { IndependenceCustomerService } from '../../services/independenceCustomer.service';
import { IndependenceEquipmentService } from '../../services/independenceEquipment.service';
import { ReconciliationComponent } from '../reconciliation.component';
import { SearchForm } from './searchform.component';
import { FormModal } from '../../util/formModal';
//jqwidgets components
import { jqxChartComponent } from '../../../jqwidgets-ts/angular_jqxchart';
import { jqxDropDownListComponent } from '../../../jqwidgets-ts/angular_jqxdropdownlist';
import { jqxDataTableComponent } from '../../../jqwidgets-ts/angular_jqxdatatable';
import { jqxGridComponent } from '../../../jqwidgets-ts/angular_jqxgrid';
import { jqxDateTimeInputComponent } from '../../../jqwidgets-ts/angular_jqxdatetimeinput';

@Component({

    selector: 'viewEditForm',
    templateUrl: 'app/reconciliation/forms/viewform.component.html',
    styleUrls: ['app/reconciliation/forms/viewform.css'],
})

export class ViewEditForm implements OnInit {

    //@BlockUI() blockUI: NgBlockUI;
    @BlockUI('editFormPage') editFormPageBlock: NgBlockUI;
    @ViewChild('deploymentDate') deploymentDate: jqxDateTimeInputComponent;
    @ViewChild('goLiveDateRef') goLiveDate: jqxDateTimeInputComponent;
    @ViewChild('deleteFormModal') deleteFormModal: FormModal;
    constructor(
        private route: ActivatedRoute,
        private router: Router, private reconService: ReconciliationService,
        private custService: IndependenceCustomerService,
        private equipmentService: IndependenceEquipmentService,
        private reconComponent: ReconciliationComponent,
        private searchScreen: SearchForm
    ) {

    }

    editData: any = {};
    viewOnlyData: any = {};
    disableFields: boolean = true;
    disableModemModel: boolean = true;
    disableNUCModel: boolean = true;
    disableEqpmtModel: boolean = true;
    reconCompleted: boolean = false;
    deleteError: boolean = false;
    updated: boolean = false;
    updateError: boolean = false;
    bottlerListResponse: any;
    countryListResponse: any;
    stateListResponse: any;
    goLiveDateVal: any;
    manufacturerListResponse: any;
    modelAndSerialResponse: any;
    viewMode: boolean = true;
    nucManufacturerListResponse: any;
    modemManufacturerListResponse: any;
    modemCarrierResponse: any;
    equipModelResponse: any;
    nucModelResponse: any;
    modemModelResponse: any;
    spireTypeList: any = ['Spire 2.0', 'Spire 2.0 CREW', 'Spire 3.0', 'Spire 3.1', 'Spire 4.1', 'Spire Type 5.0', 'Spire Type 6.0'];

    ngOnInit() {
        this.disableFields = false;
        this.disableNUCModel = true;
        this.disableModemModel = true;
        this.viewMode = true;

        this.editData = this.searchScreen.editData;
        this.viewOnlyData = this.searchScreen.viewData;
        this.reconService.loadFormDetails().then(res => {
            this.editFormPageBlock.start('Loading...')
            // this.bottlerListResponse = res.bottlers;
            // this.countryListResponse = res.countries;
            this.nucManufacturerListResponse = res.nucMake;
            this.modemManufacturerListResponse = res.modemMake;
            this.manufacturerListResponse = res.equipMake;
            this.modemCarrierResponse = res.modemCarrier;
            this.editFormPageBlock.stop();
        }).catch((err) => {
            console.log("Error Processing loadFormDetails" + err);
            this.editFormPageBlock.stop();
        });
        this.reconService.loadCtryStateBottler().then(res => {
            this.editFormPageBlock.start('Loading...');
            this.countryListResponse = res.countries;

            this.spireTypeList = res.spireUnitTypes;

            this.editFormPageBlock.stop();
        }).catch((err) => {
            console.log("Error Processing loadFormDetails" + err);
            this.editFormPageBlock.stop();
        });
        //this.spireTypeList = ['Spire 2.0', 'Spire 2.0 CREW', 'Spire 3.0', 'Spire 3.1', 'Spire 4.1', 'Spire Type 5.0', 'Spire Type 6.0'];

        //this.clearField();

    }

    onCountryChange() {

        // var temp = this.countryListResponse;
        // var newTemp = {};
        // for (var t in temp) {
        //     newTemp[temp[t]["countryName"]] = temp[t]["countryId"]
        // }
        // JSON.stringify(newTemp);
        // this.reconService.getStateList(newTemp[this.editData.country]).then(res => {
        //     this.stateListResponse = res;
        // });
        for (let i = 0; i < this.countryListResponse.length; i++) {
            let country = this.countryListResponse[i];
            if (country.countryName === this.editData.country) {
                this.stateListResponse = country.states;
                //this.stateListDataSource = this.getStateListDataSource();
                this.bottlerListResponse = country.bottlingPartners;
                //this.bottlingPartnerListDataSource = this.getBottlingPartnerListDataSource();
            }
        }
        let bottlerFound = false;

        for (let i = 0; i < this.bottlerListResponse.length; i++) {
            let bottlerNm = this.bottlerListResponse[i];
            if (bottlerNm.bottlingPartnerName === this.editData.btlrNm) {
                bottlerFound = true;
                break;
            }
        }
        if(!bottlerFound){
            this.editData.btlrNm = "";
        }

        if (this.editData.country != null && this.editData.country != "") {
            this.disableFields = false;
        } else {
            this.editData.btlrNm = "";
            this.disableFields = true;
        }

    }


    onNUCMakeChange() {

        var temp = this.nucManufacturerListResponse;
        var newTemp = {};
        for (var t in temp) {
            newTemp[temp[t]["key"]] = temp[t]["value"]
        }
        JSON.stringify(newTemp);
        //this.reconService.getModelByPartManufacturer(this.addData.nucMake, newTemp[this.addData.nucMake]).then(res => {
        this.reconService.getModelByPartManufacturer(this.editData.nucMake, newTemp[this.editData.nucMake]).then(res => {
            this.nucModelResponse = res;
        });
        //  this.modelAndSerialResponse = [{ "equipmentId": 0, "asnEquipmentId": 0, "equipmentSerialNo": "SERIALTEST1", "equipmentMakeModel": 13715, "equipmentModelValue": "CT120 1 DOOR SWING", "equipmentTypeName": "FSV VENDING", "isMakeModelEdited": false }];
        if (this.editData.nucMake != null && this.editData.nucMake != "") {
            this.disableNUCModel = false;
        } else {
            this.disableNUCModel = true;
        }
    }

    onModemMakeChange() {

        var temp = this.modemManufacturerListResponse;
        var newTemp = {};
        for (var t in temp) {
            newTemp[temp[t]["key"]] = temp[t]["value"]
        }
        JSON.stringify(newTemp);
        //this.reconService.getModelByPartManufacturer(this.addData.nucMake, newTemp[this.addData.nucMake]).then(res => {
        this.reconService.getModelByPartManufacturer(this.editData.modemMake, newTemp[this.editData.modemMake]).then(res => {
            this.modemModelResponse = res;
        });
        //  this.modelAndSerialResponse = [{ "equipmentId": 0, "asnEquipmentId": 0, "equipmentSerialNo": "SERIALTEST1", "equipmentMakeModel": 13715, "equipmentModelValue": "CT120 1 DOOR SWING", "equipmentTypeName": "FSV VENDING", "isMakeModelEdited": false }];
        if (this.editData.modemMake != null && this.editData.modemMake != "") {
            this.disableModemModel = false;
        } else {
            this.disableModemModel = true;
        }
    }

    onEquipMakeChange() {
        // this.disableFields = false;
        var temp = this.manufacturerListResponse;
        var newTemp = {};
        for (var t in temp) {
            newTemp[temp[t]["key"]] = temp[t]["value"]
        }
        JSON.stringify(newTemp);
        this.reconService.getModelByEquipManufacturer(newTemp[this.editData.eqpmtMfgr],
            this.editData.eqpmtMfgr).then(res => {
                //this.modelAndSerialResponse = this.getDistinctModels(res);
                this.equipModelResponse = res;
            });
        if (this.editData.eqpmtMfgr != null && this.editData.eqpmtMfgr != "") {
            this.disableEqpmtModel = false;
        } else {
            this.disableEqpmtModel = true;
        }
    }


    getDistinctModels(allModel) {
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
    }

    backToSearchForm() {
        this.searchScreen.hideSearch = true;
        this.updated = false;
        this.searchScreen.searchForm();
         document.documentElement.scrollTop = 0;
    }


    backToViewForm() {
        this.viewMode = true;
         document.documentElement.scrollTop = 0;
    }

    backToEditForm() {
        this.updated = false;
        this.updateError = false;
        this.viewMode = false;
        if (this.editData.status == 'COMPLETED') {
            this.reconCompleted = true;
        } else {
            this.reconCompleted = false;
        }
         document.documentElement.scrollTop = 0;
    }

    deleteFormRule() {
        document.documentElement.scrollTop = 200;
        this.deleteFormModal.open();


    }

    deleteForm() {
        this.updated = false;
        this.updateError = false;
        this.searchScreen.deleted = false;
        this.deleteError = false;
        this.clearData();
        this.reconService.deleteForm(this.editData.custEqpmtFormId)
            .then(res => {

                if (res) {
                    this.searchScreen.deleted = true;
                    this.searchScreen.deletedEqpmtSrlNum = this.editData.eqpmtSrlNum;
                    this.reconComponent.hideAdd = false;
                    this.searchScreen.hideSearch = true;
                    this.searchScreen.searchForm();

                } else {
                    this.deleteError = true;
                    this.viewMode = true;
                }
            }).catch((err) => {
                console.log("Error Processing deleteForm" + err);
                this.deleteError = true;
                this.viewMode = true;
            });
    }

    updateForm() {

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
            //this.blockUI.start('Loading...');
            this.editFormPageBlock.start('Loading...');
            var temp = this.countryListResponse;
            var newTemp = {};
            for (var t in temp) {
                newTemp[temp[t]["countryName"]] = temp[t]["countryValue"]
            }
            JSON.stringify(newTemp);
            this.editData.country = newTemp[this.editData.country];
            this.reconService.editForm(this.editData)
                .then(res => {
                    if (res) {
                        this.viewOnlyData.custEqpmtFormId = this.setDefaultValueToDisplay(this.editData.custEqpmtFormId);

                        this.viewOnlyData.reviewEqpmtSrlNum = this.setDefaultValueToDisplay(this.editData.eqpmtSrlNum);
                        this.viewOnlyData.reviewEqpmtType = this.setDefaultValueToDisplay(this.editData.eqpmtType);
                        this.viewOnlyData.reviewEqpmtLocDsc = this.setDefaultValueToDisplay(this.editData.eqpmtLocDsc);
                        this.viewOnlyData.reviewIdentItemId = this.setDefaultValueToDisplay(this.editData.identItemId);
                        this.viewOnlyData.reviewBtlrNm = this.setDefaultValueToDisplay(this.editData.btlrNm);
                        this.viewOnlyData.reviewCustNm = this.setDefaultValueToDisplay(this.editData.custNm);
                        this.viewOnlyData.reviewStatus = this.setDefaultValueToDisplay(this.editData.status);
                        this.viewOnlyData.reviewNucSerialNum = this.setDefaultValueToDisplay(this.editData.nucSerialNum);
                        this.viewOnlyData.reviewModemSerialNum = this.setDefaultValueToDisplay(this.editData.modemSerialNum);
                        this.viewOnlyData.dateSubmitted = this.setDefaultValueToDisplay(this.editData.dateSubmitted);
                        this.viewOnlyData.reviewBtlrCustIdVal = this.setDefaultValueToDisplay(this.editData.btlrCustIdVal);
                        this.viewOnlyData.reviewDeploymentDt = this.setDefaultValueToDisplay(this.editData.deploymentDt);
                        this.viewOnlyData.reviewCustAddrTxt1 = this.setDefaultValueToDisplay(this.editData.custAddrTxt1);
                        this.viewOnlyData.reviewCustAddrTxt2 = this.setDefaultValueToDisplay(this.editData.custAddrTxt2);
                        this.viewOnlyData.reviewCustCity = this.setDefaultValueToDisplay(this.editData.custCity);
                        this.viewOnlyData.reviewCustState = this.setDefaultValueToDisplay(this.editData.custState);
                        this.viewOnlyData.reviewCustPostCd = this.setDefaultValueToDisplay(this.editData.custPostCd);
                        this.viewOnlyData.reviewGoLiveDt = this.setDefaultValueToDisplay(this.editData.goLiveDt);
                        this.viewOnlyData.reviewEqpmtMfgr = this.setDefaultValueToDisplay(this.editData.eqpmtMfgr);
                        this.viewOnlyData.reviewEqpmtModel = this.setDefaultValueToDisplay(this.editData.eqpmtModel);
                        this.viewOnlyData.reviewNucMake = this.setDefaultValueToDisplay(this.editData.nucMake);
                        this.viewOnlyData.reviewNucModel = this.setDefaultValueToDisplay(this.editData.nucModel);
                        this.viewOnlyData.reviewThirdPartyEqpmtId = this.setDefaultValueToDisplay(this.editData.thirdPartyEqpmtId);
                        this.viewOnlyData.reviewModemCarrier = this.setDefaultValueToDisplay(this.editData.modemCarrier);
                        this.viewOnlyData.reviewModemModel = this.setDefaultValueToDisplay(this.editData.modemModel);
                        this.viewOnlyData.reviewModemMake = this.setDefaultValueToDisplay(this.editData.modemMake);
                        var temp = this.countryListResponse;
                        var newTemp = {};
                        for (var t in temp) {
                            newTemp[temp[t]["countryValue"]] = temp[t]["countryName"]
                        }
                        JSON.stringify(newTemp);
                        this.viewOnlyData.reviewCountry = this.setDefaultValueToDisplay(newTemp[this.editData.country]);

                        this.editData.country = this.viewOnlyData.reviewCountry;
                        this.updated = true;
                        this.viewMode = true;
                        this.searchScreen.searchForm();
                    } else {
                        this.updateError = true;
                        this.viewMode = true;
                    }
                    //this.blockUI.stop();
                    this.editFormPageBlock.stop();
                }).catch((err) => {
                    console.log("Error Processing updateForm" + err);
                    this.updateError = true;
                    this.viewMode = true;
                    //this.blockUI.stop();
                    this.editFormPageBlock.stop();
                });
        } else {
            alert('Please enter all the mandatory fields')
        }
    }

    setDefaultValueToDisplay(input) {
        return (input != null && input != "") ? input : " - ";

    }

    clearData() {
        //this.searchScreen.added = false;
        this.searchScreen.deleted = false;
        this.reconComponent.addError = false;
        this.reconComponent.added = false
    }
}