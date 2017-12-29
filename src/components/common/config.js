import API_URL from '../../common/url';
export const config={
    pageSize:15, // 表格数据分页数
    scroll:{x:1200,y:310}, //表格框大小，超出显示滚动条
    listLength:8, // 表格滚动条出现条件
    formItemLayout:{   //表单样式，响应式
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
          md: { span: 3 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
          md: { span: 10 },
        },
    },
    submitFormLayout:{
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 12, offset: 6 },
          md: { span: 10, offset: 3 },
        },
    },
    initialFrameHeight:'300',  //富文本高
    initialFrameWidth:'140%',  //富文本宽
}
export const uploadser= API_URL.common.uploadser //图片上传服务器地址 for antd upload
export const uploadimgser = API_URL.common.uploadimg //图片上传服务器地址 for Editor
export const imgpath = API_URL.common.imgpath  //回传图片需要拼的路径