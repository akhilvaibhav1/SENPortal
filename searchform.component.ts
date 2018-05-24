import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SlicePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReconciliationService } from '../../services/reconciliation.service';
import { ReconciliationComponent } from '../reconciliation.component';
//import { ViewEditForm } from './viewform.component';

//jqwidgets components
import { jqxChartComponent } from '../../../jqwidgets-ts/angular_jqxchart';
import { jqxDropDownListComponent } from '../../../jqwidgets-ts/angular_jqxdropdownlist';
import { jqxDataTableComponent } from '../../../jqwidgets-ts/angular_jqxdatatable';
import { jqxGridComponent } from '../../../jqwidgets-ts/angular_jqxgrid';
import { jqxDateTimeInputComponent } from '../../../jqwidgets-ts/angular_jqxdatetimeinput';

@Component({

    selector: 'searchForm',
    templateUrl: 'app/reconciliation/forms/searchform.component.html',
    styleUrls: ['app/reconciliation/forms/searchform.css'],
})

export class SearchForm {

    @BlockUI() blockUI: NgBlockUI;
    @ViewChild('formSearchGridRef') formSearchGrid: jqxGridComponent;
    @ViewChild('deleteFormModal') deleteFormModal: ElementRef;
    @ViewChild('responseMessage') elModal: ElementRef;
    @ViewChild('editResponseMessage') editResponseMessageModal: ElementRef;
    @ViewChild('editFormModal') editFormModal: ElementRef;

    @ViewChild('deploymentDate') deploymentDateVal: jqxDateTimeInputComponent;
    @ViewChild('goLiveDateRef') goLiveDate: jqxDateTimeInputComponent;

    @ViewChild('editDeploymentDate') editDeploymentDateVal: jqxDateTimeInputComponent;
    @ViewChild('editGoLiveDateRef') editGoLiveDate: jqxDateTimeInputComponent;

    constructor(private route: ActivatedRoute, private router: Router,
        private reconService: ReconciliationService,
        private reconComponent: ReconciliationComponent
        // , private viewForm : ViewEditForm
    ) {
    }

    @BlockUI('searchFormPage') searchFormPageBlock: NgBlockUI;


    deleted: boolean = false;
    showLatest: boolean = false;
    searchData: any = {};
    viewData: any = {};
    editData: any = {};
    disableFields: boolean = true;
    disableModemModel: boolean = true;
    disableNUCModel: boolean = true;
    disableEqpmtModel: boolean = true;
    bottlerListResponse: any;
    custBussSegmListResponse: any;
    countryListResponse: any;
    manufacturerListResponse: any;
    nucManufacturerListResponse: any;
    modemManufacturerListResponse: any;
    modelAndSerialResponse: any;
    nucModelResponse: any;
    modemModelResponse: any;
    modemCarrierResponse: any;
    equipModelResponse: any;
    acntNameResponse: any;
    stateListResponse: any;
    spireTypeList: any;
    thrdPartyCustIds: any;
    stateData: any;
    //added: boolean = true;
    source: any;
    data: any;
    formSearchResultTable: any;
    formSearchResultColumns: any[];

    controlFromEquipment: boolean = false;
    searchError: boolean = false;
    searchFormRowDetail: any;
    reviewMode: boolean;
    hideSearch: boolean = true;
    deletedEqpmtSrlNum: string;

    customerRowDetail: any = {};
    alertMessage: string = "";

    res: any;
    rowdetailstemplate: any;
    initrowdetails: any;
    initialLoad: boolean = true;
resetAllImages(){
    (document.getElementById('i1') as HTMLImageElement).src = "app/images/unreconciled.png";
    (document.getElementById('i2') as HTMLImageElement).src = "app/images/notLinked.png";
    (document.getElementById('i3') as HTMLImageElement).src = "app/images/manageExceptions.png";
    (document.getElementById('i4') as HTMLImageElement).src = "app/images/summaryreport.png";
    (document.getElementById('i5') as HTMLImageElement).src = "app/images/forms.png";
    (document.getElementById('i6') as HTMLImageElement).src = "app/images/search.png";
}
    onTabClick() {
        this.resetAllImages();
(document.getElementById('i5') as HTMLImageElement).src = "app/images/forms-i.png";
        if (this.initialLoad) {
            this.searchFormPageBlock.start('Loading...');
            this.disableFields = true;

            this.reconService.loadFormDetails().then(res => {
                //this.bottlerListResponse = res.bottlers;
                //this.countryListResponse = res.countries;
                this.nucManufacturerListResponse = res.nucMake;
                this.modemManufacturerListResponse = res.modemMake;
                this.manufacturerListResponse = res.equipMake;
                this.modemCarrierResponse = res.modemCarrier;

                this.searchFormPageBlock.stop();
            }).catch((err) => {
                console.log("Error Processing loadFormDetails" + err);
                this.searchFormPageBlock.stop();
            });
            this.reconService.loadCtryStateBottler().then(res => {

                this.countryListResponse = res.countries;

                this.spireTypeList = res.spireUnitTypes;

                this.searchFormPageBlock.stop();
            }).catch((err) => {
                console.log("Error Processing loadFormDetails" + err);
                this.searchFormPageBlock.stop();
            });
            //this.spireTypeList = ['Spire 2.0', 'Spire 2.0 CREW', 'Spire 3.0', 'Spire 3.1', 'Spire 4.1', 'Spire Type 5.0', 'Spire Type 6.0'];
            this.initialLoad = false;
        }
    }
    onCountryChange() {
        // var temp = this.countryListResponse;
        // var newTemp = {};
        // for (var t in temp) {
        //     newTemp[temp[t]["countryCode"]] = temp[t]["countryId"]
        // }
        // JSON.stringify(newTemp);

        for (let i = 0; i < this.countryListResponse.length; i++) {
            let country = this.countryListResponse[i];
            if (country.countryValue === this.searchData.country) {
                this.stateListResponse = country.states;
                //this.stateListDataSource = this.getStateListDataSource();
                this.bottlerListResponse = country.bottlingPartners;
                //this.bottlingPartnerListDataSource = this.getBottlingPartnerListDataSource();
            }
        }

        // this.reconService.getStateList(newTemp[this.searchData.country]).then(res => {
        //     this.stateListResponse = res;
        // });

        if (this.searchData.country != null && this.searchData.country != "") {
            this.disableFields = false;
        } else {
            this.searchData.btlrNm = null;
            this.searchData.custState = null;
            this.disableFields = true;
        }
    }
    onResetClick() {
        this.searchData = {};
        this.disableFields = true;
        this.clearGrid();
        this.reconComponent.added = false;
        this.reconComponent.addError = false;
        this.deleted = false;
        this.searchError = false;
        document.documentElement.scrollTop = 0;
    }
    clearGrid() {
        this.formSearchResultTable = null;
        this.formSearchResultColumns = null;
    }

    onNUCMakeChange() {
        var temp = this.nucManufacturerListResponse;
        var newTemp = {};
        for (var t in temp) {
            newTemp[temp[t]["key"]] = temp[t]["value"]
        }
        JSON.stringify(newTemp);
        //this.reconService.getModelByPartManufacturer(this.addData.nucMake, newTemp[this.addData.nucMake]).then(res => {
        this.reconService.getModelByPartManufacturer(this.searchData.nucMake, newTemp[this.searchData.nucMake]).then(res => {
            this.nucModelResponse = res;
        });
        //  this.modelAndSerialResponse = [{ "equipmentId": 0, "asnEquipmentId": 0, "equipmentSerialNo": "SERIALTEST1", "equipmentMakeModel": 13715, "equipmentModelValue": "CT120 1 DOOR SWING", "equipmentTypeName": "FSV VENDING", "isMakeModelEdited": false }];
        if (this.searchData.nucMake != null && this.searchData.nucMake != "") {
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
        this.reconService.getModelByPartManufacturer(this.searchData.modemMake, newTemp[this.searchData.modemMake]).then(res => {
            this.modemModelResponse = res;
        });
        //  this.modelAndSerialResponse = [{ "equipmentId": 0, "asnEquipmentId": 0, "equipmentSerialNo": "SERIALTEST1", "equipmentMakeModel": 13715, "equipmentModelValue": "CT120 1 DOOR SWING", "equipmentTypeName": "FSV VENDING", "isMakeModelEdited": false }];
        if (this.searchData.modemMake != null && this.searchData.modemMake != "") {
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
        this.reconService.getModelByEquipManufacturer(newTemp[this.searchData.eqpmtMfgr],
            this.searchData.eqpmtMfgr).then(res => {
                //this.modelAndSerialResponse = this.getDistinctModels(res);
                this.equipModelResponse = res;
            });

        if (this.searchData.eqpmtMfgr != null && this.searchData.eqpmtMfgr != "") {
            this.disableEqpmtModel = false;
        } else {
            this.disableEqpmtModel = true;
        }
    }

    searchForm() {
        this.searchFormPageBlock.start('Searching...');

        this.formSearchResultTable = null;
        this.formSearchResultColumns = null;

        this.rowdetailstemplate = {
            rowdetails: '<div></div>',
            rowdetailsheight: 180
        }

        this.initrowdetails = (index: any, parentElement: any, gridElement: any, datarecord: any): void => {
           if(parentElement!= undefined){
             let information = parentElement.children[0];

            if (information != null) {

                let container = document.createElement('div');
                information.appendChild(container);

                let leftcolumn = document.createElement('div');
                let rightcolumn = document.createElement('div');

                leftcolumn.style.cssText = 'float: left; width: 50%; border-top: 1px dotted blue';
                rightcolumn.style.cssText = 'float: left; width: 50%; border-top: 1px dotted blue';

                container.appendChild(leftcolumn);
                container.appendChild(rightcolumn);

                var btlrNmVal = (datarecord.btlrNm != null && datarecord.btlrNm != "") ? datarecord.btlrNm : " - ";
                var eqpmtLocDscVal = (datarecord.eqpmtLocDsc != null && datarecord.eqpmtLocDsc != "") ? datarecord.eqpmtLocDsc : " - ";
                var custAddrTxt1Val = (datarecord.custAddrTxt1 != null && datarecord.custAddrTxt1 != "") ? datarecord.custAddrTxt1 : " - ";
                var custAddrTxt2Val = (datarecord.custAddrTxt2 != null && datarecord.custAddrTxt2 != "") ? datarecord.custAddrTxt2 : " - ";
                var custCityVal = (datarecord.custCity != null && datarecord.custCity != "") ? datarecord.custCity : " - ";
                var custStateVal = (datarecord.custState != null && datarecord.custState != "") ? datarecord.custState : " - ";
                var custPostCdVal = (datarecord.custPostCd != null && datarecord.custPostCd != "") ? datarecord.custPostCd : " - ";
                var countryVal = (datarecord.country != null && datarecord.country != "") ? datarecord.country : " - ";
                var deploymentDtVal = (datarecord.deploymentDt != null && datarecord.deploymentDt != "") ? datarecord.deploymentDt : " - ";
                var goLiveDtVal = (datarecord.goLiveDt != null && datarecord.goLiveDt != "") ? datarecord.goLiveDt : " - ";
                var temp = this.countryListResponse;
                var newTemp = {};
                for (var t in temp) {
                    newTemp[temp[t]["countryValue"]] = temp[t]["countryName"];
                }
                JSON.stringify(newTemp);
                countryVal = newTemp[datarecord.country];
                let btlrNm = '<div style="font-size:12px; margin-left: 10px; margin-top: 5px;"><b>Bottling Partner:</b> ' + btlrNmVal + '</div>';
                let eqpmtLocDsc = '<div style="font-size:12px; margin-left: 10px; margin-top: 3px;"><b>Equipment Location:</b> ' + eqpmtLocDscVal + '</div>';
                let custAddrTxt1 = '<div style="font-size:12px; margin-left: 10px; margin-top: 3px;"><b>Address Line 1:</b> ' + custAddrTxt1Val + '</div>';
                let custAddrTxt2 = '<div style="font-size:12px; margin-left: 10px; margin-top: 3px;"><b>Address Line 2:</b> ' + custAddrTxt2Val + '</div>';
                let custCity = '<div style="font-size:12px; margin-left: 10px; margin-top: 3px;"><b>City:</b> ' + custCityVal + '</div>';
                let custState = '<div style="font-size:12px; margin-left: 10px; margin-top: 5px;"><b>State:</b> ' + custStateVal + '</div>';
                let custPostCd = '<div style="font-size:12px; margin-left: 10px; margin-top: 3px;"><b>Zip/Postal Code:</b> ' + custPostCdVal + '</div>';
                let country = '<div style="font-size:12px; margin-left: 10px; margin-top: 3px;"><b>Country:</b> ' + countryVal + '</div>';
                let deploymentDt = '<div style="font-size:12px; margin-left: 10px; margin-top: 3px;"><b>Install Completion Date:</b> ' + deploymentDtVal + '</div>';
                let goLiveDt = '<div style="font-size:12px; margin-left: 10px; margin-top: 3px;"><b>Go Live Date:</b> ' + goLiveDtVal + '</div>';

                leftcolumn.insertAdjacentHTML('beforeend', btlrNm);
                leftcolumn.insertAdjacentHTML('beforeend', eqpmtLocDsc);
                leftcolumn.insertAdjacentHTML('beforeend', custAddrTxt1);
                leftcolumn.insertAdjacentHTML('beforeend', custAddrTxt2);
                leftcolumn.insertAdjacentHTML('beforeend', custCity);
                leftcolumn.insertAdjacentHTML('beforeend', custState);
                leftcolumn.insertAdjacentHTML('beforeend', custPostCd);
                leftcolumn.insertAdjacentHTML('beforeend', country);
                leftcolumn.insertAdjacentHTML('beforeend', deploymentDt);
                leftcolumn.insertAdjacentHTML('beforeend', goLiveDt);

                var eqpmtMfgrVal = (datarecord.eqpmtMfgr != null && datarecord.eqpmtMfgr != "") ? datarecord.eqpmtMfgr : " - ";
                var eqpmtModelVal = (datarecord.eqpmtModel != null && datarecord.eqpmtModel != "") ? datarecord.eqpmtModel : " - ";
                var nucMakeVal = (datarecord.nucMake != null && datarecord.nucMake != "") ? datarecord.nucMake : " - ";
                var nucModelVal = (datarecord.nucModel != null && datarecord.nucModel != "") ? datarecord.nucModel : " - ";
                var modemSerialNumVal = (datarecord.modemSerialNum != null && datarecord.modemSerialNum != "") ? datarecord.modemSerialNum : " - ";
                var modemMakeVal = (datarecord.modemMake != null && datarecord.modemMake != "") ? datarecord.modemMake : " - ";
                var modemModelVal = (datarecord.modemModel != null && datarecord.modemModel != "") ? datarecord.modemModel : " - ";
                var modemCarrierVal = (datarecord.modemCarrier != null && datarecord.modemCarrier != "") ? datarecord.modemCarrier : " - ";
                var statusVal = (datarecord.status != null && datarecord.status != "") ? datarecord.status : " - ";
                var identItemIdVal = (datarecord.identItemId != null && datarecord.identItemId != "") ? datarecord.identItemId : " - ";

                let eqpmtMfgr = '<div style="font-size:12px; margin-left: 10px; margin-top: 5px;"><b>Spire Make:</b> ' + eqpmtMfgrVal + '</div>';
                let eqpmtModel = '<div style="font-size:12px; margin-left: 10px; margin-top: 3px;"><b>Spire Model:</b> ' + eqpmtModelVal + '</div>';
                let nucMake = '<div style="font-size:12px; margin-left: 10px; margin-top: 3px;"><b>NUC Make:</b> ' + nucMakeVal + '</div>';
                let nucModel = '<div style="font-size:12px; margin-left: 10px; margin-top: 5px;"><b>NUC Model:</b> ' + nucModelVal + '</div>';
                let modemSerialNum = '<div style="font-size:12px; margin-left: 10px; margin-top: 3px;"><b>Modem Serial Num:</b> ' + modemSerialNumVal + '</div>';
                let modemMake = '<div style="font-size:12px; margin-left: 10px; margin-top: 3px;"><b>Modem Make:</b> ' + modemMakeVal + '</div>';
                let modemModel = '<div style="font-size:12px; margin-left: 10px; margin-top: 3px;"><b>Modem Model:</b> ' + modemModelVal + '</div>';
                let modemCarrier = '<div style="font-size:12px; margin-left: 10px; margin-top: 3px;"><b>Modem Carrier:</b> ' + modemCarrierVal + '</div>';
                let identItemId = '<div style="font-size:12px; margin-left: 10px; margin-top: 3px;"><b>Ident Item ID:</b> ' + identItemIdVal + '</div>';
                let status = '<div style="font-size:12px; margin-left: 10px; margin-top: 3px;"><b>Status:</b> ' + statusVal + '</div>';

                rightcolumn.insertAdjacentHTML('beforeend', eqpmtMfgr);
                rightcolumn.insertAdjacentHTML('beforeend', eqpmtModel);
                rightcolumn.insertAdjacentHTML('beforeend', identItemId);
                rightcolumn.insertAdjacentHTML('beforeend', nucMake);
                rightcolumn.insertAdjacentHTML('beforeend', nucModel);
                rightcolumn.insertAdjacentHTML('beforeend', modemSerialNum);
                rightcolumn.insertAdjacentHTML('beforeend', modemMake);
                rightcolumn.insertAdjacentHTML('beforeend', modemModel);
                rightcolumn.insertAdjacentHTML('beforeend', modemCarrier);
                rightcolumn.insertAdjacentHTML('beforeend', status);
            } }
        }

        // this.reconService.searchForm(this.searchData)
        //     .then(res => {
                this.res = [{"custEqpmtFormId":1,"custNm":"SEN PepsiCo","btlrCustIdVal":null,"accountNm":null,"custBusnSegment":null,"custAddrTxt1":"1129 Westchester Avenue","custAddrTxt2":null,"custCity":"White Plains","custState":"NY","custPostCd":"10604","country":"US","lng":null,"lat":null,"deploymentDt":"2017-11-15 06:10:18.0","goLiveDt":null,"eqpmtSrlNum":"6211509PT013","eqpmtType":"TOWER","eqpmtLocDsc":"First Floor","eqpmtMfgr":"VERIZON","eqpmtModel":"Spire 2.0","thirdPartyEqpmtId":"1111","btlrNm":"IBI","status":null,"nucSerialNum":"GEGK348006GB","nucMake":null,"nucModel":null,"modemMake":"MULTI TECH SYSTEMS","modemCarrier":null,"modemModel":"MTModem","modemSerialNum":"123123123","dateSubmitted":"2017-11-15 06:10:18.0"},{"custEqpmtFormId":101,"custNm":"James","btlrCustIdVal":null,"accountNm":null,"custBusnSegment":null,"custAddrTxt1":null,"custAddrTxt2":null,"custCity":null,"custState":null,"custPostCd":null,"country":"US","lng":null,"lat":null,"deploymentDt":"2017-12-22 00:00:00.0","goLiveDt":null,"eqpmtSrlNum":"322222111","eqpmtType":"Spire 4.0","eqpmtLocDsc":"GG333","eqpmtMfgr":null,"eqpmtModel":null,"thirdPartyEqpmtId":null,"btlrNm":"IBI","status":null,"nucSerialNum":"GEGK99999","nucMake":null,"nucModel":null,"modemMake":null,"modemCarrier":null,"modemModel":null,"modemSerialNum":"868889090","dateSubmitted":"2017-12-04 00:11:28.0"},{"custEqpmtFormId":143,"custNm":"Edison","btlrCustIdVal":"66677999","accountNm":null,"custBusnSegment":null,"custAddrTxt1":null,"custAddrTxt2":null,"custCity":null,"custState":null,"custPostCd":null,"country":"US","lng":null,"lat":null,"deploymentDt":"2017-12-13 00:00:00.0","goLiveDt":"2018-01-25 00:00:00.0","eqpmtSrlNum":"7898999","eqpmtType":"Spire 2.0","eqpmtLocDsc":"Subway GF Left","eqpmtMfgr":null,"eqpmtModel":null,"thirdPartyEqpmtId":"2222","btlrNm":"IBI","status":null,"nucSerialNum":"GEGK8898999","nucMake":null,"nucModel":null,"modemMake":null,"modemCarrier":null,"modemModel":null,"modemSerialNum":"34545999","dateSubmitted":"2017-12-05 20:52:57.0"},{"custEqpmtFormId":166,"custNm":"ujyhy","btlrCustIdVal":"2222","accountNm":null,"custBusnSegment":null,"custAddrTxt1":"update1","custAddrTxt2":"update2","custCity":"update2","custState":"350","custPostCd":"55553","country":"US","lng":null,"lat":null,"deploymentDt":"2017-12-08 00:00:00.0","goLiveDt":"2017-12-20 00:00:00.0","eqpmtSrlNum":"jduy","eqpmtType":"Spire 2.0","eqpmtLocDsc":"juyd","eqpmtMfgr":null,"eqpmtModel":null,"thirdPartyEqpmtId":"34343434","btlrNm":"IBI","status":null,"nucSerialNum":"djyu","nucMake":null,"nucModel":null,"modemMake":null,"modemCarrier":null,"modemModel":null,"modemSerialNum":"dyuj","dateSubmitted":"2017-12-12 06:11:17.0"},{"custEqpmtFormId":181,"custNm":"dfddfgd","btlrCustIdVal":null,"accountNm":null,"custBusnSegment":null,"custAddrTxt1":null,"custAddrTxt2":null,"custCity":null,"custState":null,"custPostCd":null,"country":"US","lng":null,"lat":null,"deploymentDt":null,"goLiveDt":null,"eqpmtSrlNum":"32342","eqpmtType":"Spire 2.0","eqpmtLocDsc":"dfgg","eqpmtMfgr":null,"eqpmtModel":null,"thirdPartyEqpmtId":null,"btlrNm":"PBC","status":null,"nucSerialNum":"4453455","nucMake":null,"nucModel":null,"modemMake":null,"modemCarrier":null,"modemModel":null,"modemSerialNum":"4535453","dateSubmitted":"2017-12-15 02:50:58.0"}];
                this.source =
                    {
                        localdata: this.res,
                        datatype: "json",
                        pagesize: 5,
                        datafields:
                            [
                                { name: 'custEqpmtFormId', type: 'string' },
                                { name: 'custNm', type: 'string' },
                                { name: 'btlrCustIdVal', type: 'string' },
                                { name: 'custAddrTxt1', type: 'string' },
                                { name: 'custAddrTxt2', type: 'string' },
                                { name: 'custCity', type: 'string' },
                                { name: 'custState', type: 'string' },
                                { name: 'custPostCd', type: 'string' },
                                { name: 'country', type: 'string' },
                                { name: 'deploymentDt', type: 'string' },
                                { name: 'goLiveDt', type: 'string' },
                                { name: 'eqpmtSrlNum', type: 'string' },
                                { name: 'eqpmtType', type: 'string' },
                                { name: 'eqpmtLocDsc', type: 'string' },
                                { name: 'eqpmtMfgr', type: 'string' },
                                { name: 'eqpmtModel', type: 'string' },
                                { name: 'identItemId', type: 'string' },
                                { name: 'thirdPartyEqpmtId', type: 'string' },
                                { name: 'btlrNm', type: 'string' },
                                { name: 'status', type: 'string' },
                                { name: 'nucSerialNum', type: 'string' },
                                { name: 'nucMake', type: 'string' },
                                { name: 'nucModel', type: 'string' },
                                { name: 'modemSerialNum', type: 'string' },
                                { name: 'modemMake', type: 'string' },
                                { name: 'modemModel', type: 'string' },
                                { name: 'modemCarrier', type: 'string' },
                                { name: 'dateSubmitted', type: 'date' }
                            ]
                    };
                this.formSearchResultTable = new $.jqx.dataAdapter(this.source);
                this.formSearchResultColumns =
                    [
                        {
                            text: 'Spire Unit Serial #', datafield: 'eqpmtSrlNum', width: "12%"
                        },
                        {
                            text: 'Date Submitted', datafield: 'dateSubmitted',
                            cellsformat: 'MM/dd/yyyy hh:mm:ss tt', width: "15%"
                        },
                        {
                            text: 'Customer Name', datafield: 'custNm', width: "12%"
                        },
                        {
                            text: 'Bottler Customer ID<br/> (or) COF#', datafield: 'btlrCustIdVal',
                            width: "16%"
                        },
                        {
                            text: 'Spire Unit Type', datafield: 'eqpmtType', width: "10%"
                        },
                        {
                            text: 'Third Party Equipment<br/> ID (or) Asset#', datafield: 'thirdPartyEqpmtId',
                            width: "15%"
                        },
                        {
                            text: 'NUC Serial #', datafield: 'nucSerialNum', width: "10%"
                        },
                        {
                            text: 'CustEqpmtFormId', datafield: 'custEqpmtFormId',
                            hidden: 'true'
                        },
                        {
                            text: 'Actions', datafield: 'Edit', columntype: 'button', width: "10%",
                            cellsrenderer: (): string => {
                                return ' View Details ';
                            },
                            buttonclick: (row: number): void => {
                                this.setViewData();
                                document.documentElement.scrollTop = 0;

                            }
                        }
                        // ,
                        // {
                        //     text: 'Deployment Date', datafield: 'deploymentDt', 
                        //     cellsformat : 'dd/MM/yyyy hh:mm:ss tt', width: "5%", hidden: 'true'
                        // },
                        // {
                        //     text: 'Go Live Date', datafield: 'goLiveDt', 
                        //     cellsformat : 'dd/MM/yyyy hh:mm:ss tt', width: "5%", hidden: 'true'
                        // }

                    ];
                this.searchFormPageBlock.stop();

            // }).catch((err) => {
            //     console.log("Error Processing searchForm" + err);
            //     this.searchError = true
            //     this.searchFormPageBlock.stop();
            // });

    }

    setViewData() {

        this.hideSearch = false;
        this.searchFormRowDetail = this.formSearchGrid.getrowdata(this.formSearchGrid.selectedrowindex());
        var temp = this.countryListResponse;
        var newTemp = {};
        for (var t in temp) {
            newTemp[temp[t]["countryValue"]] = temp[t]["countryName"];
        }
        JSON.stringify(newTemp);
        this.searchFormRowDetail.country = newTemp[this.searchFormRowDetail.country];

        this.editData.custEqpmtFormId = this.searchFormRowDetail.custEqpmtFormId;
        this.editData.custNm = this.searchFormRowDetail.custNm;
        this.editData.btlrCustIdVal = this.searchFormRowDetail.btlrCustIdVal;
        this.editData.custAddrTxt1 = this.searchFormRowDetail.custAddrTxt1;
        this.editData.custAddrTxt2 = this.searchFormRowDetail.custAddrTxt2;
        this.editData.custCity = this.searchFormRowDetail.custCity;
        this.editData.custState = this.searchFormRowDetail.custState;
        this.editData.custPostCd = this.searchFormRowDetail.custPostCd;
        this.editData.country = this.searchFormRowDetail.country;
        this.editData.deploymentDt = this.searchFormRowDetail.deploymentDt;
        this.editData.goLiveDt = this.searchFormRowDetail.goLiveDt;
        this.editData.eqpmtSrlNum = this.searchFormRowDetail.eqpmtSrlNum;
        this.editData.eqpmtType = this.searchFormRowDetail.eqpmtType;
        this.editData.eqpmtLocDsc = this.searchFormRowDetail.eqpmtLocDsc;
        this.editData.eqpmtMfgr = this.searchFormRowDetail.eqpmtMfgr;
        this.editData.eqpmtModel = this.searchFormRowDetail.eqpmtModel;
        this.editData.identItemId = this.searchFormRowDetail.identItemId;
        this.editData.thirdPartyEqpmtId = this.searchFormRowDetail.thirdPartyEqpmtId;
        this.editData.btlrNm = this.searchFormRowDetail.btlrNm;
        this.editData.status = this.searchFormRowDetail.status;
        this.editData.nucSerialNum = this.searchFormRowDetail.nucSerialNum;
        this.editData.nucMake = this.searchFormRowDetail.nucMake;
        this.editData.nucModel = this.searchFormRowDetail.nucModel;
        this.editData.modemMake = this.searchFormRowDetail.modemMake;
        this.editData.modemCarrier = this.searchFormRowDetail.modemCarrier;
        this.editData.modemModel = this.searchFormRowDetail.modemModel;
        this.editData.modemSerialNum = this.searchFormRowDetail.modemSerialNum;
        this.editData.dateSubmitted = this.searchFormRowDetail.dateSubmitted;

        this.viewData.custEqpmtFormId = this.setDefaultValueToDisplay(this.searchFormRowDetail.custEqpmtFormId);
        this.viewData.reviewCountry = this.setDefaultValueToDisplay(this.searchFormRowDetail.country);
        this.viewData.reviewEqpmtSrlNum = this.setDefaultValueToDisplay(this.searchFormRowDetail.eqpmtSrlNum);
        this.viewData.reviewEqpmtType = this.setDefaultValueToDisplay(this.searchFormRowDetail.eqpmtType);
        this.viewData.reviewEqpmtLocDsc = this.setDefaultValueToDisplay(this.searchFormRowDetail.eqpmtLocDsc);
        this.viewData.reviewIdentItemId = this.setDefaultValueToDisplay(this.searchFormRowDetail.identItemId);
        this.viewData.reviewBtlrNm = this.setDefaultValueToDisplay(this.searchFormRowDetail.btlrNm);
        this.viewData.reviewCustNm = this.setDefaultValueToDisplay(this.searchFormRowDetail.custNm);
        this.viewData.reviewStatus = this.setDefaultValueToDisplay(this.searchFormRowDetail.status);
        this.viewData.reviewNucSerialNum = this.setDefaultValueToDisplay(this.searchFormRowDetail.nucSerialNum);
        this.viewData.reviewModemSerialNum = this.setDefaultValueToDisplay(this.searchFormRowDetail.modemSerialNum);
        this.viewData.dateSubmitted = this.setDefaultValueToDisplay(this.searchFormRowDetail.dateSubmitted);
        this.viewData.reviewBtlrCustIdVal = this.setDefaultValueToDisplay(this.searchFormRowDetail.btlrCustIdVal);
        this.viewData.reviewDeploymentDt = this.setDefaultValueToDisplay(this.searchFormRowDetail.deploymentDt);
        this.viewData.reviewCustAddrTxt1 = this.setDefaultValueToDisplay(this.searchFormRowDetail.custAddrTxt1);
        this.viewData.reviewCustAddrTxt2 = this.setDefaultValueToDisplay(this.searchFormRowDetail.custAddrTxt2);
        this.viewData.reviewCustCity = this.setDefaultValueToDisplay(this.searchFormRowDetail.custCity);
        this.viewData.reviewCustState = this.setDefaultValueToDisplay(this.searchFormRowDetail.custState);
        this.viewData.reviewCustPostCd = this.setDefaultValueToDisplay(this.searchFormRowDetail.custPostCd);
        this.viewData.reviewGoLiveDt = this.setDefaultValueToDisplay(this.searchFormRowDetail.goLiveDt);
        this.viewData.reviewEqpmtMfgr = this.setDefaultValueToDisplay(this.searchFormRowDetail.eqpmtMfgr);
        this.viewData.reviewEqpmtModel = this.setDefaultValueToDisplay(this.searchFormRowDetail.eqpmtModel);
        this.viewData.reviewNucMake = this.setDefaultValueToDisplay(this.searchFormRowDetail.nucMake);
        this.viewData.reviewNucModel = this.setDefaultValueToDisplay(this.searchFormRowDetail.nucModel);
        this.viewData.reviewThirdPartyEqpmtId = this.setDefaultValueToDisplay(this.searchFormRowDetail.thirdPartyEqpmtId);
        this.viewData.reviewModemCarrier = this.setDefaultValueToDisplay(this.searchFormRowDetail.modemCarrier);
        this.viewData.reviewModemModel = this.setDefaultValueToDisplay(this.searchFormRowDetail.modemModel);
        this.viewData.reviewModemMake = this.setDefaultValueToDisplay(this.searchFormRowDetail.modemMake);
        this.reviewMode = true;
    }

    setDefaultValueToDisplay(input) {
        return (input != null && input != "") ? input : " - ";

    }

    toggleView() {

        this.reconComponent.hideAdd = false;
        this.reconComponent.hideSearch = true;

    }

}