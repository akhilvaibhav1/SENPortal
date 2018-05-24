import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Router, ActivatedRoute } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { ReconciliationService } from '../../services/reconciliation.service';
import { IndependenceCustomerService } from '../../services/independenceCustomer.service';
import { IndependenceEquipmentService } from '../../services/independenceEquipment.service';
import { ReconciliationComponent } from '../reconciliation.component';
import { SearchForm } from './searchform.component';
//jqwidgets components
import { jqxChartComponent } from '../../../jqwidgets-ts/angular_jqxchart';
import { jqxDropDownListComponent } from '../../../jqwidgets-ts/angular_jqxdropdownlist';
import { jqxDataTableComponent } from '../../../jqwidgets-ts/angular_jqxdatatable';
import { jqxGridComponent } from '../../../jqwidgets-ts/angular_jqxgrid';
import { jqxDateTimeInputComponent } from '../../../jqwidgets-ts/angular_jqxdatetimeinput';

@Component({

    selector: 'addForm',
    templateUrl: 'app/reconciliation/forms/addform.component.html',
    styleUrls: ['app/reconciliation/forms/addform.css'],
})

export class AddForm implements OnInit {

    @BlockUI('addFormBlock') addFormBlock: NgBlockUI;
    @ViewChild('addCustResponseMessage') elModal: ElementRef;
    @ViewChild('deploymentDate') deploymentDate: jqxDateTimeInputComponent;
    @ViewChild('goLiveDateRef') goLiveDate: jqxDateTimeInputComponent;

    constructor(
        private route: ActivatedRoute,
        private router: Router, private reconService: ReconciliationService,
        private custService: IndependenceCustomerService,
        private equipmentService: IndependenceEquipmentService,
        private reconComponent: ReconciliationComponent,
        private searchScreen: SearchForm
    ) {

    }

    addData: any = {};
    disableFields: boolean = true;
    disableModemModel: boolean = true;
    disableNUCModel: boolean = true;
    bottlerListResponse: any;
    custBussSegmListResponse: any;
    countryListResponse: any; acntNameResponse: any;
    thrdPartyCustIds: any;
    stateListResponse: any;
    response: string;
    alertMessage: string = "";
    goLiveDateVal: any;
    manufacturerListResponse: any;
    nucManufacturerListResponse: any;
    modemManufacturerListResponse: any;
    modelAndSerialResponse: any;
    nucModelResponse: any;
    modemModelResponse: any;
    modemCarrierResponse: any;
    equipModelResponse: any;
    reviewMode: boolean = false;
    disableEqpmtModel: boolean = false;

    spireTypeList: any;
    ngOnInit() {

        this.disableFields = true;
        this.disableNUCModel = true;
        this.disableModemModel = true;
        this.disableEqpmtModel = true;

        this.reconService.loadFormDetails().then(res => {
            this.addFormBlock.start('Loading...');
            // this.bottlerListResponse = res.bottlers;
            // this.countryListResponse = res.countries;
            this.nucManufacturerListResponse = res.nucMake;
            this.modemManufacturerListResponse = res.modemMake;
            this.manufacturerListResponse = res.equipMake;
            this.modemCarrierResponse = res.modemCarrier;
            this.addFormBlock.stop();
        }).catch((err) => {
            console.log("Error Processing loadFormDetails" + err);
            this.addFormBlock.stop();
        });

        this.reconService.loadCtryStateBottler().then(res => {

            this.countryListResponse = res.countries;
            this.spireTypeList = res.spireUnitTypes;
            this.addFormBlock.stop();
        }).catch((err) => {
            console.log("Error Processing loadFormDetails" + err);
            this.addFormBlock.stop();
        });


        //this.spireTypeList = ['Spire 2.0', 'Spire 2.0 CREW', 'Spire 3.0', 'Spire 3.1', 'Spire 4.1', 'Spire Type 5.0', 'Spire Type 6.0'];
        // this.custService.getCustomerBaseValues('add').then(res => {
        //     this.bottlerListResponse = res.bottlers;
        //     this.countryListResponse = res.countries;
        //     this.stateListResponse = res.states;
        //     this.acntNameResponse = res.accounts;
        //     this.custBussSegmListResponse = res.custBussChannels;
        //     this.thrdPartyCustIds = res.thrdPartyCustIds;
        // });

        // this.equipmentService.getEquipmentBaseValues().then(res => {
        //     this.manufacturerListResponse = res;
        // });


        this.clearField();
        // this.bottlerListResponse = [{ "key": "ABTEX", "value": "35377702" }, { "key": "ADMIRAL GROUP", "value": "35377742" }, { "key": "ASTORIA  OR", "value": "35377763" }, { "key": "ATMORE AL", "value": "35377688" }, { "key": "BELLINGHAM WA", "value": "35377739" }, { "key": "BEMIDJI MN", "value": "35377761" }, { "key": "BENNETTSVILLE SC", "value": "35377751" }, { "key": "BERNICK", "value": "35377768" }, { "key": "BEVERAGE SOUTH", "value": "35377698" }, { "key": "BIGFOOT BEVERAGES", "value": "35377766" }, { "key": "BILLINGS  MT", "value": "35377730" }, { "key": "BRATLBR-N HAMTN VT", "value": "35377767" }, { "key": "BREMERTON  WA", "value": "35377732" }, { "key": "BRITVIC", "value": "35377823" }, { "key": "BROOKFIELD  MO", "value": "35377720" }, { "key": "BROWN", "value": "35377758" }, { "key": "BUFFALO ROCK", "value": "35377690" }, { "key": "CHAMPAIGN IL", "value": "35377692" }, { "key": "CHARLOTTESVILLE VA", "value": "35377750" }, { "key": "CLINTON OK", "value": "35377683" }, { "key": "CONWAY  NH", "value": "35377686" }, { "key": "CONWAY SC", "value": "35377684" }, { "key": "CORBIN KY", "value": "35377772" }, { "key": "CORPUS CHRISTI TX", "value": "35377682" }, { "key": "DAVENPORT IA", "value": "35377765" }, { "key": "DECATUR AL", "value": "35377724" }, { "key": "DUBUQUE IA", "value": "35377731" }, { "key": "DYERSBURG TN", "value": "35377747" }, { "key": "FLAGSTAFF  AZ", "value": "35377735" }, { "key": "GENEVA NY", "value": "35377748" }, { "key": "GILLETTE", "value": "35377757" }, { "key": "GLENS FALLS  NY", "value": "35377749" }, { "key": "GREEN BAY WI", "value": "35377722" }, { "key": "GREENVILLE NC", "value": "35377762" }, { "key": "GROSS JARSON", "value": "35377689" }, { "key": "GULFPORT MS", "value": "35377729" }, { "key": "HARRINGTON", "value": "35377727" }, { "key": "HASTINGS NE", "value": "35377771" }, { "key": "HAVRE DE GRACE  MD", "value": "35377721" }, { "key": "HICKORY NC", "value": "35377681" }, { "key": "HONICKMAN", "value": "35377756" }, { "key": "HOQUIAM  WA", "value": "35377752" }, { "key": "HOUGHTON MI", "value": "35377719" }, { "key": "HURLEY WI", "value": "35377740" }, { "key": "KLAMATH FALLS  OR", "value": "35377711" }, { "key": "LA GRANDE OR", "value": "35377736" }, { "key": "LAFAYETTE LA", "value": "35377716" }, { "key": "LINPEPCO", "value": "35377760" }, { "key": "LITTLETON NC", "value": "35377695" }, { "key": "LOGANSPORT IN", "value": "35377710" }, { "key": "LUVERNE AL", "value": "35377725" }, { "key": "MAHASKA", "value": "35377753" }, { "key": "MARION IL", "value": "35377715" }, { "key": "MARYSVILLE KS", "value": "35377745" }, { "key": "MCALESTER OK", "value": "35377696" }, { "key": "MEMPHIS MO", "value": "35377738" }, { "key": "MISSOULA/KALISPELL", "value": "35377714" }, { "key": "MOUNT SHASTA  CA", "value": "35377708" }, { "key": "NEW HAVEN  MO", "value": "35377744" }, { "key": "NEWBERRY MI", "value": "35377770" }, { "key": "NOEL", "value": "35377726" }, { "key": "NORTHERN BOTTLING", "value": "35377759" }, { "key": "NORTON VA", "value": "35377717" }, { "key": "OGDENSBURG  NY", "value": "35377697" }, { "key": "OLYMPIA  WA", "value": "35377712" }, { "key": "PARK FALLS WI", "value": "35377741" }, { "key": "PASTEGA", "value": "35377769" }, { "key": "PBV", "value": "35377703" }, { "key": "PEPSIAMERICAS", "value": "35377704" }, { "key": "PIPESTONE MN", "value": "35377728" }, { "key": "PITTSBURG KS", "value": "35377693" }, { "key": "PORT ANGELES  WA", "value": "35377699" }, { "key": "PRASIL", "value": "35377718" }, { "key": "PepsiCo", "value": "35377821" }, { "key": "PepsiCo SEN", "value": "35377822" }, { "key": "RAUH", "value": "35377743" }, { "key": "ROCK ISLAND IL", "value": "35377707" }, { "key": "ROCK SPRINGS  WY", "value": "35377700" }, { "key": "ROXBORO NC", "value": "35377746" }, { "key": "RSI", "value": "35377734" }, { "key": "SAFFORD  AZ", "value": "35377705" }, { "key": "SELMA AL", "value": "35377701" }, { "key": "SHEBOYGAN WI", "value": "35377713" }, { "key": "SIDNEY  MT", "value": "35377691" }, { "key": "SPRINGFIELD IL", "value": "35377694" }, { "key": "STAUNTON VA NPMD", "value": "35377737" }, { "key": "TENNEY", "value": "35377687" }, { "key": "VANCOUVER WA", "value": "35377733" }, { "key": "W JEFFERSON NC NPMD", "value": "35377754" }, { "key": "WAUSAU WI", "value": "35377706" }, { "key": "WENATCHEE  WA", "value": "35377685" }, { "key": "WINCHESTER VA NPMD", "value": "35377764" }, { "key": "WINFIELD AL", "value": "35377755" }, { "key": "WP BEVERAGES, LLC", "value": "35377723" }, { "key": "YUBA CITY  CA", "value": "35377709" }];

        // this.countryListResponse = [{ "key": "Canada", "value": "2" }, { "key": "Italy", "value": "5" }, { "key": "Poland", "value": "4" }, { "key": "United Kingdom", "value": "3" }, { "key": "United States", "value": "1" }];
        // this.stateListResponse = [{ "key": "Alabama", "value": "341" }, { "key": "Alaska", "value": "342" }, { "key": "Alberta", "value": "400" }, { "key": "Arizona", "value": "343" }, { "key": "Arkansas", "value": "344" }, { "key": "British Columbia", "value": "401" }, { "key": "California", "value": "345" }, { "key": "Colorado", "value": "346" }, { "key": "Connecticut", "value": "347" }, { "key": "Delaware", "value": "348" }, { "key": "District of Columbia", "value": "391" }, { "key": "Florida", "value": "349" }, { "key": "Georgia", "value": "350" }, { "key": "Hawaii", "value": "351" }, { "key": "Idaho", "value": "352" }, { "key": "Illinois", "value": "353" }, { "key": "Indiana", "value": "354" }, { "key": "Iowa", "value": "355" }, { "key": "Kansas", "value": "356" }, { "key": "Kentucky", "value": "357" }, { "key": "Louisiana", "value": "358" }, { "key": "Maine", "value": "359" }, { "key": "Manitoba", "value": "402" }, { "key": "Maryland", "value": "360" }, { "key": "Massachusetts", "value": "361" }, { "key": "Michigan", "value": "362" }, { "key": "Minnesota", "value": "363" }, { "key": "Mississippi", "value": "364" }, { "key": "Missouri", "value": "365" }, { "key": "Montana", "value": "366" }, { "key": "Nebraska", "value": "367" }, { "key": "Nevada", "value": "368" }, { "key": "New Brunswick", "value": "403" }, { "key": "New Hampshire", "value": "369" }, { "key": "New Jersey", "value": "370" }, { "key": "New Mexico", "value": "371" }, { "key": "New York", "value": "372" }, { "key": "Newfoundland and Labrador", "value": "404" }, { "key": "North Carolina", "value": "373" }, { "key": "North Dakota", "value": "374" }, { "key": "Northwest Territories", "value": "406" }, { "key": "Nova Scotia", "value": "405" }, { "key": "Nunavut", "value": "407" }, { "key": "Ohio", "value": "375" }, { "key": "Oklahoma", "value": "376" }, { "key": "Ontario", "value": "408" }, { "key": "Oregon", "value": "377" }, { "key": "Pennsylvania", "value": "378" }, { "key": "Prince Edward Island", "value": "409" }, { "key": "Quebec", "value": "410" }, { "key": "Rhode Island", "value": "379" }, { "key": "Saskatchewan", "value": "411" }, { "key": "South Carolina", "value": "380" }, { "key": "South Dakota", "value": "381" }, { "key": "Tennessee", "value": "382" }, { "key": "Texas", "value": "383" }, { "key": "Utah", "value": "384" }, { "key": "Vermont", "value": "385" }, { "key": "Virginia", "value": "386" }, { "key": "Washington", "value": "387" }, { "key": "West Virginia", "value": "388" }, { "key": "Wisconsin", "value": "389" }, { "key": "Wyoming", "value": "390" }, { "key": "Yukon", "value": "412" }];

        // this.custBussSegmListResponse = [];

    }

    onCountryChange() {
        var temp = this.countryListResponse;
        var newTemp = {};
        for (var t in temp) {
            newTemp[temp[t]["countryName"]] = temp[t]["countryId"];
        }
        JSON.stringify(newTemp);
        for (let i = 0; i < this.countryListResponse.length; i++) {
            let country = this.countryListResponse[i];
            if (country.countryName === this.addData.country) {
                this.stateListResponse = country.states;
                //this.stateListDataSource = this.getStateListDataSource();
                this.bottlerListResponse = country.bottlingPartners;
                //this.bottlingPartnerListDataSource = this.getBottlingPartnerListDataSource();
            }
        }

        // this.reconService.getStateList(newTemp[this.addData.country]).then(res => {
        //      this.stateListResponse = res;
        // });

        if (this.addData.country != null && this.addData.country != "") {
            this.disableFields = false;
        } else {
            this.addData.btlrNm = null;
            this.addData.custState = null;
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
        this.reconService.getModelByPartManufacturer(this.addData.nucMake, newTemp[this.addData.nucMake]).then(res => {
            this.nucModelResponse = res;
        });
        //  this.modelAndSerialResponse = [{ "equipmentId": 0, "asnEquipmentId": 0, "equipmentSerialNo": "SERIALTEST1", "equipmentMakeModel": 13715, "equipmentModelValue": "CT120 1 DOOR SWING", "equipmentTypeName": "FSV VENDING", "isMakeModelEdited": false }];
        if (this.addData.nucMake != null && this.addData.nucMake != "") {
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
        this.reconService.getModelByPartManufacturer(this.addData.modemMake, newTemp[this.addData.modemMake]).then(res => {
            this.modemModelResponse = res;
        });
        //  this.modelAndSerialResponse = [{ "equipmentId": 0, "asnEquipmentId": 0, "equipmentSerialNo": "SERIALTEST1", "equipmentMakeModel": 13715, "equipmentModelValue": "CT120 1 DOOR SWING", "equipmentTypeName": "FSV VENDING", "isMakeModelEdited": false }];
        if (this.addData.modemMake != null && this.addData.modemMake != "") {
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
        this.reconService.getModelByEquipManufacturer(newTemp[this.addData.eqpmtMfgr],
            this.addData.eqpmtMfgr).then(res => {
                //this.modelAndSerialResponse = this.getDistinctModels(res);
                this.equipModelResponse = res;
            });
        if (this.addData.eqpmtMfgr != null && this.addData.eqpmtMfgr != "") {
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
        //this.disableFields = true;
        this.reconComponent.hideSearch = false;
        this.reconComponent.hideAdd = true;
        this.reconComponent.added = false;
        this.searchScreen.deleted = false;
        this.searchScreen.searchError = false;
        this.addData = {};
        document.documentElement.scrollTop = 0;
    }

    clearField() {
        this.addData = {};
    }
    reviewBtlrCustIdVal: string;
    reviewDeploymentDt: string;
    reviewCustAddrTxt1: string;
    reviewCustAddrTxt2: string;
    reviewCustCity: string;
    reviewCustState: string;
    reviewCustPostCd: string;
    reviewGoLiveDt: string;
    reviewEqpmtMfgr: string;
    reviewEqpmtModel: string;
    reviewNucMake: string;
    reviewNucModel: string;
    reviewThirdPartyEqpmtId: string;
    reviewModemCarrier: string;
    reviewModemModel: string;
    reviewModemMake: string;
    reviewForm() {
        if (this.isNullOrEmpty(this.addData.btlrNm) || this.isNullOrEmpty(this.addData.country)
            || this.isNullOrEmpty(this.addData.custNm) || this.isNullOrEmpty(this.addData.eqpmtLocDsc)
            || this.isNullOrEmpty(this.addData.eqpmtSrlNum) || this.isNullOrEmpty(this.addData.eqpmtType)
            || this.isNullOrEmpty(this.addData.nucSerialNum) || this.isNullOrEmpty(this.addData.modemSerialNum)) {
            alert('Please enter all the mandatory fields');
        } else {
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
    }

    setDefaultValueToDisplay(input) {
        return (input != null && input != "") ? input : " - ";

    }

    isNullOrEmpty(input) {
        return (input == undefined || input == null || input == "") ? true : false;

    }

    backToEditForm() {
        this.reviewMode = false;
    }

    cancelForm() {
        this.reviewMode = false;
        this.addData = {};
        this.disableFields = true;
        this.disableNUCModel = true;
        this.disableModemModel = true;
        this.disableEqpmtModel = true;
        document.documentElement.scrollTop = 0;
    }

    submitForm() {
        this.addFormBlock.start('Loading...');
        this.clearData();
        var temp = this.countryListResponse;
        var newTemp = {};
        for (var t in temp) {
            newTemp[temp[t]["countryName"]] = temp[t]["countryValue"];
        }
        JSON.stringify(newTemp);
        this.addData.country = newTemp[this.addData.country];
        this.reconService.addForm(this.addData).then(res => {
            if (res) {
                //this.searchScreen.added = true;
                this.reconComponent.added = true;
                this.reviewMode = false;
                this.reconComponent.hideAdd = true;
                this.reconComponent.hideSearch = false;
                this.searchScreen.hideSearch = true;
                this.addData = {};
                this.disableFields = true;
                this.disableNUCModel = true;
                this.disableModemModel = true;
                this.disableEqpmtModel = true;

            } else {
                this.reconComponent.addError = true;
                this.reviewMode = false;
                this.reconComponent.hideAdd = true;
                this.reconComponent.hideSearch = false;
                this.searchScreen.hideSearch = true;
                this.addData = {};
            }
            this.addFormBlock.stop();
        }).catch((err) => {
            console.log("Error Processing addForm" + err);
            this.reconComponent.addError = true;
            this.reviewMode = false;
            this.reconComponent.hideAdd = true;
            this.reconComponent.hideSearch = false;
            this.searchScreen.hideSearch = false;
            this.addData = {};
            this.addFormBlock.stop();
        });
        document.documentElement.scrollTop = 0;
    }

    clearData() {
        //this.searchScreen.added = false;
        this.reconComponent.added = false;
        this.searchScreen.deleted = false;
        this.reconComponent.addError = false;
    }
}