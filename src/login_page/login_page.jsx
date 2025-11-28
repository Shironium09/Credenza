import smoke_bg from '../assets/smoke_bg.svg'
import LoginPanel from './loginpanel.jsx'

function LoginPage(){

    return(<>    
        <div className="w-full h-screen flex justify-center items-center overflow-y-hidden">
            <LoginPanel/>
        </div>
    </>);

}

export default LoginPage;