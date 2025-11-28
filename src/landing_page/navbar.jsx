import { Link } from 'react-router-dom';
import SOS_logo from '../assets/SOS_logo.svg'
import smoke_bg from '../assets/smoke_bg.svg'

function NavBar(){

    return(
    <>  
    <div className='flex flex-wrap justify-between mx-20'>
        <div className='content-center'>
            <img src={SOS_logo} alt="sos_logo" className='w-30'></img>
        </div>
        <div className='flex'>
            <div className='h-25 content-center space-x-5 text-white font-bold'>
                <Link to='/event'><span className='cursor-pointer'>Home</span></Link>
                <Link to='/'><span className='cursor-pointer'>About</span></Link>
                <Link to='/dashboard'><span className='cursor-pointer'>Dashboard</span></Link>
                <Link to='/login'><span className='cursor-pointer'>Login</span></Link>
            </div>
        </div>
    </div>
    </>
    );

}

export default NavBar;