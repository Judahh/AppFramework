import { Util } from './../../util/util';
// import { AppObjectFactory } from './factory/appObjectFactory';
import { ServiceModel } from './../../serviceModel/serviceModel';

export class AppObject {
  private static types: any;
  protected father: any;
  protected className: string;
  arrayAppObject: Array<AppObject>;
  arrayAppObjectEvent: Array<AppObjectEvent>;

  page: string;
  notificationName: string;

  view: ComponentView;
  pageBody: ComponentPageBody;
  header: ComponentGeneric;
  notification: ComponentNotification;
  footer: ComponentGeneric;

  checkView: boolean;
  checkNotification: boolean;

  public static getInstance(father?: AppObject) {
    return new this(father);
  }

  public static addType(type) {
    AppObject.addConstructor(type.getClassName(), type.getConstructor());
  }

  public static addConstructor(name, constructor) {
    if (AppObject.types === undefined) {
      AppObject.types = {};
    }
    if (AppObject.types[name] === undefined) {
      AppObject.types[name] = constructor;
      // console.log('name', name);
      // console.log('constructor', constructor);
    }
  }

  constructor(father?: any) {
    if (father) {
      this.father = father;
    }

    this.checkView = false;
    this.checkNotification = false;
    this.arrayAppObject = new Array<AppObject>();
    this.arrayAppObjectEvent = new Array<AppObjectEvent>();
    this.arrayAppObjectEvent.type = AppObjectEvent;
    this.className = 'AppObject';
  }

  protected getConstructor() {
    return this.constructor;
  }

  public getClassName() {
    return this.className;
  }

  // tslint:disable-next-line:no-empty
  public renderBeforeUpdateJSON() { }

  // tslint:disable-next-line:no-empty
  public renderAfterUpdateJSON() { }

  public getView() {
    if (!this.checkView) {
      this.setView();
    }
    return this.view;
  }

  public getPage() {
    if (this.page === undefined) {
      this.setPage();
    }
    return this.page;
  }

  public getPageBody() {
    if (this.pageBody === undefined) {
      this.setPageBody();
    }
    return this.pageBody;
  }

  public getHeader() {
    if (this.header === undefined) {
      this.setHeader();
    }
    return this.header;
  }

  public getFooter() {
    if (this.footer === undefined) {
      this.setFooter();
    }
    return this.footer;
  }

  public getNotification() {
    if (!this.checkNotification) {
      this.setNotification();
    }
    return this.notification;
  }

  public getNotificationName() {
    if (this.notificationName === undefined) {
      this.setNotificationName();
    }
    return this.notificationName;
  }

  protected updateFromSize(jSON) {
    for (let property in jSON) {
      if (document.body.clientWidth <= parseInt(property, 10)) {
        console.log(jSON[property]);
        this.getJSONPromise(jSON[property]);
        return;
      }
    }
  }

  protected updateFailed(data) {
    console.error('JSONT:' + data);
    // this.element.innerHTML = data;
  }

  protected getJSONLanguagePromise(file) {
    // console.log('lang is '+file);
    ServiceModel.getPromise(file).then((data) => this.updateLanguage(data)).fail((data) => this.updateFailed(data));
  }

  public getFather() {
    return this.father;
  }

  public setFather(father) {
    this.father = father;
  }

  public setCurrentLanguage(language: string) {
    Util.getInstance().setLanguage(language);
  }

  public getCurrentLanguage() {
    return Util.getInstance().getCurrentLanguage();
  }

  public seekFather(className: string): AppObject {
    if (this.father !== undefined) {
      // console.log('FATHER NAME:' + this.father.getClassName());
      if (this.father.getClassName() === 'ComponentGeneric') {
        if (this.father.generateTag(className) === this.father.getTag()) {
          return this.father;
        } else {
          return this.father.seekFather(className);
        }
      } else if (this.father.getClassName() === className) {
        return this.father;
      } else {
        return this.father.seekFather(className);
      }
    }
    return undefined;
  }

  public getArrayType(array: Array<any>) {
    return array.type;
  }

  public getNameFromArrayName(arrayName: string) {
    return arrayName.split('array')[1];
  }

  public getAppObject(className) {
    for (let index = 0; index < this.arrayAppObject.length; index++) {
      const appObject = this.arrayAppObject[index];
      if (appObject.className === className) {
        return appObject;
      }
    }
    return undefined;
  }

  public getAllAppObject(className) {
    let array = new Array<AppObject>();
    for (let index = 0; index < this.arrayAppObject.length; index++) {
      const appObject = this.arrayAppObject[index];
      if (appObject.className === className) {
        array.push(appObject);
      }
    }
    return array;
  }

  protected update(jSON) {
    this.updateJSON(jSON);
  }

  protected updateJSON(jSON, type?: number) {
    this.renderBeforeUpdateJSON();
    // console.log('UPDATE!');
    for (let property in jSON) {
      // console.log('Prop:' + property);
      if (property !== undefined) {
        // console.log('DEFINED!');
        if (!jSON.hasOwnProperty(property)) {
          continue;
        }
        // console.log('TYPE:'+type);
        if (type) {
          this.updateJSONWithType(jSON, property, type);
        } else {
          if (typeof jSON[property] === 'object') {
            this.updateJSONWithObject(jSON, property);
          } else {
            // console.log('Prop is var:' + jSON[property]);
            this[property] = jSON[property];
          }
        }
      }
    }
    this.renderAfterUpdateJSON();
  }

  // tslint:disable-next-line:no-empty
  protected clearProperty(property) { }

  // tslint:disable-next-line:no-empty
  protected elementStyle(jSON, property) { }

  // tslint:disable-next-line:no-empty
  protected elementVar(jSON, property) { }

  // tslint:disable-next-line:no-empty
  protected elementSpecial(jSON, property, property2) { }

  protected getLanguage() {
    if (this.getNotificationName() !== undefined) {
      this.getJSONLanguagePromise(this.getNotificationName() + 'L');
    } else if (this.getHeader() !== undefined) {
      this.getJSONLanguagePromise('headerL');
    } else if (this.getFooter() !== undefined) {
      this.getJSONLanguagePromise('footerL');
    } else if (this.getPage() !== undefined) {
      this.getJSONLanguagePromise(this.getPage() + 'L');
    }
  }

  // tslint:disable-next-line:no-empty
  protected updateLanguage(jSON) { }

  protected getJSONPromise(file) {
    ServiceModel.getPromise(file).then((data) => this.update(data)).fail((data) => this.updateFailed(data));
  }

  private updateJSONWithArray(jSON, property: any) {
    this.clearProperty(property);

    if (this[property].type !== undefined) {
      jSON[property].forEach(element => {
        let properElement = new this[property].type(this);
        // console.log(properElement);
        properElement.updateJSON(element);
        this[property].push(properElement);
      });
    } else {
      jSON[property].forEach(element => {
        // console.log('START');
        // console.log('type', element.type);
        let object = AppObject.types[element.type];
        let properElement;
        if (object !== null && object !== undefined) {
          properElement = new object(this);
        } else {
          object = AppObject.types['ComponentGeneric'];
          properElement = new object(this, element.type);
        }
        // console.log('object', object);
        // console.log('properElement', properElement);
        properElement.updateJSON(element);
        this[property].push(properElement);

      });
    }
  }

  private updateJSONWithType(jSON, property: any, type: number) {
    // console.log('Prop2');
    if (type === 2) {
      // console.log('Prop3 is var');
      this.elementStyle(jSON, property);
    } else {
      if (property === 'style') {
        // console.log('Prop is style');
        this.updateJSON(jSON[property], 2);
      } else if (property === 'special') {
        // console.log('Prop is special');
        this.updateJSONWithSpecialType(jSON, property, type);
      } else {
        // console.log('Prop is not style or special');
        this.elementVar(jSON, property);
      }
    }
  }

  private updateJSONWithSpecialType(jSON, property: any, type: number) {
    for (let property2 in jSON[property]) {
      if (jSON[property].hasOwnProperty(property2)) {
        // console.log('ValueSP:' + property2);
        // console.log('ValueS:' + jSON[property][property2]);
        this.elementSpecial(jSON, property, property2);
      }
    }
  }

  private updateJSONWithObject(jSON, property: any) {
    // console.log('Prop is object');
    if (property === 'element') {
      // console.log('Prop is element');
      this.updateJSON(jSON[property], 1);
      // // console.log('Prop is element OUT');
    } else {
      // console.log('Prop is regular');
      if (this[property] === undefined) {
        this[property] = jSON[property];
        // this[property].insert(this);
      } else {
        if (this[property].constructor === Array) {
          this.updateJSONWithArray(jSON, property);
        } else {
          this[property].updateJSON(jSON[property]);
          // this[property].insert(this);
        }
      }
    }
  }

  private setPageBody() {
    this.pageBody = this.getView().pageBody;
  }

  private setHeader() {
    this.header = this.getView().header;
  }

  private setFooter() {
    this.footer = this.getView().footer;
  }

  private setView() {
    this.checkView = true;
    this.view = <ComponentView>this.seekFather('ComponentView');
  }

  private setNotification() {
    this.checkNotification = true;
    this.notification = <ComponentNotification>this.seekFather('ComponentNotification');
  }

  private setPage() {
    this.page = this.getPageBody().nextPageName;
  }

  private setNotificationName() {
    if (this.getNotification() !== undefined) {
      this.notificationName = this.getNotification().nextNotificationName;
    }
  }
}

import { AppObjectEvent } from './event/appObjectEvent';
import { ComponentView } from './../../componentView';
import { ComponentPageBody } from './../../body/componentPageBody';
import { ComponentGeneric } from '../component/generic/componentGeneric';
import { ComponentNotification } from '../notification/componentNotification';
AppObject.addConstructor('AppObject', AppObject);
