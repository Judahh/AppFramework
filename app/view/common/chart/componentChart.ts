import 'simpleutils';
import { Util } from 'basicutil';
import { Component } from './../component/component';
import { GeneticCode } from '../child/geneticCode';

export class ComponentChart extends Component {
  arrayData: Array<any>;
  options: any;
  chartType: string;
  arrayPackages: Array<string>;
  language: any;

  constructor(geneticCode?: GeneticCode) {
    super({...{className: 'ComponentChart', tag: 'chart'}, ...geneticCode});
  }

  renderAfterUpdate() {
    // Load google charts
    // tslint:disable-next-line: no-eval
    let charts = eval('google' + '.' + 'charts');
    if (this.arrayPackages !== undefined && this.arrayPackages != null && this.arrayPackages.length > 0) {
      charts.load('current', { 'packages': this.arrayPackages });
    } else {
      charts.load('current', { 'packages': ['corechart'] });
    }
    let _self = this;
    charts.setOnLoadCallback(() => { _self.drawChart(); });
    // Draw the chart and set the chart values

  }

  protected updateLanguage(jSON) { // TODO: REMOVER
    let property;
    for (property in jSON) {
      if (property !== undefined) {
        if (!jSON.hasOwnProperty(property)) {
          continue;
        }

        if (jSON[property]['language'] === this.getCurrentLanguage()) {
          // console.log('LANG:'+jSON[property]['language']);
          break;
        }
      }
    }
    // console.log('selected lan:'+property);
    let subJSON = jSON[property];
    for (let languageProperty in subJSON) {
      if (languageProperty !== undefined) {
        if (!subJSON.hasOwnProperty(languageProperty)) {
          continue;
        }


        for (let index = 0; index < this.arrayData.length; index++) {
          if (languageProperty === this.arrayData[index]) {
            if (subJSON[languageProperty].constructor === Array) {
              this.arrayData[index] = '';
              subJSON[languageProperty].forEach(element => {
                this.arrayData[index] += element + '<br/>';
              });
            } else {
              this.arrayData[index] = subJSON[languageProperty];
            }
            // console.log('INNER:'+subJSON[languageProperty]);
          }
          for (let index2 = 0; index2 < this.arrayData[index].length; index2++) {
            if (languageProperty === this.arrayData[index][index2]) {
              if (subJSON[languageProperty].constructor === Array) {
                this.arrayData[index][index2] = '';
                subJSON[languageProperty].forEach(element => {
                  this.arrayData[index][index2] += element + '<br/>';
                });
              } else {
                this.arrayData[index][index2] = subJSON[languageProperty];
              }
              // console.log('INNER:'+subJSON[languageProperty]);
            }
          }
        }

        if (languageProperty === this.options.title) {
          if (subJSON[languageProperty].constructor === Array) {
            this.options.title = '';
            subJSON[languageProperty].forEach(element => {
              this.options.title += element + '<br/>';
            });
          } else {
            this.options.title = subJSON[languageProperty];
          }
          // console.log('INNER:'+subJSON[languageProperty]);
        }

      }
    }
  }

  drawChart() {
    // tslint:disable-next-line: no-eval
    let visualization = eval('google' + '.' + 'visualization');
    let data = visualization.arrayToDataTable(this.arrayData);
    // Display the chart inside the <div> element with id='piechart'
    // console.log(this.element.id);
    // tslint:disable-next-line: no-eval
    let chart = eval('new google.visualization' + '.' + this.chartType + '(this.element)');
    chart.draw(data, this.options);
    super.renderAfterUpdate();
  }
}
ComponentChart.addConstructor(ComponentChart);
