// import { Array } from 'simpleutils';
import * as $ from 'jquery';
// try { let $ = require('jquery'); } catch (e) { };
// import { JQueryPromise } from '@types/jquery'
// declare let $: any;
// declare let JQueryPromise: any;

// declare module '$' {
//   let _$: any;
//   export = _$;
// }

// declare module 'JQueryPromise' {
//   let _JQueryPromise: any;
//   export = _JQueryPromise;
// }

declare global {
  interface Array<T> {
    type: any;
    getType(): string;
  }

  interface JQueryStatic {
    cache;
  }

  interface String {
    replaceAll(search: string, replacement: string): string;
  }
}

declare interface Array<T> {
  type: any;
  getType(): string;
}

declare interface JQueryStatic {
  cache;
}

declare interface String {
  replaceAll(search: string, replacement: string): string;
}

String.prototype.replaceAll = function (search, replacement) {
  let target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

Array.prototype.getType = function () {
  return this.type;
}

// interface Object {
//     getClassName(): string;
//     getConstructor(): any;
// }

// Object.prototype.getConstructor = function() {
//   return this.constructor;
// }

// Object.prototype.getClassName = function() {
//   return this.constructor.name;
// }

export { Array, String }

export class Util {
  private static instance: Util;
  browserLanguage;
  currentLanguage;
  dataJSON: Array<any>;

  constructor() { }

  public static getInstance(): Util {
    if (!Util.instance) {
      Util.instance = new Util();
    }
    return Util.instance;
  }

  elementHTML(name: string, id?: string, body?: string) {
    console.log('Name: ' + name);
    let hTML = '<' + name;
    if (id) {
      hTML += ' id=\'' + id;
    }
    if (body) {
      hTML += '\'>' + body + '</' + name;
    }
    return hTML + '>';
  }

  setLanguage(language: string) {
    this.dataJSON = new Array();
    this.currentLanguage = language;
  }

  getJsonPromise(path: string): JQueryPromise<any> {
    if (this.dataJSON == null) {
      this.dataJSON = new Array();
    }
    if (this.dataJSON[path] == null) {
      this.dataJSON[path] = $.getJSON(path);
    }
    // else{
    //   console.log('CACHE');
    // }
    return this.dataJSON[path];
    // return $.getJSON(path);
  }

  getTag(name: string) {
    let names: string[] = name.split('Component');
    return names[names.length - 1].toLowerCase();
  }

  getFileName(name: string) {
    return name.charAt(0).toLowerCase() + name.slice(1);
  }

  getCurrentComponentPath() {
    let error = new Error();
    // console.log('test:'+(stack+'')+'end');
    let stack = error.stack + 'END';
    // console.log('path:'+stack);
    let link = stack.split('(')[3];
    if (link == null || link === undefined || link === '') {
      link = stack.split('@')[3];
    }
    link = link.split('.js')[0].split(location.href)[1];
    // console.log('path:'+link);
    return link;
  }

  removeElements(elements: NodeListOf<Element>) {
    while (elements[0]) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  }

  getBrowserLanguage() {
    if (this.browserLanguage !== undefined) {
      return this.browserLanguage;
    }

    let navigator = <any>window.navigator,
      browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'],
      i,
      language;

    // support for HTML 5.1 'navigator.languages'
    if (Array.isArray(navigator.languages)) {
      for (i = 0; i < navigator.languages.length; i++) {
        language = navigator.languages[i];
        if (language && language.length) {
          this.browserLanguage = language;
          return language;
        }
      }
    }

    // support for other well known properties in browsers
    for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
      language = navigator[browserLanguagePropertyKeys[i]];
      if (language && language.length) {
        this.browserLanguage = language;
        return language;
      }
    }

    this.browserLanguage = 'en-US';
    return this.browserLanguage;
  }

  getCurrentLanguage() {
    if (this.currentLanguage !== undefined) {
      return this.currentLanguage;
    } else if (this.getCookie('language') !== undefined) {
      this.currentLanguage = this.getCookie('language');
    } else {
      this.currentLanguage = this.getBrowserLanguage();
    }
    return this.currentLanguage;
  }

  setCurrentLanguage(language: string) {
    this.currentLanguage = language;
    this.setCookie('language', language);
  }

  publicApiRequest(methodType: string, apiURL: string, callback) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        // console.log(xmlHttp.responseText);
        callback(xmlHttp.responseText);
      }
    }
    xmlHttp.open(methodType, apiURL, true); // true for asynchronous
    xmlHttp.send(null);
  }

  setCookie(name: string, value: any, expiresDays?: number) {
    if (expiresDays) {
      let d = new Date();
      d.setTime(d.getTime() + (expiresDays * 24 * 60 * 60 * 1000));
      let expires = 'expires=' + d.toUTCString();
      document.cookie = name + '=' + value + ';' + expires + ';path=/';
    } else {
      document.cookie = name + '=' + value + ';path=/';
    }
  }

  clearCookie(name: string, expiresDays?: number) {
    if (expiresDays) {
      let d = new Date();
      d.setTime(d.getTime() + (expiresDays * 24 * 60 * 60 * 1000));
      let expires = 'expires=' + d.toUTCString();
      document.cookie = name + '=' + '' + ';' + expires + ';path=/';
    } else {
      document.cookie = name + '=' + '' + ';path=/';
    }
  }

  getCookie(name: string) {
    name += '=';
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  checkCookie() {
    let user = this.getCookie('username');
    if (user !== '') {
      alert('Welcome again ' + user);
    } else {
      user = prompt('Please enter your name:', '');
      if (user !== '' && user != null) {
        this.setCookie('username', user, 365);
      }
    }
  }

}