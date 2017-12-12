import React, { Component } from 'react';
import '../../../lib/ueditor/ueditor.config.js';       
import '../../../lib/ueditor/ueditor.all.min.js';       
import '../../../lib/ueditor/lang/zh-cn/zh-cn.js';

class Ueditor extends Component{
 state = {}
 componentDidMount(){
   this.initEditor();
 }
 componentWillUnmount() {
   // 组件卸载后，清除放入库的id
   const {id} = this.props;
   UE.delEditor(id);
 }

 
 initEditor = () =>{
  const {initialFrameHeight,initialFrameWidth} = this.props;
  const id = this.props.id;
  const ueEditor = UE.getEditor(this.props.id, {initialFrameHeight: initialFrameHeight, initialFrameWidth: initialFrameWidth });
  const self = this;
  ueEditor.ready((ueditor) => {
    if (!ueditor) {
      UE.delEditor(id);
      self.initEditor();
    }
    if(ueditor){
      ueEditor.setContent(this.props.uContent);
      if(id == "uContent"){
        ueEditor.addListener("selectionchange",function(){  
          var editor=UE.getEditor('uContent');
          var arr =(UE.getEditor('uContent').getContentTxt());  
          self.props.uContentChange(arr.substring(0,30));
        })
      }
    }
    
  })
 }

 componentWillReceiveProps(nextProps){
  if(nextProps.uContent !== this.props.uContent){
    this.initEditor();//抖动问题
  }
 }

 render(){
   return (
     <div id={this.props.id} name="content" type="text/plain"></div>
   )
 }
}
export default Ueditor;