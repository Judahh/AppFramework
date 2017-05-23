importJS('app/view/util/util');
importJS('app/view/common/image/modelImage');

importCSS('app/view/common/image/componentImage');

class ComponentImage{
  public constructor(){}

  public getName() {
      var funcNameRegex = /function (.{1,})\(/;
      var results = (funcNameRegex).exec((<any> this).constructor.toString());
      return (results && results.length > 1) ? results[1] : "";
  }

  public render() {
    //  test.mad+
    // console.log( "JSON Data:");

    Util.getJson("app/view/jSON/test.json").then(
      function(data:ModelImage){
        console.log("JSONT:" + data.source);
        console.log("FILE:" + this.getName());
      }
    ).fail();
    
    return Util.elementHTML("image","nasidas2");
  }
}