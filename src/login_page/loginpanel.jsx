import Google_Logo from '../assets/Google_Logo.svg'
import SOS_logo from '../assets/SOS_logo.svg'

function LoginPanel(){

    return(<>
    <div className="login_page w-full h-screen flex justify-center items-center">
        <div>
            <div className="form-card w-120 h-110 bg-white rounded-xl flex flex-col justify-center items-center p-15 border-2 border-gray-300">
                <div className="flex flex-col justify-center items-center">
                    <img src={SOS_logo} className="w-50 h-30" />
                    <h1 className="text-center text-3xl text-white text-bold">Login With Google</h1>
                    <p className="text-center text-[15px] mt-3 text-white">We only support Google login as to be able to connect it with your Google Drive and be able to store the files in your drive</p>
                </div>
                <a href="/auth/google" className="google-login-button">
                    <div>
                        <button className="p-5 mt-10 w-full h-12 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center gap-5 cursor-pointer hover:shadow-[0_0_15px_rgba(0,0,0,0.2)] transition-all duration-300">
                            <img src={Google_Logo} alt="google_logo" className="w-6 h-6"></img>
                            <span className="text-black font-bold">Login with Google</span>
                        </button>
                    </div>
                </a>
            </div>
        </div>
    </div>
    </>)

}

export default LoginPanel;