importJS('app/view/util/util');
importJS('app/view/common/image/componentBackground');
importJS('app/view/common/component/component');

importCSS('app/view/body/componentPageBody');

class ComponentPageBody extends Component{
  render() {
    let background=new ComponentBackground(this.element);
  }
}