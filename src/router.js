import React, {Component} from "react";
import {Route, Redirect} from "react-router-dom";
import Login from "./components/home/Login";
import Carousel from "./components/Index/Carousel"
import News from "./components/Index/News"
import NewsSave from "./components/Index/NewsSave"
import Meeting from "./components/Index/Meeting"
import Subject from "./components/Index/Subject"
import Department from "./components/Team/Department"
import Doctor from "./components/Team/Doctor"
import EducationClass from "./components/Education/EducationClass"
import Detail from "./components/Education/Detail"
import Question from "./components/Question"
import ConsulHistory from "./components/ConsulHistory"
import ConsulHot from "./components/ConsulHot"
import Assistants from "./components/usermanager/Assistants"
import Doctors from "./components/usermanager/Doctors"
import Patients from "./components/usermanager/Patients"
import Serive from "./components/Serive"
import Arrangement from "./components/Arrangement"
import ArrangeDetail from "./components/Arrangement/detail"
import Auth from "./components/Auth"

const routes = [{
    path: '/',
    exact: true,
    render: () => 1 ? <Redirect to="/index/news"/> : <Redirect to="/login"/>,
}, {
    path: '/index',
    exact: true,
    render: () => <News />,
}, {
    path: '/index/news',
    exact: true,
    render: () => <News />,
}, {
    path: '/index/news/save',
    exact: true,
    render: (props) => <NewsSave {...props}/>,
}, {
    path: '/index/news/save/:id',
    exact: true,
    render: (props) => <NewsSave {...props}/>,
}, {
    path: '/index/meet',
    exact: true,
    render: () => <Meeting />,
}, {
    path: '/index/subject',
    exact: true,
    render: () => <Subject />,
}, {
    path: '/index/carousel',
    exact: true,
    render: () => <Carousel />,
}, {
    path: '/team/department',
    exact: true,
    render: () => <Department />,
}, {
    path: '/team/doctor',
    exact: true,
    render: () => <Doctor />,
}, {
    path: '/education/class',
    exact: true,
    render: () => <EducationClass />,
}, {
    path: '/education/detail',
    exact: true,
    render: () => <Detail />,
}, {
    path: '/question',
    exact: true,
    render: () => <Question />,
}, {
    path: '/consulhistory',
    exact: true,
    render: () => <ConsulHistory />,
}, {
    path: '/consulhot',
    exact: true,
    render: () => <ConsulHot />,
}, {
    path: '/usermanager/assistants',
    exact: true,
    render: () => <Assistants />,
}, {
    path: '/usermanager/doctors',
    exact: true,
    render: () => <Doctors />,
}, {
    path: '/usermanager/patients',
    exact: true,
    render: () => <Patients />,
}, {
    path: '/serive',
    exact: true,
    render: () => <Serive />,
}, {
    path: '/arrangement',
    exact: true,
    render: () => <Arrangement />,
}, {
    path: '/arrangement/detail/:id',
    exact: true,
    render: (props) => <ArrangeDetail {...props}/>,
}, {
    path: '/auth',
    exact: true,
    render: () => <Auth />,
}

];

export default routes;
