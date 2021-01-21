import React from 'react';
import '../globalStyles.css';
import './landing.css';
import Navbar from '../components/navbar';
import Button from "../components/button/"
import Footer from '../components/footer';
import * as ROUTES from '../constants/routes';
import { Link } from 'react-router-dom';


export default function Landing() {
    return (
        <div className="landing--base">
            <Navbar noauth login relative yellow to={ROUTES.LANDING}/>
            <div className='index--wrapper-landing'>
                <div className='index--container'>
                    <div>
                        <h1 className='index--title-half'><span>Cloud Storage for Memories</span></h1>
                        <h2 className='index--sub'>A beautifully simple place to re&#8209;discover and share your memories.
                    </h2>
                        <div className='index--hero-button-container'>
                            <Link to={ROUTES.SIGN_UP} tabIndex="-1">
                                <Button large red text="Sign Up" sub="- it's free" />
                            </Link>
                        </div>
                    </div>
                    <div className='index--hero-img-container'>
                        <img className='index--hero-img' src="/images/landing--hero.jpg" alt="" />
                        <img src="/images/landing-graphics.svg" alt="" className='index--hero-illustrations' />
                    </div>
                </div>
                <div className='index--features-wrapper'>
                    <div className='index--container-features'>
                        <div>
                            <h1 className='index--title-full'>Made for <span>memories</span></h1>
                            <h2 className='index--sub index--sub_centered'>Features tailor-made to experience your memories and to keep them safe.</h2>
                        </div>
                        <div>
                            <div className='home--container-features-elements'>
                                <div>
                                    <div>
                                        <img src="./images/illustration--privacy.svg" alt="" />
                                    </div>
                                    <h3>Privacy first</h3>
                                    <p>We never track you. We never analyze your data. Stay in control of your privacy.
                                </p>
                                </div>
                                <div>
                                    <div>
                                        <img src="./images/illustration--server.svg" alt="" />
                                    </div>
                                    <h3>Safe Storage</h3>
                                    <p>We store your data in multiple secure locations in North America so you never have to
                                    worry.
                                </p>
                                </div>
                                <div>
                                    <div>
                                        <img src="./images/illustration--smartsearch.svg" alt="" />
                                    </div>
                                    <h3>Smart Search</h3>
                                    <p>Our smart search helps you re&#8209;discover memories by suggesting search terms.</p>
                                </div>
                                <div>
                                    <div>
                                        <img src="./images/illustration--scissors.svg" alt="" />
                                    </div>
                                    <h3>Auto-Cut<span className='global--textflag'>Beta</span></h3>
                                    <p>We automatically cut long tapes so you can find special moments faster and share them
                                    easier.
                                </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*<div className='index--container-share'>
                    <div>
                        <h1 className='index--title-full'>Made for <span>sharing</span></h1>
                        <h2 className='index--sub index--sub_centered'>Share your favourite clips through a beautifully simple
                        interface, on any device.</h2>
                    </div>
                    <div>
                        <img src="./images/landing--share.png" alt="" />
                    </div>
                </div>

                <div className='index--container-pricing-wrapper'>
                    <div className='index--container-pricing'>
                        <div>
                            <h1 className='index--title-full'>Safely store tapes <span>forever</span></h1>
                            <h2 className='index--sub index--sub_centered'>Store tapes safer than on hard-drives and more affordable
                            than with Google
                            Drive or Dropbox.</h2>
                        </div>
                        <div>
                            <div className='home--container-upgrade-plan-container'>
                                <div>
                                    <h3 className='global--font-recoleta'>Bundle</h3>
                                    <h2 className='global--font-recoleta'>20 GB</h2>
                                    <h3 className='global--font-recoleta'>50¢ / month</h3>
                                    <p>A bundle held together with rubber-bands. Holds about 10 tapes.</p>
                                </div>
                                <div>
                                    <h3 className='global--font-recoleta'>Box</h3>
                                    <h2 className='global--font-recoleta'>200 GB</h2>
                                    <h3 className='global--font-recoleta'>$2.50 / month</h3>
                                    <p>A shoebox full of tapes. Holds about 100 tapes.</p>
                                </div>
                            </div>
                        </div>
                        <img src="./images/landing--unboxing.svg" alt="" />
                    </div>
                </div>*/}

                <div className='index--container-CTA-wrapper'>
                    <div className='index--container-CTA'>
                        <img className='index--CTA-img' src="./images/illustration--swivels.svg" alt="" />
                        <div>
                            <h1 className='index--title-full'><span>Join today</span></h1>
                            <h2 className='index--sub index--sub_centered'>And get 3GB of storage for free</h2>
                            <div className='index--CTA-button-container'>
                                <Link to={ROUTES.SIGN_UP} tabIndex="-1">
                                    <Button large red text="Sign Up" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}