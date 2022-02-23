import React from "react";
import './Home.styles.css'
import {
    Header,
    Display,
    SideMenu,
    Player
} from '../../components/index'



const Home = () => {

    return (
        <main>
            <div className="main__section">
                <SideMenu />
                <div className="main__wrapper">
                    <Header />
                    <Display />
                </div>

            </div>
            <Player />
        </main>

    )
}

export default Home