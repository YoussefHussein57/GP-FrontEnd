import React from "react"
import ReactDOM from "react-dom"

/**
Challenge: 

- Add an `ul` inside the Header's `nav` and create
  the following `li`s: "Pricing", "About", & "Contact"
- Using flexbox, line up the nav items horizontally, and
  put them inline with the React logo.
- Change the image styling to happen in CSS instead of in-line
  For practice, add a new class to the image in order to style it
*/

function Header() {
    return (
        <header>
            <nav className="nav">
                <img src="https://www.bing.com/images/search?view=detailV2&ccid=%2bBpvNzwk&id=9892D0E65457B4F9DD60987EABB88B27E2E1B5AD&thid=OIP.-BpvNzwkSx9w9LdAK1qzcgHaGo&mediaurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.f81a6f373c244b1f70f4b7402b5ab372%3frik%3drbXh4ieLuKt%252bmA%26riu%3dhttp%253a%252f%252flogos-download.com%252fwp-content%252fuploads%252f2016%252f09%252fReact_logo_logotype_emblem.png%26ehk%3dQhGOkKcUKCU7FBQgHOajOiJqJBACUTD2Ni6LsfqzCEA%253d%26risl%3d%26pid%3dImgRaw%26r%3d0&exph=4474&expw=5000&q=react+logo&simid=608036051129892690&FORM=IRPRST&ck=16D9125464A10B583082A24D6DB011DE&selectedIndex=3&itb=1&ajaxhist=0&ajaxserp=0" className="nav-logo" />
                <ul className="nav-items">
                    <li>Pricing</li>
                    <li>About</li>
                    <li>Contact</li>
                </ul>
            </nav>
        </header>
    )
}

function Footer() {
    return (
        <footer className="page-Footer">
            <small>© 2021 Ziroll development. All rights reserved.</small>
        </footer>
    )
}

function MainContent() {
    return (
        <div>
            <h1>Reasons I'm excited to learn React</h1>
            <ol>
                <li>It's a popular library, so I'll be 
                able to fit in with the cool kids!</li>
                <li>I'm more likely to get a job as a developer
                if I know React</li>
            </ol>
        </div>
    )
}

function Page() {
    return (
        <div>
            <Header />
            <MainContent />
            <Footer />
        </div>
    )
}

ReactDOM.render(<Page />, document.getElementById("root"))