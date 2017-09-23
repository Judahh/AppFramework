importJS('app/view/util/util');
importJS('app/view/common/component/component');
importJS('app/view/common/textInput/typeTextInput');
importJS('app/view/common/textInput/option/componentOption');

class ComponentDataInput extends ComponentItem {
  //IF DATALIST IT NEEDS A INPUT
  //<input list="datalistID" name="inputNAME">
  //<datalist id="datalistID">
  private type:TypeDataInput;

  constructor(father?: Component, type?:TypeDataInput) {
    super(father, ComponentDataInput.typeTag(type));
    this.type = type;
    console.log("a");
  }

  public static typeTag(type:TypeDataInput){
    switch(type){
      case TypeDataInput.textArea:
        return "textarea";
      case TypeDataInput.combobox:
        return "select";
      default:
        return "input";
    }
  }

  public static hasOption(type:TypeDataInput){
    return (type==TypeDataInput.dataList||
            type==TypeDataInput.combobox);
  }
  
}