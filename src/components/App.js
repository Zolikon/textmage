import Header from './Header';
import Footer from './Footer';
import Main from './Main';
import './App.css'

import { StepProvider } from "./StepContext";

function App() {    

    document.title = "TextMage"

    return <>
        <div id="inner-body">
            <Header />
            <StepProvider>
                <Main/>
            </StepProvider>
            <Footer />
        </div>
    </>

}

export default App;
