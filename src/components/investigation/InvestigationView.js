import React from 'react';
import $ from '../../common/AjaxRequest';
import { Button,Icon } from 'antd';
import API_URL from '../../common/url';
import PreviewModal from './PreviewModal';

/**
 * 项目详情页面
 */
class InvestigationView extends React.Component {

    state = {
        visible: false,
        investigation: {},
    };

    render() {
        return (
            <div className="content-2">                
                <PreviewModal/>
            </div>
        );
    }

}

export default InvestigationView;