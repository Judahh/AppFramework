// import { Array } from 'simpleutils';
import { Util } from './../../util/util';
import { Component } from './../component/component';
// tslint:disable-next-line:no-empty
try { require('./componentDivisor.css'); } catch (e) { };

export class ComponentDivisor extends Component {

    constructor(father?: Component) {
        super(father, 'div');
    }
}
ComponentDivisor.addConstructor(ComponentDivisor.name, ComponentDivisor);
