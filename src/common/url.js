import ENV from './env.js';

const STATIC = false;

let API_URL = {};

if (!STATIC) {
    API_URL = {
        // SMO_PORTAL_URL: ENV.PORTAL_URL,
        config:{
            userIsSendEmail: `${ENV.ADMIN_URL}/userInfo/setMailFlag.do`,
            queryUserEmail: `${ENV.ADMIN_URL}/userInfo/getMailFlag.do`,
            logoutUrl: `${ENV.LOGOUT_URL}`,
        },
        common: {
            arealist: `${ENV.ADMIN_URL}/department/getRegionListByParentId.do`, // 获取省市接口（一级行政单位
            uploadimg:`${ENV.ADMIN_URL}/multimedia/uploadEditorImg.do`,
            uploadser:`${ENV.ADMIN_URL}/multimedia/uploadImg.do`,
            imgpath:`${ENV.ADMIN_URL}/multimedia/editor/img/get.do?value=`,
        },
        index:{
            queryLastTendencyList: `${ENV.ADMIN_URL}/department/queryLastTendencyList.do`,
            addLastTendency: `${ENV.ADMIN_URL}/department/addLastTendency.do`,
            deleteLastTendency: `${ENV.ADMIN_URL}/department/deleteLastTendency.do`,
            modifyLastTendency: `${ENV.ADMIN_URL}/department/modifyLastTendency.do`,
            //会议
            queryMeetingList: `${ENV.ADMIN_URL}/department/queryMeetingList.do`,
            addMeeting: `${ENV.ADMIN_URL}/department/addMeeting.do`,
            deleteMeeting: `${ENV.ADMIN_URL}/department/deleteMeeting.do`,
            modifyMeeting: `${ENV.ADMIN_URL}/department/modifyMeeting.do`,
            //研究课题
            queryResearchSubjectList: `${ENV.ADMIN_URL}/department/queryResearchSubjectList.do`,
            addResearchSubject: `${ENV.ADMIN_URL}/department/addResearchSubject.do`,
            deleteResearchSubjectId: `${ENV.ADMIN_URL}/department/deleteResearchSubjectId.do`,
            modifyResearchSubject: `${ENV.ADMIN_URL}/department/modifyResearchSubject.do`,
            //轮播
            queryCarrouselImgList: `${ENV.ADMIN_URL}/department/queryCarrouselImgList.do`,
            addCarrouselImg: `${ENV.ADMIN_URL}/department/addCarrouselImg.do`,
            deleteCarrouselImg: `${ENV.ADMIN_URL}/department/deleteCarrouselImg.do`,
            modifyCarrouselImg: `${ENV.ADMIN_URL}/department/modifyCarrouselImg.do`,
            //添加部门
            queryDepartment: `${ENV.ADMIN_URL}/department/queryDepartment.do`,
            addDepartment: `${ENV.ADMIN_URL}/department/modifyDepartment.do`,
            modifyDepartment: `${ENV.ADMIN_URL}/department/modifyDepartment.do`,
        },
        education:{
            queryPopularScienceCategoryList: `${ENV.ADMIN_URL}/department/queryPopularScienceCategoryList.do`,
            addPopularScienceCategory: `${ENV.ADMIN_URL}/department/addPopularScienceCategory.do`,
            deletePopularScienceCategory: `${ENV.ADMIN_URL}/department/deletePopularScienceCategory.do`,
            modifyPopularScienceCategory: `${ENV.ADMIN_URL}/department/modifyPopularScienceCategory.do`,
            sortPopularScienceCategory: `${ENV.ADMIN_URL}/department/sortPopularScienceCategory.do`,

            queryPopularScienceList: `${ENV.ADMIN_URL}/department/queryPopularScienceList.do`,
            addPopularScience: `${ENV.ADMIN_URL}/department/addPopularScience.do`,
            deletePopularScience: `${ENV.ADMIN_URL}/department/deletePopularScience.do`,
            modifyPopularScience: `${ENV.ADMIN_URL}/department/modifyPopularScience.do`,
        },
        question:{
            queryQuestionStoreList: `${ENV.ADMIN_URL}/department/queryQuestionStoreList.do`,
            addQuestionStore: `${ENV.ADMIN_URL}/department/addQuestionStore.do`,
            deleteQuestionStore: `${ENV.ADMIN_URL}/department/deleteQuestionStore.do`,
            modifyQuestionStore: `${ENV.ADMIN_URL}/department/modifyQuestionStore.do`,
            
        }
	};
}

export {API_URL as default, STATIC};
