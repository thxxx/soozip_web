import React, {useState} from 'react';
import {HashRouter as Router, Route, Switch} from "react-router-dom";
import './App.css';
import Auth from '../routes/Auth';
import Home from '../routes/Home';
import LandingPage from './views/LandingPage/LandingPage';
import GalleryPage from './views/GalleryPage/GalleryPage';
import ProfilePage from './views/ProfilePage/ProfilePage';
import UploadPage from './views/UploadPage/UploadPage';
import NavBar from './views/NavBar/NavBar';
import InformationUpload from './views/UploadPage/InformationUpload'
import QnAUpload from './views/UploadPage/QnAUpload'
import QnAPage from './views/InformationPage/QnAPage'
import InformationPage from './views/InformationPage/InformationPage'
import CollectionPage from './views/CollectionPage/CollectionPage'
import LikePage from './views/LikePage/LikePage'
import AllCollections from './views/AllPages/AllCollections'
import AllGalleries from './views/AllPages/AllGalleries'
import AllQnAs from './views/AllPages/AllQnAs'
import AllInformations from './views/AllPages/AllInformations'

import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

const AppRouter = ({isLoggedIn, userObj}) => {
    console.log("유저 오비제이22", userObj)
return(
    <Router history={history}>
        <Switch>
            <>
            <NavBar isLoggedIn={isLoggedIn} userObj={userObj}/>
            <div className="Container" style={{ minHeight: 'calc(100vh - 80px)', zIndex:-1 }}>
                <Route exact path="/">
                    <LandingPage isLoggedIn={isLoggedIn} userObj={userObj}/>
                </Route>
                <Route exact path="/profile">
                    <ProfilePage userObj={userObj}/>
                </Route>
                <Route exact path="/update">
                    <ProfilePage userObj={userObj}/>
                </Route>
                <Route exact path="/upload">
                    <UploadPage userObj={userObj}/>
                </Route>
                <Route exact path="/uploadQnA">
                    <QnAUpload userObj={userObj}/>
                </Route>
                <Route exact path="/uploadInformation">
                    <InformationUpload userObj={userObj}/>
                </Route>
                <Route exact path="/gallery/:id" component={ GalleryPage } />
                <Route exact path="/QnAPage/:id" component={QnAPage} />
                <Route exact path="/InformationPage/:id" component={InformationPage} />
                
                <Route exact path="/CollectionPage/:id" component={ CollectionPage } />
                <Route excct path="/mylikes" component={LikePage} />
                <Route exact path="/allcollections">
                    <AllCollections />
                </Route>
                <Route exact path="/allgalleries">
                    <AllGalleries />
                </Route>
                <Route exact path="/allqnas">
                    <AllQnAs />
                </Route>
                <Route exact path="/allinformations">
                    <AllInformations />
                </Route>
            </div>
            {/* <Footer /> */}
            </> 
        </Switch>
    </Router>
)
}
export default AppRouter;