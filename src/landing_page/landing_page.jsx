import NavBar from './navbar'
import Title from './title'
import Footer from '../components/footer'

function LandingPage(){

    return(
    <>
        <div className="h-screen">
            <NavBar/>
            <Title/>
            <Footer/>
        </div>
    </>
    );


}

export default LandingPage;